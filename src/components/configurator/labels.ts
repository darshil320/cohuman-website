import type { SeriesConfig } from "@/lib/series";

/**
 * Display strings shared by both configurators — /configure and the collection page's
 * spec block — so the two print a seat count or explain a fixed size in the same words.
 * Presentation only: nothing here reaches the specification or the enquiry payload.
 */

/** Values the series data uses where the PDF states no seat count. */
const NO_SEAT_COUNT = new Set(["", "—", "–", "-"]);

/** "1 seat", "4 seats", "8–12 seats" — and null where the specification states no count. */
export function seatLabel(seats: string): string | null {
  if (NO_SEAT_COUNT.has(seats.trim())) return null;
  return seats === "1" ? "1 seat" : `${seats} seats`;
}

/** What the length control measures on this top: a diameter, a side or a length. */
export function lengthNoun(config: SeriesConfig): string {
  if (config.dia) return "diameter";
  if (config.sq) return "side";
  return "length";
}

/**
 * Helper text under a size control, for the two cases where it is not a real choice:
 * a value derived from the top's shape (locked), or a configuration offered in one size.
 * Undefined when the control is an ordinary choice.
 */
export function sizeHint({
  axis,
  config,
  count,
  locked = false,
}: {
  axis: "length" | "depth";
  config: SeriesConfig;
  count: number;
  locked?: boolean;
}): string | undefined {
  if (axis === "depth" && locked) {
    if (config.dia) return "Round top — fixed at the working height, not a choice.";
    if (config.sq) return "Square top — the depth follows the side.";
  }
  if (count === 1) return `Offered in one ${axis === "length" ? lengthNoun(config) : "depth"} only.`;
  return undefined;
}
