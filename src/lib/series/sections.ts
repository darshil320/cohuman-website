import type { SeriesDefinition } from "./types";

/* -------------------------------------------------------------------------------------
   Section numbering for the lower half of the series PDP.

   The name hero, spec block and configuration gallery above hold 01–03; everything from
   the assembly down continues the count. The gallery strip only exists on some series
   (VARIDEX), so the number is worked out from what actually renders — a page never
   skips a number.
   The predicates mirror each component's own early `return null`.
------------------------------------------------------------------------------------- */

export type SeriesSectionKey = "assembly" | "anatomy" | "gallery" | "enquire";

/** Page order, top to bottom. */
const SECTION_ORDER: readonly SeriesSectionKey[] = [
  // "assembly", — hidden on client request; restore with <SeriesAssembly /> in series-pdp.tsx
  "anatomy",
  "gallery",
  "enquire",
];

const FIRST_SECTION_NO = 4;

function rendersSection(series: SeriesDefinition, key: SeriesSectionKey): boolean {
  switch (key) {
    case "gallery":
      return Boolean(series.gallery?.items.length);
    default:
      return true;
  }
}

/** The section's number on this series' page, e.g. 4 for the anatomy. */
export function seriesSectionNo(series: SeriesDefinition, key: SeriesSectionKey): number {
  const present = SECTION_ORDER.filter((entry) => rendersSection(series, entry));
  return FIRST_SECTION_NO + present.indexOf(key);
}

/** "04 / Anatomy" — the mono label a `SectionHeading` opens with. */
export function seriesSectionEyebrow(
  series: SeriesDefinition,
  key: SeriesSectionKey,
  label: string,
): string {
  return `${String(seriesSectionNo(series, key)).padStart(2, "0")} / ${label}`;
}
