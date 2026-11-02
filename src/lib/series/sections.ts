import type { SeriesDefinition } from "./types";

/* -------------------------------------------------------------------------------------
   Section numbering for the lower half of the series PDP.

   The name hero, spec block and configuration gallery above hold 01–03; everything from
   the assembly down continues the count. Three of these sections only exist on some
   series (PROS has a finish board, VARIDEX an accessory table and a gallery strip), so
   the number is worked out from what actually renders — a page never skips from 06 to 09.
   The predicates mirror each component's own early `return null`.
------------------------------------------------------------------------------------- */

export type SeriesSectionKey =
  | "assembly"
  | "elements"
  | "anatomy"
  | "finishes"
  | "accessory"
  | "gallery"
  | "enquire";

/** Page order, top to bottom. */
const SECTION_ORDER: readonly SeriesSectionKey[] = [
  "assembly",
  "elements",
  "anatomy",
  "finishes",
  "accessory",
  "gallery",
  "enquire",
];

const FIRST_SECTION_NO = 4;

function rendersSection(series: SeriesDefinition, key: SeriesSectionKey): boolean {
  switch (key) {
    case "finishes":
      return Boolean(series.swatches?.length && series.swatchesSection);
    case "accessory":
      return Boolean(series.accessory);
    case "gallery":
      return Boolean(series.gallery?.items.length);
    default:
      return true;
  }
}

/** The section's number on this series' page, e.g. 5 for the element set. */
export function seriesSectionNo(series: SeriesDefinition, key: SeriesSectionKey): number {
  const present = SECTION_ORDER.filter((entry) => rendersSection(series, entry));
  return FIRST_SECTION_NO + present.indexOf(key);
}

/** "05 / The element set" — the mono label a `SectionHeading` opens with. */
export function seriesSectionEyebrow(
  series: SeriesDefinition,
  key: SeriesSectionKey,
  label: string,
): string {
  return `${String(seriesSectionNo(series, key)).padStart(2, "0")} / ${label}`;
}
