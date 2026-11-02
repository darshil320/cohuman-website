import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  k: string;
  v: ReactNode;
}

/**
 * Spec rows — a key column in steel and a value in ink, both mono, on hairlines.
 *
 * The product-data pattern everywhere: the PDP spec block, catalog product pages, sector
 * ranges. A real `<dl>`, so a screen reader pairs each value with its label. `dark` is
 * for the ink spec block.
 */
export function SpecRows({
  rows,
  tone = "light",
  columns = 1,
  className,
}: {
  rows: readonly SpecRow[];
  tone?: "light" | "dark";
  /** Two columns flow the rows side by side on wide screens, as the moodboard kit does. */
  columns?: 1 | 2;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <dl
      className={cn(
        "co-data border-t",
        dark ? "border-co-panel-border" : "border-co-border",
        columns === 2 && "md:columns-2 md:gap-x-10",
        className,
      )}
    >
      {rows.map((row) => (
        <div
          key={row.k}
          className={cn(
            "grid break-inside-avoid grid-cols-[minmax(96px,130px)_1fr] gap-x-4 border-b py-[11px]",
            dark ? "border-co-panel-border" : "border-co-border",
          )}
        >
          <dt className={dark ? "text-co-panel-faint" : "text-co-muted-2"}>{row.k}</dt>
          <dd className={cn("min-w-0 break-words", dark ? "text-co-panel-fg" : "text-co-ink")}>{row.v}</dd>
        </div>
      ))}
    </dl>
  );
}
