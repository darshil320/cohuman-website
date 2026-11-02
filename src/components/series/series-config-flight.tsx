"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HEADER_HEIGHT } from "@/lib/layout";

/** How long a chosen render takes to fly from the picker into the viewer. */
export const FLIGHT_MS = 750;

/** Selector for the viewer's image frame — set on it in series-stage.tsx. */
const VIEWER_FRAME = "[data-viewer-frame]";

/** The viewer poster's own inset (`p-[6%]`), which the flying copy grows into. */
const VIEWER_INSET = 0.06;

export interface Flight {
  /** The thumbnail's already-loaded URL, so the copy paints with no new request. */
  src: string;
  /** Where the flight starts: the clicked card's image box, in viewport pixels. */
  from: { left: number; top: number; width: number; height: number };
}

const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Scroll the viewer into view. On wide screens the viewer is pinned inside the spec
 * block, so the block's top is the target; on narrow ones the viewer sits in the flow
 * below the ink spec column and is the target itself.
 */
export function scrollToViewer(behavior: ScrollBehavior): void {
  const spec = document.querySelector("#specification");
  const frame = document.querySelector(VIEWER_FRAME);
  if (!spec || !frame) return;
  const pinned = window.matchMedia("(min-width: 1024px)").matches;
  const anchor = pinned ? spec : frame;
  const top = anchor.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT - (pinned ? 0 : 16);
  window.scrollTo({ top, behavior });
}

/**
 * A copy of the chosen render, flying from its card in the picker into the main viewer
 * while the page scrolls up to it.
 *
 * The viewer has already switched to the new configuration underneath, so when the copy
 * lands on the frame and unmounts, the viewer is showing the same render in the same
 * place. The target is re-measured every frame because the page is scrolling as the copy
 * flies. The copy carries its own canvas ground, isolated, so the cut-out multiplies with
 * that and not with whatever it passes over (the ink spec block).
 */
export function ConfigFlight({ flight, onDone }: { flight: Flight; onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const { from } = flight;
    let raf = 0;
    const start = performance.now();

    const step = (now: number) => {
      const target = document.querySelector(VIEWER_FRAME)?.getBoundingClientRect();
      if (!target) {
        onDone();
        return;
      }
      const t = Math.min((now - start) / FLIGHT_MS, 1);
      const e = easeInOutCubic(t);
      const width = from.width + (target.width - from.width) * e;
      const height = from.height + (target.height - from.height) * e;
      const left = from.left + (target.left - from.left) * e;
      const top = from.top + (target.top - from.top) * e;
      node.style.transform = `translate(${left}px, ${top}px)`;
      node.style.width = `${width}px`;
      node.style.height = `${height}px`;
      node.style.padding = `${width * VIEWER_INSET * e}px`;
      if (t < 1) raf = requestAnimationFrame(step);
      else onDone();
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [flight, onDone]);

  return createPortal(
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-50 isolate bg-co-bg"
      style={{
        width: flight.from.width,
        height: flight.from.height,
        transform: `translate(${flight.from.left}px, ${flight.from.top}px)`,
      }}
    >
      {/* A plain <img>: it reuses the thumbnail's already-loaded URL so the copy paints on
          the first frame; next/image would request a new size mid-flight. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={flight.src} alt="" className="co-cutout block h-full w-full object-contain" />
    </div>,
    document.body,
  );
}
