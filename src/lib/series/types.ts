/**
 * Desking-system series: a chassis plus a fixed element set that assembles into a
 * number of table configurations.
 *
 * Two series ship today — PROS and VARIDEX — both ported from the manufacturer's own
 * specification PDFs (`PROS.pdf`, `VARIDEX.pdf`). Everything in a `SeriesDefinition`
 * is quoted to customers, so treat edits as data changes rather than copy tweaks.
 */

export interface SeriesBomLine {
  name: string;
  code: string;
  qty: string;
}

export interface SeriesConfig {
  slug: string;
  /** Two-digit row number as printed in the size chart. */
  n: string;
  /** Short label for the thumbnail rail. */
  short: string;
  name: string;
  /** Element code for the configuration as a whole. */
  code: string;
  /** Public path to the studio render. */
  image: string;
  /** Alt text / render description. */
  imageAlt: string;
  /** Key into the series' `finishFilters`. Omit on series with no finish filter. */
  finish?: string;
  /** Selectable lengths in mm (diameters when `dia`, side lengths when `sq`). */
  lens: number[];
  /** Selectable depths in mm. Ignored when `dia` or `sq`. */
  deps: number[];
  seats: string;
  /** Beam variant, or "—" where the configuration carries no beam. */
  beam: string;
  /** Square top: depth always matches the selected side length. */
  sq?: boolean;
  /** Round top: quoted as a diameter, depth is not selectable. */
  dia?: boolean;
  bom: SeriesBomLine[];
  /**
   * Set where the source PDF documents the configuration and its parts but not a
   * component schedule. Shown in place of the bill of components.
   */
  bomNote?: string;
}

export interface SeriesElement {
  /** Reference number as printed on the element-set page of the PDF. */
  ref: string;
  kind: string;
  name: string;
  code: string;
  note: string;
}

export interface SeriesPartRow {
  k: string;
  v: string;
}

export interface SeriesPart {
  n: string;
  name: string;
  group: string;
  why: string;
  rows: SeriesPartRow[];
}

export interface SeriesSwatch {
  name: string;
  spec: string;
  code?: string;
  /** CSS colour/gradient for the swatch tile. Omitted where no colour is specified. */
  fill?: string;
  /** Edge-band colour shown as a band along the bottom of the tile. */
  edge?: string;
}

export interface SeriesFinishFilter {
  /** Matches `SeriesConfig.finish`. */
  key: string;
  label: string;
  /** CSS colour/gradient for the chip. */
  swatch: string;
}

export interface SeriesSection {
  eyebrow: string;
  heading: string;
  blurb?: string;
}

/**
 * Products the source specification photographs but does not give a size table or
 * component schedule for. Shown as a strip rather than promoted to configurations, so
 * nothing on the page implies sizes we cannot stand behind.
 */
export interface SeriesGallery extends SeriesSection {
  items: { image: string; imageAlt: string; name: string; note: string }[];
}

/** An adjustable accessory quoted by SKU and range rather than by configuration. */
export interface SeriesAccessory {
  eyebrow: string;
  heading: string;
  blurb: string;
  columns: [string, string, string];
  rows: { code: string; min: string; max: string }[];
  parts: { name: string; note: string }[];
}

export interface SeriesDefinition {
  /** Collection slug — the series is served at /collections/<slug>. */
  slug: string;
  /** Full name, e.g. "PROS Series". */
  name: string;
  /** Display wordmark for the hero, e.g. "PROS". */
  wordmark: string;
  eyebrow: string;
  promise: string;
  intro: string;
  /** Working height in mm — fixed across the range. */
  workingHeightMm: number;
  /**
   * Column heading for `SeriesConfig.code`. PROS prints a code per configuration
   * ("Element code"); VARIDEX does not, so it shows the defining component instead.
   */
  codeLabel?: string;

  configs: SeriesConfig[];
  defaultConfigSlug: string;
  finishFilters?: SeriesFinishFilter[];

  elements: SeriesElement[];
  elementsSection: SeriesSection;
  /** Callout under the element grid, e.g. a rule about supportive beams. */
  elementsNote?: string;

  parts: SeriesPart[];
  anatomySection: SeriesSection;
  /** Public path to the render shown beside the part list. */
  anatomyImage: string;
  anatomyCaption: string;

  /** Finish/material board. Omit to drop the section. */
  swatches?: SeriesSwatch[];
  swatchesSection?: SeriesSection;
  swatchesFootnote?: string;

  /** Optional accessory table, e.g. VARIDEX's retractable wire channel. */
  accessory?: SeriesAccessory;

  /** Optional strip of photographed-but-unquoted products. */
  gallery?: SeriesGallery;

  sizeChartSection: SeriesSection;
  enquirySection: SeriesSection & { blurb: string };

  /**
   * Part numbers pattern-matched from confirmed codes rather than read off the PDF.
   * Rendered with a `°` marker plus a footnote until the real SKUs land.
   */
  inferredCodes: readonly string[];
}
