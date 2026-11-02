import { cn } from "@/lib/utils";

/**
 * A bare dimension rule — a hairline with end ticks and no value — that draws itself
 * left to right at plotter speed when it scrolls into view. For a rule that carries a
 * measurement, use `DimensionLine`.
 *
 * The draw is the `co-rule` CSS animation gated on `data-shown`; the finished state is
 * the default, so with scripting off it simply renders as a drawn line.
 */
export function MeasureRule({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block h-[11px] w-full text-co-ink", className)}>
      <span data-reveal className="co-rule absolute inset-x-0 top-1/2 block h-px bg-current" />
      <span className="absolute left-0 top-0 block h-full w-px bg-current" />
      <span className="absolute right-0 top-0 block h-full w-px bg-current" />
    </span>
  );
}
