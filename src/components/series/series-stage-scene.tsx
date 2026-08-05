"use client";

import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  BACKDROP_FRAGMENT_SHADER,
  PLATE_FRAGMENT_SHADER,
  SHADOW_FRAGMENT_SHADER,
  STAGE_VERTEX_SHADER,
} from "./stage-shaders";

/** Fraction of the stage the product plate is allowed to fill (design used 92%/86%). */
const PLATE_FIT = { width: 0.92, height: 0.86 } as const;
/** Peak tilt in radians — 9° yaw, 5.5° pitch, as in the source design. */
const TILT = { yaw: 0.157, pitch: 0.096, depth: 0.22 } as const;
const CROSSFADE_PER_SECOND = 2.4;
/** Plates that are not selected sit slightly small, so a switch reads as a push-in. */
const INACTIVE_PLATE_SCALE = 0.965;
/** Below this, an animated value counts as arrived and the loop is allowed to stop. */
const SETTLE_EPSILON = 0.0008;

function approach(current: number, target: number, rate: number, delta: number) {
  return current + (target - current) * Math.min(1, rate * delta);
}

function Backdrop() {
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({}), []);
  return (
    <mesh position={[0, 0, -0.6]} renderOrder={0}>
      <planeGeometry args={[viewport.width * 1.4, viewport.height * 1.4]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={STAGE_VERTEX_SHADER}
        fragmentShader={BACKDROP_FRAGMENT_SHADER}
        depthWrite={false}
      />
    </mesh>
  );
}

function ContactShadow() {
  const { viewport } = useThree();
  const uniforms = useMemo(() => ({ uOpacity: { value: 1 } }), []);

  return (
    <mesh position={[0, -viewport.height * 0.2, -0.05]} renderOrder={1}>
      <planeGeometry args={[viewport.width * 0.78, viewport.height * 0.2]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={STAGE_VERTEX_SHADER}
        fragmentShader={SHADOW_FRAGMENT_SHADER}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

interface PlateProps {
  texture: THREE.Texture;
  isActive: boolean;
  order: number;
  instant: boolean;
}

/**
 * One product render as a plate in the scene. Every available render gets a plate and
 * stays resident, so switching configuration is a real dissolve between two textures
 * rather than an image swap with a network fetch in the middle.
 */
function Plate({ texture, isActive, order, instant }: PlateProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  // The plate that is active on mount appears at full strength: a page should not open
  // on a two-second fade-in of its own hero.
  const firstFrame = useRef(true);
  const { viewport } = useThree();
  const uniforms = useMemo(
    () => ({ uMap: { value: texture }, uOpacity: { value: 0 } }),
    [texture],
  );

  // Letterbox the plate inside the stage — "object-fit: contain", in world units.
  const [plateWidth, plateHeight] = useMemo(() => {
    const image = texture.image as { width?: number; height?: number } | undefined;
    const aspect = image?.width && image?.height ? image.width / image.height : 16 / 10;
    const boxWidth = viewport.width * PLATE_FIT.width;
    const boxHeight = viewport.height * PLATE_FIT.height;
    return aspect > boxWidth / boxHeight
      ? [boxWidth, boxWidth / aspect]
      : [boxHeight * aspect, boxHeight];
  }, [texture, viewport.width, viewport.height]);

  useFrame((state, delta) => {
    // Reached through the scene graph rather than through the memo above: per-frame
    // uniform writes belong to three's object, not to React's render output.
    const mesh = meshRef.current;
    const opacity = (mesh?.material as THREE.ShaderMaterial | undefined)?.uniforms.uOpacity;
    if (!mesh || !opacity) return;

    const snap = instant || firstFrame.current;
    firstFrame.current = false;

    const target = isActive ? 1 : 0;
    opacity.value = snap
      ? target
      : approach(opacity.value, target, CROSSFADE_PER_SECOND, delta);
    mesh.visible = opacity.value > 0.004;

    const scaleTarget = isActive ? 1 : INACTIVE_PLATE_SCALE;
    const scale = snap
      ? scaleTarget
      : approach(mesh.scale.x / plateWidth, scaleTarget, CROSSFADE_PER_SECOND, delta);
    mesh.scale.set(plateWidth * scale, plateHeight * scale, 1);

    // The loop is demand-driven; keep it alive only while this plate is still moving.
    if (Math.abs(opacity.value - target) > SETTLE_EPSILON) state.invalidate();
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, viewport.height * 0.02, 0]}
      scale={[plateWidth * INACTIVE_PLATE_SCALE, plateHeight * INACTIVE_PLATE_SCALE, 1]}
      renderOrder={2 + order}
      visible={false}
    >
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={STAGE_VERTEX_SHADER}
        fragmentShader={PLATE_FRAGMENT_SHADER}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}

interface StageContentProps {
  sources: string[];
  activeSrc: string;
  tilt: boolean;
  pointerActive: boolean;
}

function StageContent({ sources, activeSrc, tilt, pointerActive }: StageContentProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useThree((state) => state.pointer);
  const invalidate = useThree((state) => state.invalidate);
  const canvas = useThree((state) => state.gl.domElement);
  // TextureLoader leaves `colorSpace` at NoColorSpace, which is what the raw shaders
  // in stage-shaders.ts expect — see the colour-handling note there. Nothing to set.
  const textures = useLoader(THREE.TextureLoader, sources);

  // Kick the demand-driven loop whenever an input the animation reads has changed.
  useEffect(() => {
    invalidate();
  }, [invalidate, activeSrc, tilt, pointerActive]);

  // Pointer movement drives the tilt, so each move needs a frame.
  useEffect(() => {
    const onMove = () => invalidate();
    canvas.addEventListener("pointermove", onMove, { passive: true });
    return () => canvas.removeEventListener("pointermove", onMove);
  }, [canvas, invalidate]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const engaged = tilt && pointerActive;
    const yaw = engaged ? pointer.x * TILT.yaw : 0;
    const pitch = engaged ? -pointer.y * TILT.pitch : 0;
    const depth = engaged ? TILT.depth : 0;
    const rate = engaged ? 9 : 4;
    group.rotation.y = approach(group.rotation.y, yaw, rate, delta);
    group.rotation.x = approach(group.rotation.x, pitch, rate, delta);
    group.position.z = approach(group.position.z, depth, rate, delta);

    const settled =
      Math.abs(group.rotation.y - yaw) < SETTLE_EPSILON &&
      Math.abs(group.rotation.x - pitch) < SETTLE_EPSILON &&
      Math.abs(group.position.z - depth) < SETTLE_EPSILON;
    if (!settled) state.invalidate();
  });

  return (
    <>
      <Backdrop />
      <group ref={groupRef}>
        <ContactShadow />
        {sources.map((src, index) => (
          <Plate
            key={src}
            texture={textures[index]}
            isActive={src === activeSrc}
            order={index}
            instant={!tilt}
          />
        ))}
      </group>
    </>
  );
}

export interface ProsStageSceneProps {
  /** Every render to keep resident on the GPU, so switching configuration is instant. */
  sources: string[];
  /** The render currently selected. Must be one of `sources`. */
  activeSrc: string;
  /** `false` under `prefers-reduced-motion` — kills tilt and crossfade. */
  tilt: boolean;
  pointerActive: boolean;
}

/**
 * WebGL stage for the PROS viewer. Rendered client-side only (see pros-stage.tsx) and
 * always behind a DOM fallback, so a machine without WebGL still gets the render.
 */
export default function ProsStageScene({
  sources,
  activeSrc,
  tilt,
  pointerActive,
}: ProsStageSceneProps) {
  if (sources.length === 0) return null;
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 30 }}
      // Demand-driven: frames are requested by the animations themselves, so an idle
      // viewer costs nothing instead of holding a permanent requestAnimationFrame loop.
      frameloop="demand"
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: false }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <Suspense fallback={null}>
        <StageContent
          sources={sources}
          activeSrc={activeSrc}
          tilt={tilt}
          pointerActive={pointerActive}
        />
      </Suspense>
    </Canvas>
  );
}
