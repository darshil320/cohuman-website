import { cn } from "@/lib/utils";

const COLUMNS = 12;

/**
 * The visible 12-column hairline grid behind hero sections — Signal's only texture.
 *
 * It sits inside the same `co-shell` as the content, so its lines fall exactly on the
 * page's column edges rather than on a separate background rhythm. Each line draws down
 * at plotter speed as the hero comes into view. On phones only every third line is
 * drawn, giving four columns; twelve 30px columns read as stripes, not a grid.
 *
 * Fill the positioned parent: the parent needs `relative`, and its content needs to sit
 * above this (it is first in source order, so normal flow already does that).
 */
export function HairlineGrid({
  className,
  tone = "hair",
}: {
  className?: string;
  /** `signal` draws the lines in the logo green — the homepage hero only. */
  tone?: "hair" | "signal";
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0", className)}>
      <div className="co-shell relative h-full">
        <div className="relative h-full">
          {Array.from({ length: COLUMNS + 1 }, (_, i) => (
            <span
              key={i}
              data-reveal
              data-axis="y"
              className={cn(
                "co-rule absolute inset-y-0 block w-px",
                tone === "signal" ? "bg-co-grid-signal" : "bg-co-border",
                i % 3 !== 0 && "hidden lg:block",
              )}
              style={{ left: `${(i / COLUMNS) * 100}%`, animationDelay: `${i * 30}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
