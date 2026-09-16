import {
  ALL_SERIES,
  clampIndex,
  sizeLabel,
  type SeriesConfig,
  type SeriesDefinition,
  type SeriesElement,
  type SeriesSwatch,
} from "@/lib/series";

/**
 * Configurator option model.
 *
 * Every option here is derived from the series specification data rather than authored
 * separately, so the configurator can never offer a leg, a top or a finish the PDP does
 * not document. Adding a series to `ALL_SERIES` adds it to the configurator.
 */

export interface LegOption {
  /** Element code — the part number quoted on the specification. */
  code: string;
  name: string;
  note: string;
  /** Reference number as printed on the element page. */
  ref: string;
}

export interface TopOption {
  slug: string;
  name: string;
  /** Shape family, used for the silhouette drawn in the viewer. */
  shape: "rect" | "square" | "round" | "l-shape" | "u-shape";
  seats: string;
  image: string;
  imageAlt: string;
  lens: number[];
  deps: number[];
  dia?: boolean;
  sq?: boolean;
}

export interface FinishOption {
  code: string;
  name: string;
  spec: string;
  /** CSS colour/gradient standing in for real swatch photography. */
  fill: string;
  edge?: string;
  /** Which part of the table the finish applies to. */
  applies: "top" | "frame" | "screen";
}

export interface AccessoryOption {
  code: string;
  name: string;
  note: string;
}

export interface SeriesOptions {
  series: SeriesDefinition;
  legs: LegOption[];
  tops: TopOption[];
  finishes: FinishOption[];
  accessories: AccessoryOption[];
}

/** Element kinds that are a leg rather than a beam. Beams follow the top, so they are
 *  never a customer choice — see VARIDEX_BEAM_NOTE. */
function isLeg(element: SeriesElement): boolean {
  return element.kind.toLowerCase() === "legs";
}

/**
 * Which part of the table a swatch describes.
 *
 * The specifications mix top laminates, frame powder coats and screen felts into one
 * finish board. The configurator asks about them separately, so they are split by the
 * code segment the manufacturer already uses (`-TOP-`, `-FRM-`, `-SCR-`), falling back
 * to the wording of the spec line where a code is absent.
 */
function swatchApplies(swatch: SeriesSwatch): FinishOption["applies"] {
  const code = swatch.code?.toUpperCase() ?? "";
  if (code.includes("-FRM-")) return "frame";
  if (code.includes("-SCR-")) return "screen";
  if (code.includes("-TOP-")) return "top";
  const spec = `${swatch.name} ${swatch.spec}`.toLowerCase();
  if (spec.includes("powder")) return "frame";
  if (spec.includes("screen") || spec.includes("felt")) return "screen";
  return "top";
}

function configShape(config: SeriesConfig): TopOption["shape"] {
  if (config.dia) return "round";
  if (config.sq) return "square";
  const name = config.name.toLowerCase();
  if (name.includes("l shape") || name.includes("l-shape")) return "l-shape";
  if (name.includes("u shape") || name.includes("u-shape")) return "u-shape";
  return "rect";
}

/**
 * Accessories.
 *
 * VARIDEX documents a wire-channel SKU table; PROS documents screens on its finish
 * board. Neither publishes a general accessory catalogue, so nothing is invented here —
 * a series with no documented accessory simply offers none, and the step is skipped.
 */
function accessoriesFor(series: SeriesDefinition): AccessoryOption[] {
  const fromTable = (series.accessory?.rows ?? []).map((row, index) => ({
    code: row.code,
    name: series.accessory?.parts[index]?.name ?? "Wire channel",
    note: series.accessory?.parts[index]?.note ?? `Travel ${row.min}–${row.max}`,
  }));

  const fromSwatches = (series.swatches ?? [])
    .filter((swatch) => swatchApplies(swatch) === "screen")
    .map((swatch) => ({
      code: swatch.code ?? swatch.name,
      name: swatch.name,
      note: swatch.spec,
    }));

  return [...fromTable, ...fromSwatches];
}

export function optionsForSeries(series: SeriesDefinition): SeriesOptions {
  return {
    series,
    legs: series.elements.filter(isLeg).map((element) => ({
      code: element.code,
      name: element.name,
      note: element.note,
      ref: element.ref,
    })),
    tops: series.configs.map((config) => ({
      slug: config.slug,
      name: config.name,
      shape: configShape(config),
      seats: config.seats,
      image: config.image,
      imageAlt: config.imageAlt,
      lens: config.lens,
      deps: config.deps,
      dia: config.dia,
      sq: config.sq,
    })),
    finishes: (series.swatches ?? []).map((swatch) => ({
      code: swatch.code ?? swatch.name,
      name: swatch.name,
      spec: swatch.spec,
      fill: swatch.fill ?? "#2b2d30",
      edge: swatch.edge,
      applies: swatchApplies(swatch),
    })),
    accessories: accessoriesFor(series),
  };
}

export const ALL_OPTIONS: SeriesOptions[] = ALL_SERIES.map(optionsForSeries);

export function optionsForSlug(slug: string): SeriesOptions | null {
  return ALL_OPTIONS.find((entry) => entry.series.slug === slug) ?? null;
}

/** A complete configuration, as chosen in the configurator. */
export interface Specification {
  seriesSlug: string;
  topSlug: string;
  lenIndex: number;
  depIndex: number;
  legCode: string;
  /** Top finish code. */
  topFinishCode: string | null;
  /** Frame finish code. */
  frameFinishCode: string | null;
  accessoryCodes: string[];
}

export interface ResolvedSpecification {
  options: SeriesOptions;
  top: TopOption;
  leg: LegOption | null;
  topFinish: FinishOption | null;
  frameFinish: FinishOption | null;
  accessories: AccessoryOption[];
  size: string;
  length: number;
  depth: number | null;
}

/**
 * Resolves a specification into the labels quoted to the customer.
 *
 * Size comes from the same `sizeLabel` the PDP uses, so the configurator and the product
 * page can never describe one table two ways.
 */
export function resolveSpecification(spec: Specification): ResolvedSpecification | null {
  const options = optionsForSlug(spec.seriesSlug);
  if (!options) return null;

  const top = options.tops.find((entry) => entry.slug === spec.topSlug) ?? options.tops[0];
  if (!top) return null;

  const config = options.series.configs.find((entry) => entry.slug === top.slug);
  if (!config) return null;

  const lenIndex = clampIndex(spec.lenIndex, top.lens.length);
  const depIndex = clampIndex(spec.depIndex, top.deps.length);
  const length = top.lens[lenIndex];
  const depth = top.dia ? null : top.sq ? length : (top.deps[depIndex] ?? null);

  return {
    options,
    top,
    leg: options.legs.find((entry) => entry.code === spec.legCode) ?? null,
    topFinish: options.finishes.find((entry) => entry.code === spec.topFinishCode) ?? null,
    frameFinish: options.finishes.find((entry) => entry.code === spec.frameFinishCode) ?? null,
    accessories: options.accessories.filter((entry) => spec.accessoryCodes.includes(entry.code)),
    size: sizeLabel({ series: options.series, config, lenIndex, depIndex }),
    length,
    depth,
  };
}
