import { cn } from "@/lib/utils";

/**
 * A dimension line: a hairline with end serifs, which draws itself left to right when it
 * scrolls into view.
 *
 * The draw is the `co-rule` CSS animation gated on `data-shown`, set by the app-level
 * reveal observer — no framer, no client boundary, and the finished state is the default,
 * so with scripting off it simply renders as a drawn line.
 */
export function MeasureRule({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn("relative block h-[5px] w-full", className)}>
      <span data-reveal className="co-rule absolute inset-x-0 top-1/2 block h-px bg-co-border-strong" />
      <span className="absolute left-0 top-0 block h-full w-px bg-co-border-strong" />
      <span className="absolute right-0 top-0 block h-full w-px bg-co-border-strong" />
    </span>
  );
}
