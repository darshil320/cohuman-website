import type { SeriesConfig, SeriesDefinition } from "./types";

/**
 * Pure derivations off a selected configuration + size indices. Kept out of the
 * components so the labels the customer sees in the viewer, the sticky bar and the
 * enquiry payload can never drift apart.
 */

export interface SeriesSelection {
  series: SeriesDefinition;
  config: SeriesConfig;
  /** Index into `config.lens`, clamped. */
  lenIndex: number;
  /** Index into `config.deps`, clamped. Ignored for round and square tops. */
  depIndex: number;
}

export function clampIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return Math.min(Math.max(index, 0), length - 1);
}

export function selectedLength({ config, lenIndex }: SeriesSelection): number {
  return config.lens[clampIndex(lenIndex, config.lens.length)];
}

/** Depth in mm. Square tops mirror the side length; round tops have no depth. */
export function selectedDepth(selection: SeriesSelection): number | null {
  const { config, depIndex } = selection;
  if (config.dia) return null;
  if (config.sq) return selectedLength(selection);
  return config.deps[clampIndex(depIndex, config.deps.length)];
}

/**
 * A no-break space (U+00A0). Binds a value to its unit ("720 mm") and the two ends of a
 * range to their dash, so a label can only wrap at the spaces around a ×, never between
 * a number and what it measures.
 */
const NBSP = "\u00A0";

/** The one string quoted everywhere a size is shown. */
export function sizeLabel(selection: SeriesSelection): string {
  const length = selectedLength(selection);
  if (selection.config.dia) return `Ø${length}${NBSP}mm`;
  return `${length} × ${selectedDepth(selection)} × ${selection.series.workingHeightMm}${NBSP}mm`;
}

export function lengthFieldLabel(config: SeriesConfig): string {
  if (config.dia) return "Diameter — mm";
  if (config.sq) return "Side — mm";
  return "Length — mm";
}

export function depthFieldLabel(config: SeriesConfig): string {
  if (config.dia) return "Working height — mm";
  if (config.sq) return "Depth — mm (square)";
  return "Depth — mm";
}

/**
 * Options for the depth selector. Round and square tops expose a single derived
 * value rather than a choice, so the selector stays visually consistent.
 */
export function depthOptions(selection: SeriesSelection): {
  values: number[];
  locked: boolean;
} {
  const { series, config } = selection;
  if (config.dia) return { values: [series.workingHeightMm], locked: true };
  if (config.sq) return { values: [selectedLength(selection)], locked: true };
  return { values: config.deps, locked: false };
}

/** Size-chart cell text for the length column. */
export function chartLengths(config: SeriesConfig): string {
  return `${config.dia ? "Ø " : ""}${config.lens.join(" / ")}`;
}

/** Size-chart cell text for the depth column. */
export function chartDepths(config: SeriesConfig): string {
  if (config.dia) return "—";
  if (config.sq) return "matches side";
  return config.deps.join(" / ");
}

/*
  Dimension-line labels.

  Every product image on the site carries a dimension line, and the rule is that no size
  is ever typed by hand: these read the ranges straight off the series data, so a
  corrected size in a config file corrects every drawing that shows it. They print only
  what the data holds — an empty list yields an empty label, never a placeholder number.
*/

/**
 * `min — max` over a list of millimetre values, or the single value when they agree.
 *
 * The spaced em dash is the moodboard's drawing-label convention, kept on purpose: these
 * are set in Martian Mono, where an en and an em dash fill the same one-character cell,
 * so the en dash's usual job — a visibly shorter range dash — does not apply. The spaces
 * either side are no-break, so a range never splits across two lines.
 */
export function rangeLabel(values: readonly number[]): string {
  if (values.length === 0) return "";
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? `${min}` : `${min}${NBSP}—${NBSP}${max}`;
}

/** The length range a configuration is offered in; a diameter for round tops. */
export function configLengthLabel(config: SeriesConfig): string {
  const range = rangeLabel(config.lens);
  return config.dia ? `Ø${range}` : range;
}

/** The depth range, the side range for square tops, and null for round tops. */
export function configDepthLabel(config: SeriesConfig): string | null {
  if (config.dia) return null;
  if (config.sq) return rangeLabel(config.lens);
  return rangeLabel(config.deps);
}

/** Length × depth range, as drawn on the name hero's dimension rule. */
export function configSizeRange(config: SeriesConfig): string {
  const depth = configDepthLabel(config);
  const length = configLengthLabel(config);
  return depth ? `${length} × ${depth}` : length;
}

/**
 * Shortest to longest length across a set of configurations, e.g. "800 → 4000 mm", set
 * with no-break spaces so the span reads as one unbreakable value.
 */
export function spanLabel(configs: readonly SeriesConfig[]): string {
  const lens = configs.flatMap((config) => config.lens);
  if (lens.length === 0) return "";
  return `${Math.min(...lens)}${NBSP}→${NBSP}${Math.max(...lens)}${NBSP}mm`;
}

/** Human label for the selected configuration's finish, or null where the series has none. */
export function finishLabel(selection: SeriesSelection): string | null {
  const { series, config } = selection;
  if (!config.finish || !series.finishFilters) return null;
  return series.finishFilters.find((f) => f.key === config.finish)?.label ?? null;
}

/** The `interest` line sent to /api/enquiry — readable in the lead email as-is. */
export function enquiryInterest(selection: SeriesSelection): string {
  const { series, config } = selection;
  return `${series.wordmark} ${config.name} · ${sizeLabel(selection)} · ${config.code}`;
}

export function isInferredCode(series: SeriesDefinition, code: string): boolean {
  return series.inferredCodes.includes(code);
}

export const INFERRED_CODE_FOOTNOTE =
  "Codes marked ° are provisional — the part is confirmed, the number is not yet. Your quote carries the final SKU.";
