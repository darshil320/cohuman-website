"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Full-screen image viewer.
 *
 * The interaction set is the one people already know from photo viewers: pinch or wheel
 * to zoom about the pointer, drag the picture 1:1 once it is bigger than the screen,
 * swipe sideways to change picture, drag down to dismiss, double-tap to toggle. Every
 * gesture tracks continuously and hands its release velocity to the spring that follows
 * it, so there is no seam between dragging and animating, and any of it can be grabbed
 * mid-flight.
 *
 * Radix Dialog supplies the parts that are easy to get wrong: focus trap, restore on
 * close, `Escape`, scroll lock and `aria-modal`.
 */

export interface LightboxItem {
  src: string;
  alt: string;
  /** Line shown under the picture. */
  caption?: string;
}

interface ImageLightboxProps {
  items: LightboxItem[];
  index: number;
  open: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
/** Where a double-tap lands. */
const STEP_SCALE = 2.5;
/** Past this much drag (or projected drag) the viewer dismisses. */
const DISMISS_PX = 140;
/** Fraction of the viewport a sideways throw must cover to turn the page. */
const PAGE_FRACTION = 0.28;

const SPRING = { type: "spring", bounce: 0, duration: 0.42 } as const;
const SETTLE = { type: "spring", bounce: 0.12, duration: 0.5 } as const;

/**
 * Apple's momentum projection (Designing Fluid Interfaces): where a flick would come to
 * rest, given the velocity it was released at. Not the textbook v²/2a.
 */
function project(velocity: number, decelerationRate = 0.998): number {
  return ((velocity / 1000) * decelerationRate) / (1 - decelerationRate);
}

/** Progressive resistance past a boundary, so an edge reads as soft rather than frozen. */
function rubberband(overshoot: number, dimension: number, constant = 0.55): number {
  return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

interface Sample {
  x: number;
  y: number;
  t: number;
}

type Mode = "idle" | "pan" | "pinch";

export function ImageLightbox({
  items,
  index,
  open,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const item = items[index];
  const reduceMotion = useReducedMotion();

  const viewportRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const backdrop = useMotionValue(1);

  const [zoomed, setZoomed] = useState(false);
  const [natural, setNatural] = useState<{ w: number; h: number } | null>(null);
  /** −1 entering from the left, 1 from the right, 0 on open. */
  const [enterFrom, setEnterFrom] = useState(0);

  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const mode = useRef<Mode>("idle");
  const start = useRef({ x: 0, y: 0, scale: 1, dist: 0, midX: 0, midY: 0 });
  const samples = useRef<Sample[]>([]);
  const lastTap = useRef(0);

  /** The picture's on-screen box at scale 1 — what pan bounds are measured against. */
  const contentBox = useCallback(() => {
    const view = viewportRef.current?.getBoundingClientRect();
    if (!view) return { w: 0, h: 0, viewW: 0, viewH: 0 };
    if (!natural) return { w: view.width, h: view.height, viewW: view.width, viewH: view.height };
    const fit = Math.min(view.width / natural.w, view.height / natural.h);
    return {
      w: natural.w * fit,
      h: natural.h * fit,
      viewW: view.width,
      viewH: view.height,
    };
  }, [natural]);

  const bounds = useCallback(
    (atScale: number) => {
      const { w, h, viewW, viewH } = contentBox();
      return {
        x: Math.max(0, (w * atScale - viewW) / 2),
        y: Math.max(0, (h * atScale - viewH) / 2),
      };
    },
    [contentBox],
  );

  const reset = useCallback(
    (immediate = false) => {
      const options = immediate || reduceMotion ? { duration: 0 } : SPRING;
      animate(scale, 1, options);
      animate(x, 0, options);
      animate(y, 0, options);
      backdrop.set(1);
      setZoomed(false);
    },
    [backdrop, reduceMotion, scale, x, y],
  );

  // A new picture — or a fresh open — always starts framed, never inheriting the last
  // one's zoom. Done as a render-phase reset rather than in an effect so the first frame
  // of the new picture is already correct instead of being corrected one render later.
  const [shown, setShown] = useState({ index, open });
  if (shown.index !== index || shown.open !== open) {
    setShown({ index, open });
    setZoomed(false);
    setNatural(null);
    scale.jump(1);
    x.jump(0);
    y.jump(0);
    backdrop.jump(1);
  }

  const goto = useCallback(
    (next: number, direction: number) => {
      if (next < 0 || next >= items.length || next === index) return;
      setEnterFrom(direction);
      x.set(0);
      y.set(0);
      onIndexChange(next);
    },
    [index, items.length, onIndexChange, x, y],
  );

  /** Zoom about a point, so the pixel under the pointer stays under the pointer. */
  const zoomAt = useCallback(
    (nextScale: number, pointX: number, pointY: number, immediate = false) => {
      const view = viewportRef.current?.getBoundingClientRect();
      if (!view) return;
      const current = scale.get();
      const target = clamp(nextScale, MIN_SCALE, MAX_SCALE);
      const ratio = target / current;
      // Pointer relative to the viewport centre, which is the transform origin.
      const px = pointX - view.left - view.width / 2;
      const py = pointY - view.top - view.height / 2;
      const limit = bounds(target);
      const nextX = clamp(px - ratio * (px - x.get()), -limit.x, limit.x);
      const nextY = clamp(py - ratio * (py - y.get()), -limit.y, limit.y);
      const options = immediate || reduceMotion ? { duration: 0 } : SPRING;
      animate(scale, target, options);
      animate(x, target === 1 ? 0 : nextX, options);
      animate(y, target === 1 ? 0 : nextY, options);
      setZoomed(target > 1.01);
    },
    [bounds, reduceMotion, scale, x, y],
  );

  /** Toolbar and keyboard zoom: anchored at the middle of the stage, not the pointer. */
  const zoomBy = useCallback(
    (factor: number) => {
      const view = viewportRef.current?.getBoundingClientRect();
      if (!view) return;
      zoomAt(scale.get() * factor, view.left + view.width / 2, view.top + view.height / 2);
    },
    [scale, zoomAt],
  );

  const velocity = useCallback(() => {
    const list = samples.current;
    if (list.length < 2) return { vx: 0, vy: 0 };
    const last = list[list.length - 1];
    // ~80ms of history: long enough to be stable, short enough to be current.
    const first = list.find((sample) => last.t - sample.t < 80) ?? list[0];
    const dt = Math.max(1, last.t - first.t) / 1000;
    return { vx: (last.x - first.x) / dt, vy: (last.y - first.y) / dt };
  }, []);

  const onPointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      (event.target as Element).setPointerCapture?.(event.pointerId);
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      samples.current = [{ x: event.clientX, y: event.clientY, t: event.timeStamp }];

      if (pointers.current.size === 2) {
        const [a, b] = [...pointers.current.values()];
        mode.current = "pinch";
        start.current = {
          x: x.get(),
          y: y.get(),
          scale: scale.get(),
          dist: Math.hypot(a.x - b.x, a.y - b.y),
          midX: (a.x + b.x) / 2,
          midY: (a.y + b.y) / 2,
        };
        return;
      }

      mode.current = "pan";
      start.current = {
        ...start.current,
        x: x.get(),
        y: y.get(),
        scale: scale.get(),
        midX: event.clientX,
        midY: event.clientY,
      };
    },
    [scale, x, y],
  );

  const onPointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pointers.current.has(event.pointerId)) return;
      pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      samples.current.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
      if (samples.current.length > 8) samples.current.shift();

      if (mode.current === "pinch" && pointers.current.size >= 2) {
        const [a, b] = [...pointers.current.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const next = clamp(
          (start.current.scale * dist) / (start.current.dist || 1),
          MIN_SCALE * 0.85,
          MAX_SCALE,
        );
        const ratio = next / start.current.scale;
        const view = viewportRef.current?.getBoundingClientRect();
        if (!view) return;
        const px = start.current.midX - view.left - view.width / 2;
        const py = start.current.midY - view.top - view.height / 2;
        scale.set(next);
        x.set(px - ratio * (px - start.current.x));
        y.set(py - ratio * (py - start.current.y));
        return;
      }

      const dx = event.clientX - start.current.midX;
      const dy = event.clientY - start.current.midY;

      if (scale.get() > 1.01) {
        // Panning a zoomed picture: 1:1 inside the bounds, resisted outside them.
        const limit = bounds(scale.get());
        const rawX = start.current.x + dx;
        const rawY = start.current.y + dy;
        const overX = rawX > limit.x ? rawX - limit.x : rawX < -limit.x ? rawX + limit.x : 0;
        const overY = rawY > limit.y ? rawY - limit.y : rawY < -limit.y ? rawY + limit.y : 0;
        const view = contentBox();
        x.set(overX ? clamp(rawX - overX, -limit.x, limit.x) + rubberband(overX, view.viewW) : rawX);
        y.set(overY ? clamp(rawY - overY, -limit.y, limit.y) + rubberband(overY, view.viewH) : rawY);
        return;
      }

      // Framed: sideways turns the page, downwards dismisses. Whichever axis leads wins,
      // and the loser is damped so the picture does not wander diagonally.
      const horizontal = Math.abs(dx) > Math.abs(dy);
      const view = contentBox();
      if (horizontal) {
        const atEdge = (dx > 0 && index === 0) || (dx < 0 && index === items.length - 1);
        x.set(atEdge ? rubberband(dx, view.viewW) : dx);
        y.set(dy * 0.15);
      } else {
        x.set(dx * 0.15);
        y.set(dy);
        backdrop.set(clamp(1 - Math.abs(dy) / (DISMISS_PX * 3), 0.25, 1));
      }
    },
    [backdrop, bounds, contentBox, index, items.length, scale, x, y],
  );

  const onPointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      pointers.current.delete(event.pointerId);
      const wasPinch = mode.current === "pinch";
      if (pointers.current.size > 0) return;
      mode.current = "idle";

      const { vx, vy } = velocity();
      const current = scale.get();

      if (wasPinch || current > 1.01) {
        if (current < 1.05) {
          reset();
          return;
        }
        setZoomed(true);
        const limit = bounds(current);
        // Carry the release velocity into the settle, then land inside the bounds.
        animate(scale, clamp(current, MIN_SCALE, MAX_SCALE), SPRING);
        animate(x, clamp(x.get() + project(vx) * 0.35, -limit.x, limit.x), {
          ...SETTLE,
          velocity: vx,
        });
        animate(y, clamp(y.get() + project(vy) * 0.35, -limit.y, limit.y), {
          ...SETTLE,
          velocity: vy,
        });
        return;
      }

      const dx = x.get();
      const dy = y.get();
      const view = contentBox();

      if (Math.abs(dy) > Math.abs(dx) && dy + project(vy) > DISMISS_PX) {
        onClose();
        return;
      }

      const thrown = dx + project(vx);
      if (Math.abs(thrown) > view.viewW * PAGE_FRACTION) {
        const direction = thrown > 0 ? -1 : 1;
        const next = index + direction;
        if (next >= 0 && next < items.length) {
          goto(next, direction);
          return;
        }
      }

      backdrop.set(1);
      animate(x, 0, { ...SETTLE, velocity: vx });
      animate(y, 0, { ...SETTLE, velocity: vy });
    },
    [backdrop, bounds, contentBox, goto, index, items.length, onClose, reset, scale, velocity, x, y],
  );

  /**
   * A double-tap should be worth taking. On a portrait phone a landscape render fits to
   * a thin strip, so the step goes to whatever fills the screen rather than a flat 2.5×.
   */
  const stepScale = useCallback(() => {
    const { h, viewH } = contentBox();
    if (!h) return STEP_SCALE;
    return clamp(Math.max(STEP_SCALE, viewH / h), STEP_SCALE, MAX_SCALE);
  }, [contentBox]);

  const onDoubleClick = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (scale.get() > 1.01) reset();
      else zoomAt(stepScale(), event.clientX, event.clientY);
    },
    [reset, scale, stepScale, zoomAt],
  );

  /** Touch has no dblclick, so pair up two quick taps by hand. */
  const onTapEnd = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") return;
      const now = event.timeStamp;
      if (now - lastTap.current < 300) {
        if (scale.get() > 1.01) reset();
        else zoomAt(stepScale(), event.clientX, event.clientY);
        lastTap.current = 0;
        return;
      }
      lastTap.current = now;
    },
    [reset, scale, stepScale, zoomAt],
  );

  const onWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      event.preventDefault();
      zoomAt(scale.get() * Math.exp(-event.deltaY * 0.0016), event.clientX, event.clientY, true);
    },
    [scale, zoomAt],
  );

  // `preventDefault` inside a React wheel handler is ignored — React attaches it
  // passively — so the browser's page zoom needs a non-passive listener to be stopped.
  useEffect(() => {
    const node = viewportRef.current;
    if (!node || !open) return;
    const block = (event: WheelEvent) => event.preventDefault();
    node.addEventListener("wheel", block, { passive: false });
    return () => node.removeEventListener("wheel", block);
  }, [open]);

  const onKeyDown = useCallback(
    (event: ReactKeyboardEvent) => {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          goto(index - 1, -1);
          break;
        case "ArrowRight":
          event.preventDefault();
          goto(index + 1, 1);
          break;
        case "+":
        case "=":
          event.preventDefault();
          zoomBy(1.4);
          break;
        case "-":
          event.preventDefault();
          zoomBy(1 / 1.4);
          break;
        case "0":
          event.preventDefault();
          reset();
          break;
        default:
          break;
      }
    },
    [goto, index, reset, zoomBy],
  );

  if (!item) return null;

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay asChild>
          <motion.div
            className="fixed inset-0 z-[70] bg-co-ink/94 backdrop-blur-md"
            style={{ opacity: backdrop }}
          />
        </Dialog.Overlay>
        <Dialog.Content
          onKeyDown={onKeyDown}
          className="fixed inset-0 z-[71] flex flex-col outline-none"
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">{item.alt}</Dialog.Title>

          <header className="relative z-10 flex shrink-0 items-center gap-3 px-3 py-3 sm:px-5">
            {items.length > 1 ? (
              <span className="font-mono text-[12px] font-semibold tracking-[0.1em] text-co-bg/70">
                {index + 1} / {items.length}
              </span>
            ) : null}
            <div className="ml-auto flex items-center gap-1.5">
              <RoundButton
                label="Zoom out"
                disabled={!zoomed}
                onClick={() => zoomBy(1 / 1.5)}
              >
                <MinusIcon />
              </RoundButton>
              <RoundButton label="Zoom in" onClick={() => zoomBy(1.5)}>
                <PlusIcon />
              </RoundButton>
              <Dialog.Close asChild>
                <RoundButton label="Close">
                  <CloseIcon />
                </RoundButton>
              </Dialog.Close>
            </div>
          </header>

          <div
            ref={viewportRef}
            className={cn(
              "relative min-h-0 flex-1 touch-none overflow-hidden",
              zoomed ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in",
            )}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={(event) => {
              onPointerUp(event);
              onTapEnd(event);
            }}
            onPointerCancel={onPointerUp}
            onDoubleClick={onDoubleClick}
            onWheel={onWheel}
          >
            <motion.div className="absolute inset-0" style={{ x, y, scale }}>
              <motion.div
                key={item.src}
                className="absolute inset-0"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: enterFrom * 64, scale: enterFrom ? 1 : 1.02 }
                }
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={SPRING}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="100vw"
                  quality={92}
                  priority
                  draggable={false}
                  onLoad={(event) =>
                    setNatural({
                      w: event.currentTarget.naturalWidth,
                      h: event.currentTarget.naturalHeight,
                    })
                  }
                  className="select-none object-contain"
                />
              </motion.div>
            </motion.div>
          </div>

          {items.length > 1 ? (
            <>
              <EdgeButton
                side="left"
                label="Previous image"
                disabled={index === 0}
                onClick={() => goto(index - 1, -1)}
              />
              <EdgeButton
                side="right"
                label="Next image"
                disabled={index === items.length - 1}
                onClick={() => goto(index + 1, 1)}
              />
            </>
          ) : null}

          <footer className="relative z-10 shrink-0 px-4 pb-4 pt-3 text-center sm:pb-6">
            {item.caption ? (
              <p className="mx-auto max-w-[54ch] text-[13px] font-light leading-snug text-co-bg/80">
                {item.caption}
              </p>
            ) : null}
            <p className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-co-bg/40">
              {zoomed ? "Drag to move · double-tap to fit" : "Double-tap or pinch to zoom"}
            </p>
          </footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** forwardRef so Radix's `Dialog.Close asChild` can own one of these. */
const RoundButton = forwardRef<
  HTMLButtonElement,
  { label: string } & ButtonHTMLAttributes<HTMLButtonElement>
>(function RoundButton({ label, children, className, ...rest }, ref) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full border border-co-bg/20 bg-co-bg/10 text-co-bg transition-colors hover:bg-co-bg/20 disabled:opacity-30 disabled:hover:bg-co-bg/10",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});

function EdgeButton({
  side,
  label,
  disabled,
  onClick,
}: {
  side: "left" | "right";
  label: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "absolute top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-co-bg/20 bg-co-bg/10 text-co-bg transition-colors hover:bg-co-bg/20 disabled:opacity-25 sm:flex",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <ChevronIcon flipped={side === "right"} />
    </button>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M1 1l13 13M14 1L1 14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M7.5 1v13M1 7.5h13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function MinusIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden>
      <path d="M1 7.5h13" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ChevronIcon({ flipped }: { flipped: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden
      style={flipped ? { transform: "rotate(180deg)" } : undefined}
    >
      <path d="M10 2L4 8l6 6" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
