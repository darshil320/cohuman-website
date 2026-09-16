"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Scroll-driven assembly.
 *
 * Built from primitives sized off the series specification rather than a model file, so
 * the table can never show a size the chart does not offer and a new series needs no new
 * asset.
 *
 * The LAYOUT follows the selected configuration. A bench configuration is a back-to-back
 * cluster — two rows of tops meeting on a central spine, screens standing on that spine
 * and crossing at the middle, A-frames at the outer corners and straight mid legs down
 * the spine. Drawing every configuration as one rectangular top was the single biggest
 * thing making this not look like the product.
 *
 * `progress` runs 0 → 1 as the section is scrubbed; each part owns a slice of it.
 */

/** Scene units are metres; the specification is millimetres. */
const MM = 0.001;

/** Table top: 25mm particle board with a 2mm PVC edge band (PROS.pdf p3, item 7). */
const TOP_THICKNESS = 0.025;
const EDGE_BAND = 0.002;
/**
 * Side leg: round tube, widest under the top and tapering to the foot — the profile in
 * the specification's cover drawing. 1.5mm pipe per the part list.
 */
const LEG_TOP_R = 0.032;
const LEG_FOOT_R = 0.019;
/** Middle leg is the heavier 2.0mm pipe, and runs straight rather than splayed. */
const MID_LEG_R = 0.028;
/**
 * VARIDEX post: the part list calls it 40 × 25mm, but in the renders it reads square and
 * heavier than that, standing right at the corner of the top. Drawn to the render.
 */
const POST_W = 0.05;
const POST_D = 0.05;
/** VARIDEX ties its legs with a perimeter rail rather than a pair of side bars. */
const RAIL = 0.035;
/**
 * The straight-post chassis sits almost at the corner — its tops barely overhang, where
 * the splayed-tube chassis needs room for the foot to land under the surface.
 */
const POST_OVERHANG = 0.05;
/** Top overhangs the frame, which is what gives the range its floating look. */
const OVERHANG = 0.13;

export interface AssemblyPart {
  key: string;
  label: string;
  /** Part number as printed on the specification's anatomy page. */
  ref: string;
  from: number;
  to: number;
}

/** Build order — the frame goes together from the floor up. */
export const ASSEMBLY_PARTS: AssemblyPart[] = [
  { key: "legs", label: "Side legs", ref: "2", from: 0.03, to: 0.30 },
  { key: "mid", label: "Bench mid leg", ref: "1", from: 0.26, to: 0.44 },
  { key: "beam", label: "Horizontal bar", ref: "4", from: 0.40, to: 0.56 },
  { key: "top", label: "Table tops", ref: "7", from: 0.52, to: 0.74 },
  { key: "modesty", label: "Modesty panel", ref: "8", from: 0.70, to: 0.84 },
  { key: "screen", label: "Desk screens", ref: "—", from: 0.80, to: 0.96 },
];

/** Eased 0 → 1 for one part's slice of the overall scroll. */
function slice(progress: number, from: number, to: number): number {
  const t = THREE.MathUtils.clamp((progress - from) / (to - from), 0, 1);
  return 1 - Math.pow(1 - t, 5);
}

/**
 * Which chassis the series uses.
 *
 * `splayed-tube` is PROS: a tapered round tube per corner, leaning outward, in white.
 * `straight-post` is VARIDEX: a vertical rectangular post with a perimeter rail joining
 * the legs, in dark graphite. They are different products and drawing both as one frame
 * made the two collection pages show the same table.
 */
export type ChassisKind = "splayed-tube" | "straight-post";

interface SceneProps {
  /** 0 = fully exploded, 1 = assembled. */
  progress: number;
  chassis: ChassisKind;
  /** False once the section has left the viewport — the loop stops rather than spinning. */
  active?: boolean;
  widthMm: number;
  depthMm: number;
  heightMm: number;
  topColor: string;
  frameColor: string;
  hasScreen: boolean;
  /** True for a back-to-back bench: two rows of tops on a shared spine. */
  isBench: boolean;
  /** Seats along one row — 2 gives a 2×2 cluster of tops. */
  bays: number;
}

/**
 * One corner leg.
 *
 * A single tapered tube per corner — four in the whole table, not eight. The "A-frame"
 * I had before was wrong: the manufacturer's close-ups show one leg at each corner,
 * leaning outward along the table's length and tapering to the floor with no visible
 * foot cap.
 *
 * `dir` is which end of the table the leg stands at, so both ends lean away from the
 * centre and the pair reads as a splayed trestle from the side.
 */
function CornerLeg({
  h,
  color,
  dir,
  legT,
  chassis,
}: {
  h: number;
  color: string;
  dir: number;
  legT: number;
  chassis: ChassisKind;
}) {
  if (chassis === "straight-post") {
    /*
      VARIDEX: a vertical rectangular post, 40 × 25mm, no lean and no taper. It drops
      straight down from the top rather than swinging in.
    */
    return (
      <group position={[0, h, 0]} rotation={[0, 0, (1 - legT) * 0.9 * dir]}>
        <mesh position={[0, -h / 2 - 0.006, 0]} castShadow>
          {/* Stops just under the top rather than passing through its surface. */}
          <boxGeometry args={[POST_W, h - 0.012, POST_D]} />
          <meshStandardMaterial
            color={color}
            roughness={0.42}
            metalness={0.28}
            envMapIntensity={0.6}
          />
        </mesh>
      </group>
    );
  }

  // Lean measured off the cover drawing and the close-up: the foot sits about a fifth
  // of the working height outboard of where the leg meets the top.
  const splay = h * 0.2;
  const lean = Math.atan(splay / h);

  return (
    <group
      // Pivoted about the top, where the leg actually attaches, so it swings down into
      // place rather than sliding up from the floor.
      position={[0, h, 0]}
      rotation={[0, 0, dir * lean * legT + dir * (1 - legT) * 1.15]}
    >
      <mesh position={[0, -h / 2, 0]} castShadow>
        {/*
          Round tube, widest under the top and tapering toward the floor. The foot is the
          tube's own end — the product has no black cap, so one is not drawn.
        */}
        <cylinderGeometry args={[LEG_TOP_R, LEG_FOOT_R, h, 40]} />
        <meshStandardMaterial
          color={color}
          roughness={0.33}
          metalness={0.3}
          envMapIntensity={0.7}
        />
      </mesh>
    </group>
  );
}

function Assembly({
  progress,
  chassis,
  widthMm,
  depthMm,
  heightMm,
  topColor,
  frameColor,
  hasScreen,
  isBench,
  bays,
}: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const invalidate = useThree((state) => state.invalidate);

  // `frameloop="demand"` only paints when something asks it to, and a changed prop is
  // not an ask — without this the assembly freezes on whatever frame it last drew.
  useEffect(() => {
    invalidate();
  }, [
    invalidate,
    progress,
    chassis,
    topColor,
    frameColor,
    hasScreen,
    widthMm,
    depthMm,
    isBench,
    bays,
  ]);

  const bayW = widthMm * MM;
  const bayD = depthMm * MM;
  const h = heightMm * MM;

  // A bench is two rows deep and `bays` wide; anything else is a single top.
  const cols = isBench ? bays : 1;
  const rows = isBench ? 2 : 1;
  const totalW = bayW * cols;
  const totalD = bayD * rows;

  const t = useMemo(
    () =>
      Object.fromEntries(
        ASSEMBLY_PARTS.map((part) => [part.key, slice(progress, part.from, part.to)]),
      ) as Record<string, number>,
    [progress],
  );

  // Turns through the scroll so parts are seen from a changing angle as they land, then
  // keeps turning gently once assembled.
  useFrame((state) => {
    if (!group.current) return;
    const eased = 1 - Math.pow(1 - THREE.MathUtils.clamp(progress, 0, 1), 3);
    const base = THREE.MathUtils.lerp(-1.0, -0.52, eased);
    const settled = THREE.MathUtils.clamp((progress - 0.88) / 0.12, 0, 1);
    group.current.rotation.y = base + Math.sin(state.clock.elapsedTime * 0.3) * 0.22 * settled;
    // On `demand` a frame is only drawn when something asks for one.
    if (settled > 0) invalidate();
  });

  /** Outer corners only — the spine is carried by the straight mid legs. */
  // Far enough in that the splayed foot lands under the top, not past its end.
  const cornerInset =
    chassis === "straight-post" ? POST_OVERHANG : OVERHANG + h * 0.2;
  // Depth inset matches the chassis too: the straight post stands at the corner, the
  // splayed tube needs its foot to land under the surface.
  const edgeInset = chassis === "straight-post" ? POST_OVERHANG : 0.1;
  const corners: [number, number][] = [
    [-totalW / 2 + cornerInset, -totalD / 2 + edgeInset],
    [totalW / 2 - cornerInset, -totalD / 2 + edgeInset],
    [-totalW / 2 + cornerInset, totalD / 2 - edgeInset],
    [totalW / 2 - cornerInset, totalD / 2 - edgeInset],
  ];

  /** Straight posts down the centre spine, between the bays. */
  const spineXs = isBench
    ? Array.from({ length: cols + 1 }, (_, i) => -totalW / 2 + i * bayW).filter(
        (x) => Math.abs(Math.abs(x) - totalW / 2) > 0.001,
      )
    : [];

  return (
    <group ref={group} position={[0, -h * 0.56, 0]}>
      {/* One leg per corner — four in the whole table. */}
      {corners.map(([x, z], i) => (
        <group key={`corner-${i}`} position={[x, 0, z]}>
          <CornerLeg
            h={h}
            color={frameColor}
            chassis={chassis}
            // Legs at the near end lean one way, the far end the other, so the pair
            // reads as a splayed trestle rather than a parallelogram.
            dir={x < 0 ? -1 : 1}
            legT={t.legs}
          />
        </group>
      ))}

      {/* Straight mid legs on the spine — vertical, as the renders show. */}
      {spineXs.map((x, i) => (
        <group key={`spine-${i}`} position={[x, 0, 0]}>
          <mesh
            position={[0, (h * t.mid) / 2, 0]}
            scale={[1, t.mid, 1]}
            castShadow
          >
            <cylinderGeometry args={[MID_LEG_R, MID_LEG_R, h, 32]} />
            <meshStandardMaterial color={frameColor} roughness={0.38} metalness={0.22} />
          </mesh>
        </group>
      ))}

      {/*
        VARIDEX ties its posts with a rail around the whole perimeter, sitting just under
        the tops — visible in its renders as a continuous line between the legs.
      */}
      {chassis === "straight-post" ? (
        <group
          position={[0, h - 0.05 + (1 - t.beam) * 0.5, 0]}
          scale={[1, t.beam, 1]}
        >
          {[-1, 1].map((sz) => (
            <mesh
              key={`rail-long-${sz}`}
              position={[0, 0, sz * (totalD / 2 - POST_OVERHANG)]}
              castShadow
            >
              <boxGeometry args={[totalW - cornerInset * 2, RAIL, RAIL]} />
              <meshStandardMaterial color={frameColor} roughness={0.42} metalness={0.28} />
            </mesh>
          ))}
          {[-1, 1].map((sx) => (
            <mesh
              key={`rail-end-${sx}`}
              position={[sx * (totalW / 2 - cornerInset), 0, 0]}
              castShadow
            >
              <boxGeometry args={[RAIL, RAIL, (totalD / 2 - POST_OVERHANG) * 2]} />
              <meshStandardMaterial color={frameColor} roughness={0.42} metalness={0.28} />
            </mesh>
          ))}
        </group>
      ) : null}

      {/*
        Side bar — 60 × 25mm section, running leg to leg under each row and set inside
        the overhang so it is hidden by the top rather than projecting past it.
      */}
      {chassis === "splayed-tube" &&
        Array.from({ length: rows }, (_, r) => {
        const dir = rows === 1 ? 0 : r === 0 ? -1 : 1;
        return (
          <group
            key={`bar-${r}`}
            position={[
              0,
              h - 0.055 + (1 - t.beam) * 0.55,
              dir * (totalD / 2 - OVERHANG - 0.03),
            ]}
            rotation={[0, 0, (1 - t.beam) * 0.4]}
          >
            <mesh castShadow>
              <boxGeometry args={[totalW - cornerInset * 2, 0.025, 0.06]} />
              <meshStandardMaterial color={frameColor} roughness={0.4} metalness={0.2} />
            </mesh>
          </group>
        );
      })}

      {/* Tops — one per bay, so a 4-seater reads as four surfaces with visible joints. */}
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const x = -totalW / 2 + bayW / 2 + c * bayW;
          const z = rows === 1 ? 0 : (r === 0 ? -1 : 1) * (bayD / 2);
          const delay = (r * cols + c) * 0.04;
          const tt = THREE.MathUtils.clamp((t.top - delay) / (1 - delay || 1), 0, 1);
          return (
            <group
              key={`top-${r}-${c}`}
              position={[x, h + TOP_THICKNESS / 2 + (1 - tt) * 1.25, z]}
              rotation={[(1 - tt) * -0.26, (1 - tt) * 0.36, 0]}
            >
              <mesh castShadow receiveShadow>
                <boxGeometry args={[bayW - 0.004, TOP_THICKNESS, bayD - 0.004]} />
                <meshStandardMaterial
                  color={topColor}
                  roughness={0.52}
                  metalness={0.04}
                  envMapIntensity={0.5}
                />
              </mesh>
              {/* 2mm PVC edge band, slightly darker than the melamine face. */}
              <mesh position={[0, -TOP_THICKNESS / 2 + EDGE_BAND / 2, 0]}>
                <boxGeometry args={[bayW - 0.002, EDGE_BAND, bayD - 0.002]} />
                <meshStandardMaterial color={topColor} roughness={0.5} metalness={0.04} />
              </mesh>
              {/* Cable slot inset in the surface, as photographed. */}
              <mesh position={[0, TOP_THICKNESS / 2 + 0.0006, (rows === 1 ? -1 : r === 0 ? 1 : -1) * bayD * 0.3]}>
                <boxGeometry args={[0.18, 0.002, 0.026]} />
                <meshStandardMaterial color="#6F7478" roughness={0.5} metalness={0.3} />
              </mesh>
            </group>
          );
        }),
      )}

      {/*
        Modesty panel — one only.

        On a back-to-back bench it is the shared divider hung under the centre spine, not
        a skirt around the outside: one panel down the middle, between the two rows. A
        single table hangs its one panel off the back edge instead.
      */}
      <group
        position={[
          0,
          h - 0.185,
          isBench ? 0 : -totalD / 2 + 0.06 - (1 - t.modesty) * 0.45,
        ]}
        scale={[1, t.modesty, 1]}
      >
        <mesh castShadow>
          <boxGeometry args={[totalW - OVERHANG * 2, 0.31, 0.018]} />
          <meshStandardMaterial
            color={topColor}
            roughness={0.7}
            metalness={0.02}
            transparent
            opacity={t.modesty}
          />
        </mesh>
      </group>

      {/*
        Screens. On a bench they stand on the spine and run the length, with a short
        return across the middle — the cross the renders show in plan. On a single top
        one screen stands on the back edge.
      */}
      {hasScreen ? (
        <group position={[0, h + TOP_THICKNESS + 0.17 - (1 - t.screen) * 0.4, 0]}>
          {isBench ? (
            <>
              <mesh castShadow>
                <boxGeometry args={[totalW * 0.98, 0.34, 0.024]} />
                <meshStandardMaterial
                  color="#C6C4BF"
                  roughness={1}
                  metalness={0}
                  transparent
                  opacity={t.screen}
                />
              </mesh>
              {/* Cross return at the centre, dividing the two bays of each row. */}
              <mesh rotation={[0, Math.PI / 2, 0]} castShadow>
                <boxGeometry args={[totalD * 0.92, 0.34, 0.024]} />
                <meshStandardMaterial
                  color="#C6C4BF"
                  roughness={1}
                  metalness={0}
                  transparent
                  opacity={t.screen}
                />
              </mesh>
            </>
          ) : (
            <group position={[0, 0, -totalD / 2 + 0.04]}>
              <mesh castShadow>
                <boxGeometry args={[totalW * 0.94, 0.34, 0.022]} />
                <meshStandardMaterial
                  color="#C6C4BF"
                  roughness={1}
                  metalness={0}
                  transparent
                  opacity={t.screen}
                />
              </mesh>
            </group>
          )}
        </group>
      ) : null}

      {/* Floor shadow catcher. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={0.12} />
      </mesh>
    </group>
  );
}

/** Pulls back and drops toward eye level as the cluster comes together. */
function Rig({
  widthMm,
  depthMm,
  isBench,
  bays,
  progress,
}: {
  widthMm: number;
  depthMm: number;
  isBench: boolean;
  bays: number;
  progress: number;
}) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3());

  useFrame(() => {
    const totalW = widthMm * MM * (isBench ? bays : 1);
    const totalD = depthMm * MM * (isBench ? 2 : 1);
    // Frame the cluster's diagonal, not just its width: VARIDEX's bay is twice the depth
    // of PROS's, and sizing off width alone put its cluster outside the frustum.
    const span = Math.hypot(totalW, totalD);
    const eased = 1 - Math.pow(1 - THREE.MathUtils.clamp(progress, 0, 1), 3);
    const distance = THREE.MathUtils.clamp(span * 0.95 + 1.1, 2.6, 9);
    const height = THREE.MathUtils.lerp(distance * 0.5, distance * 0.3, eased);

    target.current.set(distance * 0.66, height, distance * 0.88);
    camera.position.lerp(target.current, 0.09);
    camera.lookAt(0, 0.02, 0);
  });

  return null;
}

export default function AssemblyScene(props: SceneProps) {
  return (
    <Canvas
      // Demand-driven: a frame is rendered when `progress` changes, and the loop is idle
      // the rest of the time. A pinned WebGL stage on `always` keeps a core busy long
      // after the visitor has scrolled past it.
      frameloop={props.active === false ? "never" : "demand"}
      shadows
      dpr={[1, 2]}
      camera={{ fov: 32, position: [3, 2, 3.8] }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Studio lighting, matching the manufacturer's own white-sweep renders. */}
      <ambientLight intensity={0.72} />
      <hemisphereLight args={["#ffffff", "#E8E6E1", 0.55]} />
      <directionalLight
        position={[3.6, 6.2, 3.4]}
        intensity={1.25}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      {/* Fill from the opposite side, and a low bounce so undersides are not dead flat. */}
      <directionalLight position={[-3.8, 2.6, -2.4]} intensity={0.38} />
      <directionalLight position={[0, -1.4, 2.6]} intensity={0.16} />
      <Rig
        widthMm={props.widthMm}
        depthMm={props.depthMm}
        isBench={props.isBench}
        bays={props.bays}
        progress={props.progress}
      />
      <Assembly {...props} />
    </Canvas>
  );
}
