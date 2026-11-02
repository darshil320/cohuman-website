"use client";

import { useTick } from "@/lib/use-tick";

/**
 * A number that ticks to its new value when it changes. Renders bare text so it drops
 * into any label — a spec row, a dimension line — without a wrapper of its own. The
 * accessible value is always the target, never an in-between figure.
 */
export function TickNumber({ value }: { value: number }) {
  const shown = useTick(value);
  return (
    <>
      {/* Tabular figures: every digit one width, so the label does not jitter mid-tick. */}
      <span aria-hidden className="tabular-nums">
        {shown}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
