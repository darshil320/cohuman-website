import { FRAME_SHADES, type Swatch } from "@/lib/finishes";
import { PROS_SERIES, VARIDEX_SERIES, type SeriesDefinition } from "@/lib/series";

/**
 * Step 1 of the configurator — "Which system?" — from catalogue v31 (pp. 15–31) and the
 * Nov 2026 review.
 *
 * How each system's tables are sized:
 * - `series`: the system has its own specification (Stretch S, Stretch V).
 * - `shared`: no specification of its own yet; it offers Stretch S's table types and fixed
 *   sizes (client, Nov 2026: "same table types and fixed sizes as S/V").
 * - `cabin`: conference and cabin tables only; conference is phase 2, and the catalogue
 *   prints no sizes, so the cabin table is sized to the plan (Stretch E, Stretch R).
 * - `to-come`: a separate system the catalogue does not carry yet (square legs, loop
 *   legs) — listed so the gap is visible, quoted on enquiry.
 */
export type SystemTables =
  | { kind: "series"; series: SeriesDefinition }
  | { kind: "shared"; series: SeriesDefinition }
  | { kind: "cabin" }
  | { kind: "to-come" };

export interface SystemOption {
  slug: string;
  name: string;
  /** The catalogue's one line about the leg. */
  note: string;
  /** A crop of the leg itself, for the step 1 tile. */
  legImage?: string;
  /** Frame powder-coat shades the catalogue allows for this system (p. 70). */
  frameShades: readonly Swatch[];
  tables: SystemTables;
  /** The system's product page. */
  href?: string;
  /** Room shot standing in for the configuration render when there is none. */
  photo?: { src: string; alt: string };
}

function shadesFor(name: string): readonly Swatch[] {
  return FRAME_SHADES.find((group) => group.systems.split(/ and |, /).includes(name))?.shades ?? [];
}

export const SYSTEMS: readonly SystemOption[] = [
  {
    slug: "stretch-s",
    name: "Stretch S",
    note: "A splayed tubular leg that carries a whole office from one set of parts.",
    legImage: "/configurator/leg-stretch-s.jpg",
    frameShades: shadesFor("Stretch S"),
    tables: { kind: "series", series: PROS_SERIES },
    href: "/collections/pros",
  },
  {
    slug: "stretch-v",
    name: "Stretch V",
    note: "An upright leg on an adjustable beam frame; the beams extend to suit a range of top lengths.",
    legImage: "/configurator/leg-stretch-v.jpg",
    frameShades: shadesFor("Stretch V"),
    tables: { kind: "series", series: VARIDEX_SERIES },
    href: "/collections/varidex",
  },
  {
    slug: "stretch-f",
    name: "Stretch F",
    note: "A rounded frame leg in a contrasting colour.",
    legImage: "/configurator/leg-stretch-f.jpg",
    frameShades: shadesFor("Stretch F"),
    tables: { kind: "shared", series: PROS_SERIES },
    href: "/collections/fulcrum",
  },
  {
    slug: "apex",
    name: "Apex",
    note: "A tapered leg that leans out from the corner of the top.",
    legImage: "/configurator/leg-apex.jpg",
    frameShades: shadesFor("Apex"),
    tables: { kind: "shared", series: PROS_SERIES },
    href: "/collections/apex",
  },
  {
    slug: "element",
    name: "Element",
    note: "A slim, straight leg set at the corner of the top.",
    legImage: "/configurator/leg-element.jpg",
    frameShades: shadesFor("Element"),
    tables: { kind: "shared", series: PROS_SERIES },
    href: "/collections/element",
  },
  {
    slug: "stretch-e",
    name: "Stretch E",
    note: "An angular, open leg that gives cabin tables a strong profile.",
    legImage: "/configurator/leg-stretch-e.jpg",
    frameShades: shadesFor("Stretch E"),
    tables: { kind: "cabin" },
    href: "/collections/stretch-e",
    photo: { src: "/stretch-e/cabin.jpg", alt: "A Stretch E cabin table on an angular leg beside dark storage" },
  },
  {
    slug: "stretch-r",
    name: "Stretch R",
    note: "A broad, tapering leg under a curved top.",
    legImage: "/configurator/leg-stretch-r.jpg",
    frameShades: shadesFor("Stretch R"),
    tables: { kind: "cabin" },
    href: "/collections/stretch-r",
    photo: { src: "/stretch-r/cabin.jpg", alt: "A Stretch R cabin desk with a curved top on a broad pale leg" },
  },
  {
    slug: "square-legs",
    name: "Square legs",
    note: "Details to come.",
    frameShades: [],
    tables: { kind: "to-come" },
  },
  {
    slug: "loop-legs",
    name: "Loop legs",
    note: "Details to come.",
    frameShades: [],
    tables: { kind: "to-come" },
  },
];

export function findSystem(slug: string): SystemOption {
  return SYSTEMS.find((system) => system.slug === slug) ?? SYSTEMS[0];
}
