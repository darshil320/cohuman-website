"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** How long a counter takes to travel from zero to its value. */
const DURATION_MS = 1200;

/** The counter starts when this much of the element has entered the viewport. */
const VIEWPORT_THRESHOLD = 0.4;

/**
 * `useLayoutEffect` in the browser, a no-op on the server.
 *
 * The zero-reset has to land before the browser paints, or hydration shows the finished
 * figure for one frame and then snaps back to zero to count up. `useLayoutEffect` alone
 * would log React's "does nothing on the server" warning during SSR, hence the switch.
 */
const useBrowserLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/**
 * Whether this browser should animate at all.
 *
 * Feature-detected rather than assumed: without an `IntersectionObserver` there is no
 * "scrolled into view" signal to start on, and the finished figure already on screen is
 * the correct fallback. Reduced-motion readers keep the finished figure for the same
 * reason — the number is the point, the count is decoration.
 */
function canAnimate(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof IntersectionObserver === "undefined") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface UseCountUpResult<T extends Element> {
  /** Attach to the element whose entry into the viewport starts the count. */
  ref: React.RefObject<T | null>;
  /** The figure to render. Equals `value` on the server and before hydration. */
  count: number;
}

/**
 * Counts from zero to `value` once the element scrolls into view.
 *
 * **The figure, not the animation, is the deliverable.** `count` starts at `value`, so
 * the server-rendered HTML carries the real number and the animation is layered on
 * afterwards. Starting at zero instead — the way this was first written — shipped
 * `0 yrs` into the static HTML, which is what a crawler reads, what a reader sees before
 * hydration, and what stays on screen for good if the count never fires (JS blocked, a
 * hydration error, an old browser without `IntersectionObserver`).
 *
 * The reset to zero therefore happens in a browser-only layout effect, never during
 * render, so a browser that cannot animate simply keeps the finished number and a browser
 * that can never paints it before starting.
 */
export function useCountUp<T extends Element>(value: number): UseCountUpResult<T> {
  const [count, setCount] = useState(value);
  const ref = useRef<T>(null);

  useBrowserLayoutEffect(() => {
    if (!canAnimate()) return;
    // Safe now: we are in a browser that will run the animation in the effect below, and
    // this lands before paint, so the finished figure never flashes on screen.
    setCount(0);
  }, [value]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!canAnimate()) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();

        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / DURATION_MS, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          setCount(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: VIEWPORT_THRESHOLD },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      // An unmount mid-count would otherwise leave a partial figure behind if the same
      // element remounts (route change, Fast Refresh).
      setCount(value);
    };
  }, [value]);

  return { ref, count };
}
