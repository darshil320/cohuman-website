"use client";

import { useCountUp } from "@/lib/use-count-up";

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
 *
 * The counting itself, and the reason the served HTML carries the finished figure rather
 * than a zero, lives in `useCountUp` (src/lib/use-count-up.ts).
 */
export function CountUp({ value, suffix = "" }: CountUpProps) {
  const { ref, count } = useCountUp<HTMLSpanElement>(value);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}
