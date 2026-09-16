import { cn } from "@/lib/utils";

interface TickRailProps {
  /** `x` runs horizontally, `y` vertically. */
  axis: "x" | "y";
  className?: string;
}

/**
 * A coordinate tick rail — the margin marking that makes a section read as a drawing
 * sheet rather than a web page.
 *
 * One element and one `repeating-linear-gradient`: no SVG request and no DOM node per
 * tick, so a rail down a full viewport costs the same as a single div. Geometry and
 * colour come from the `--co-tick-*` tokens, and `.bg-co-panel .co-tick-rail` swaps to
 * the dark value on its own — there is no `tone` prop to get wrong.
 *
 * Pure ornament, so it is always `aria-hidden` and never takes pointer events.
 */
export function TickRail({ axis, className }: TickRailProps) {
  return <span aria-hidden data-axis={axis} className={cn("co-tick-rail pointer-events-none block", className)} />;
}
