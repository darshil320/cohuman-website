import type { ReactNode } from "react";
import type { SpecRow } from "@/components/ui/spec-rows";

/**
 * The fields every product's ink panel carries, in the Stretch S panel's order (Nov 2026
 * review: "every page copies the Stretch S page; mark missing info as not available, so
 * the gaps become visible"). A product without a value shows "Not available" rather than
 * dropping the row, so every panel lists the same fields and the gaps line up between
 * products. `docs/cohuman-missing-data.xlsx` tracks the same fields per product.
 */
export const STANDARD_FIELDS = [
  "Type",
  "Configurations",
  "Width",
  "Depth",
  "Height",
  "Seats",
  "Finish",
  "Frame finish",
  "Colours",
] as const;

export type StandardField = (typeof STANDARD_FIELDS)[number];

/** Standard working height of every workspace system (client, Nov 2026). */
export const STANDARD_HEIGHT_MM = 750;

/** Catalogue v31, p. 68: tops for every workspace system. */
export const TOP_FINISH_LINE = "Pre-laminated board in 7 shades, or veneer";

/** Catalogue v31, p. 68. */
export const WORKSPACE_WARRANTY = "10 years";

/** Steel, so a gap reads as a gap, not as a value. */
export const NOT_AVAILABLE: ReactNode = <span className="text-co-panel-faint">Not available</span>;

/**
 * Standard rows from whatever the product has. `replace` swaps one field for several
 * rows (Type A's three parts stand in for width / depth / height); `extra` rows follow
 * (collection, designer).
 */
export function standardRows(
  values: Partial<Record<StandardField, ReactNode>>,
  options: { replace?: Partial<Record<StandardField, SpecRow[] | null>>; extra?: SpecRow[] } = {},
): SpecRow[] {
  const rows = STANDARD_FIELDS.flatMap((field): SpecRow[] => {
    const swap = options.replace?.[field];
    if (swap === null) return [];
    if (swap) return swap;
    return [{ k: field, v: values[field] ?? NOT_AVAILABLE }];
  });
  return [...rows, ...(options.extra ?? [])];
}
