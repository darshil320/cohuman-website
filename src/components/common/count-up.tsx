"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: number;
  suffix?: string;
}

/**
 * Counts to `value` once it scrolls into view.
 *
 * Deliberately renders no markup of its own — just the text — so it can drop into
 * whatever element the surrounding layout already uses. A component that brings its own
 * wrapper cannot be mixed with plain figures in one row without pulling itself off the
 * shared baseline, which is exactly what went wrong on the stats strip.
 */
export function CountUp({ value, suffix = "" }: CountUpProps) {
  // Starts at zero and animates, except under reduced motion, where the figure is the
  // point and the performance is not. Resolved in the initialiser rather than in an
  // effect so it is right on the first paint and never counts a frame it should not.
  const [count, setCount] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0,
  );
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();

        const durationMs = 1200;
        const startTime = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / durationMs, 1);
          const eased = 1 - (1 - progress) * (1 - progress);
          setCount(Math.round(eased * value));
          if (progress < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
