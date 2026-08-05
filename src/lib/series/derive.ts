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

/** The one string quoted everywhere a size is shown. */
export function sizeLabel(selection: SeriesSelection): string {
  const length = selectedLength(selection);
  if (selection.config.dia) return `Ø${length} mm`;
  return `${length} × ${selectedDepth(selection)} × ${selection.series.workingHeightMm} mm`;
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
