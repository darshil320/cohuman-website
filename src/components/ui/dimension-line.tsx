import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DimensionLineProps {
  /**
   * The measured value, e.g. "1200 – 1600". Read it off the series data, never type it.
   * A node rather than a string so a live size can tick (`TickNumber`).
   */
  label: ReactNode;
  /** `x` runs horizontally (a length), `y` vertically (a height). */
  axis?: "x" | "y";
  /**
   * The surface the line sits on. The label knocks a gap out of the line, so its ground
   * must match what is behind it.
   */
  surface?: "canvas" | "fog" | "ink";
  /** Size and position. A horizontal line needs a width, a vertical one a height. */
  className?: string;
}

const SURFACE = {
  canvas: "bg-co-bg text-co-ink",
  fog: "bg-co-bg-alt text-co-ink",
  ink: "bg-co-panel text-co-panel-fg",
} as const;

/**
 * A drawing-sheet dimension line: a 1px rule with end ticks and a mono value in a gap at
 * its centre.
 *
 * Every product render on the site carries at least one. The rule draws itself at
 * plotter speed (`co-rule`, 400ms linear) when it scrolls into view; the ticks and label
 * are static, so the finished drawing is what renders with scripting off.
 *
 * Decorative to assistive tech — the same size is always in the spec rows or figure
 * caption beside it, so announcing it twice would only be noise.
 */
export function DimensionLine({
  label,
  axis = "x",
  surface = "canvas",
  className,
}: DimensionLineProps) {
  const tone = SURFACE[surface];

  if (axis === "y") {
    return (
      <span aria-hidden className={cn("relative block w-[11px]", className)}>
        <span
          data-reveal
          data-axis="y"
          className="co-rule absolute inset-y-0 left-1/2 block w-px bg-current"
        />
        <span className="absolute inset-x-0 top-0 block h-px bg-current" />
        <span className="absolute inset-x-0 bottom-0 block h-px bg-current" />
        <span
          className={cn(
            "co-data absolute left-1/2 top-1/2 block -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap px-2 text-[10px]",
            tone,
          )}
        >
          {label}
        </span>
      </span>
    );
  }

  return (
    <span aria-hidden className={cn("relative flex h-[11px] items-center justify-center", className)}>
      <span data-reveal className="co-rule absolute inset-x-0 top-1/2 block h-px bg-current" />
      <span className="absolute left-0 top-0 block h-full w-px bg-current" />
      <span className="absolute right-0 top-0 block h-full w-px bg-current" />
      <span className={cn("co-data relative whitespace-nowrap px-2 text-[10px]", tone)}>{label}</span>
    </span>
  );
}
