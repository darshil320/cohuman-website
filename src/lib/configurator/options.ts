import {
  BOARD_SHADES,
  CABLE_OPTIONS,
  CORE_OPTIONS,
  CORNER_OPTIONS,
  EDGE_OPTIONS,
  FABRIC_SHADES,
  PARTITION_OPTIONS,
  STORAGE_OPTIONS,
  type PictureOption,
  type Swatch,
} from "@/lib/finishes";
import {
  ALL_SERIES,
  clampIndex,
  sizeLabel,
  type SeriesConfig,
  type SeriesDefinition,
  type SeriesElement,
  type SeriesSwatch,
} from "@/lib/series";
import { POWER_OPTIONS } from "./power";
import { SYSTEMS, findSystem, type SystemOption } from "./systems";

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
  /** Benches: sharing (face-to-face) or non-sharing (one row). */
  sharing?: "sharing" | "non-sharing";
  /** No sizes on record: quoted to the plan. */
  toPlan?: boolean;
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
      sharing: config.sharing,
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

/* -------------------------------------------------------------------------------------
   The configurator's specification (Nov 2026 rework, catalogue v31): system → top and
   finish → partition → VOLT & BOLT → accessories → configuration and size.
------------------------------------------------------------------------------------- */

/** A complete configuration, as chosen in the configurator. Slugs and codes only. */
export interface Specification {
  systemSlug: string;
  /** Table type; null where the system has none on record yet. */
  configSlug: string | null;
  lenIndex: number;
  depIndex: number;
  frameShade: string | null;
  core: string;
  edge: string;
  corner: string;
  /** A board shade code (CH-01…), or "veneer". */
  topShade: string;
  /** null = no partition. */
  partition: string | null;
  fabric: string | null;
  cable: string | null;
  /** VOLT & BOLT unit; null = none. */
  power: string | null;
  accessories: readonly string[];
}

export interface ResolvedSpecification {
  system: SystemOption;
  /** The table types this system offers, in catalogue order. */
  tables: readonly TopOption[];
  top: TopOption | null;
  /** "1200 × 600 × 750 mm", or the reason there is no size. */
  size: string;
  length: number | null;
  depth: number | null;
  frameShade: Swatch | null;
  core: PictureOption;
  edge: PictureOption;
  corner: PictureOption;
  topShade: Swatch | null;
  veneer: boolean;
  partition: (PictureOption & { fabric: boolean }) | null;
  fabric: Swatch | null;
  cable: PictureOption | null;
  power: PictureOption | null;
  accessories: readonly PictureOption[];
}

export const VENEER = "veneer";

/** Size wording when a system's tables are sized to the plan. */
export const TO_PLAN = "Not available — quoted to your plan";

function tablesFor(system: SystemOption): TopOption[] {
  switch (system.tables.kind) {
    case "series":
    case "shared": {
      const tops = optionsForSeries(system.tables.series).tops;
      // A shared system borrows Stretch S's types and sizes, but never its renders: the
      // photo would show the wrong leg.
      return system.tables.kind === "series"
        ? tops
        : tops.map((top) => ({ ...top, image: "", imageAlt: "" }));
    }
    case "cabin":
      return [
        {
          slug: "cabin",
          name: "Cabin table",
          shape: "rect",
          seats: "1",
          image: system.photo?.src ?? "",
          imageAlt: system.photo?.alt ?? "",
          lens: [],
          deps: [],
          toPlan: true,
        },
      ];
    case "to-come":
      return [];
  }
}

export function defaultSpecification(systemSlug = SYSTEMS[0].slug): Specification {
  const system = findSystem(systemSlug);
  const tables = tablesFor(system);
  const series = system.tables.kind === "series" ? system.tables.series : null;
  const first = tables.find((t) => t.slug === series?.defaultConfigSlug) ?? tables[0] ?? null;
  return {
    systemSlug: system.slug,
    configSlug: first?.slug ?? null,
    lenIndex: 0,
    depIndex: 0,
    frameShade: system.frameShades[0]?.name ?? null,
    core: CORE_OPTIONS[0].slug,
    edge: EDGE_OPTIONS[0].slug,
    corner: CORNER_OPTIONS[0].slug,
    topShade: BOARD_SHADES[0].code ?? VENEER,
    partition: null,
    fabric: null,
    cable: null,
    power: null,
    accessories: [],
  };
}

/** Picking a system re-seeds what depends on it (frame shade, table type); the rest stays. */
export function withSystem(spec: Specification, systemSlug: string): Specification {
  const seeded = defaultSpecification(systemSlug);
  return { ...spec, systemSlug, configSlug: seeded.configSlug, lenIndex: 0, depIndex: 0, frameShade: seeded.frameShade };
}

function sizeFor(system: SystemOption, top: TopOption | null, lenIndex: number, depIndex: number) {
  if (!top) return { size: "Not available", length: null, depth: null };
  if (top.toPlan || system.tables.kind === "cabin" || system.tables.kind === "to-come") {
    return { size: TO_PLAN, length: null, depth: null };
  }
  const series = system.tables.series;
  const config = series.configs.find((entry) => entry.slug === top.slug);
  if (!config) return { size: "Not available", length: null, depth: null };
  const len = clampIndex(lenIndex, top.lens.length);
  const dep = clampIndex(depIndex, top.deps.length);
  const length = top.lens[len];
  const depth = top.dia ? null : top.sq ? length : (top.deps[dep] ?? null);
  return { size: sizeLabel({ series, config, lenIndex: len, depIndex: dep }), length, depth };
}

/**
 * Resolves a specification into the labels quoted to the customer. Sizes come from the
 * same `sizeLabel` the PDP uses, so the configurator and the product page can never
 * describe one table two ways.
 */
export function resolveSpecification(spec: Specification): ResolvedSpecification {
  const system = findSystem(spec.systemSlug);
  const tables = tablesFor(system);
  const top = tables.find((entry) => entry.slug === spec.configSlug) ?? tables[0] ?? null;
  const partition = PARTITION_OPTIONS.find((entry) => entry.slug === spec.partition) ?? null;
  const pick = <T extends { slug: string }>(list: readonly T[], slug: string | null) =>
    list.find((entry) => entry.slug === slug) ?? null;

  return {
    system,
    tables,
    top,
    ...sizeFor(system, top, spec.lenIndex, spec.depIndex),
    frameShade: system.frameShades.find((shade) => shade.name === spec.frameShade) ?? null,
    core: pick(CORE_OPTIONS, spec.core) ?? CORE_OPTIONS[0],
    edge: pick(EDGE_OPTIONS, spec.edge) ?? EDGE_OPTIONS[0],
    corner: pick(CORNER_OPTIONS, spec.corner) ?? CORNER_OPTIONS[0],
    topShade: BOARD_SHADES.find((shade) => shade.code === spec.topShade) ?? null,
    veneer: spec.topShade === VENEER,
    partition,
    fabric: partition?.fabric ? (FABRIC_SHADES.find((shade) => shade.code === spec.fabric) ?? null) : null,
    cable: pick(CABLE_OPTIONS, spec.cable),
    power: pick(POWER_OPTIONS, spec.power),
    accessories: STORAGE_OPTIONS.filter((entry) => spec.accessories.includes(entry.slug)),
  };
}
