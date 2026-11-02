"use client";

import { useEffect, useRef, useState } from "react";

/** Plotter speed: every Signal motion that moves a measurement takes 400ms, linear. */
const TICK_MS = 400;

/**
 * Ticks a displayed number from its previous value to a new one — "numbers tick to their
 * value when a size changes".
 *
 * Unlike `useCountUp`, nothing happens on mount: the first render, on the server and in
 * the browser, is the real value, so the HTML always carries the true size. Only a later
 * change (picking 1600 after 1200) animates, linearly, over 400ms. Reduced-motion readers
 * get the new value immediately.
 */
export function useTick(value: number): number {
  const [shown, setShown] = useState(value);
  const from = useRef(value);

  useEffect(() => {
    const start = from.current;
    from.current = value;
    if (start === value) return;

    // Reduced motion lands on the new value in the very next frame instead of ticking.
    const duration = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : TICK_MS;

    let frame = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - startTime) / duration, 1);
      setShown(Math.round(start + (value - start) * progress));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return shown;
}
