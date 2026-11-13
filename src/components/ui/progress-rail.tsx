import { cn } from "@/lib/utils";

/**
 * The configurator's progress rail — the green bar from inside the logo's O, literally
 * under the thing you chose.
 *
 * A 2px hairline track with the signal filling it to `step / total`. The fill moves at
 * plotter speed when the step changes. The step is also written out ("Step 2 of 3"), so
 * the green is never the only carrier of progress.
 */
export function ProgressRail({
  step,
  total,
  label,
  tone = "light",
  className,
}: {
  step: number;
  total: number;
  /** Overrides the default "Step n of m" caption. */
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  const clamped = Math.min(Math.max(step, 0), total);
  const caption = label ?? `Step ${clamped} of ${total}`;

  return (
    <div className={className}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={clamped}
        aria-valuetext={caption}
        className={cn("relative h-[2px]", tone === "dark" ? "bg-co-panel-border" : "bg-co-border")}
      >
        {/* Grows from the left edge with `scaleX`, never `width`: no layout per frame. */}
        <span
          className="absolute inset-0 block origin-left bg-co-green transition-transform duration-(--duration-plot) ease-(--ease-plot) motion-reduce:transition-none"
          style={{ transform: `scaleX(${total > 0 ? clamped / total : 0})` }}
        />
      </div>
      <p className={cn("co-data mt-2", tone === "dark" ? "text-co-panel-faint" : "text-co-muted-2")}>{caption}</p>
    </div>
  );
}
