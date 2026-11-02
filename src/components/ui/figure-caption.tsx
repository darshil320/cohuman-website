import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * "Fig. 01", "Fig. 12" — the figure number as a drawing set prints it. The space is a
 * no-break space (U+00A0), so "Fig." never ends a line without its number.
 */
export function figureNumber(n: number): string {
  return `Fig.\u00A0${String(n).padStart(2, "0")}`;
}

/**
 * A figure caption: "Fig. 01 — STRETCH V bench, two-seat".
 *
 * Renders a real `<figcaption>` by default, so it must sit inside a `<figure>`; pass
 * `as="p"` where the caption is laid out away from its image.
 */
export function FigureCaption({
  n,
  children,
  as: Tag = "figcaption",
  className,
}: {
  n: number;
  children: ReactNode;
  as?: "figcaption" | "p" | "span";
  className?: string;
}) {
  return (
    <Tag className={cn("co-data text-co-muted-2", className)}>
      {/* No-break space before the dash: a wrap may follow it, never precede it. */}
      {figureNumber(n)}{"\u00A0— "}
      {children}
    </Tag>
  );
}
