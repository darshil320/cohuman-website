import type { SeriesConfig } from "../types";

/**
 * The ten configurations on the VARIDEX element page, in the order the PDF lists them.
 *
 * Two things about this data, because both are easy to get wrong later:
 *
 * 1. `VARIDEX.pdf` quotes every top as a **range** ("1200~1400mm"), not as discrete
 *    sizes. Only the endpoints are listed here — no intermediate size is invented.
 * 2. The PDF gives no per-configuration part number, so `code` carries the beam or leg
 *    package that defines the configuration. The UI labels that column "Lead component"
 *    rather than "Element code" (see `codeLabel` on the series definition).
 *
 * Four further products are photographed and specified in the PDF without appearing in
 * the element table (round meeting top, L shape, manager table, manager table with
 * cabinet). They are not quotable configurations, so they live in the series' `gallery`
 * instead of being given invented sizes and schedules.
 */
export const VARIDEX_CONFIGS: SeriesConfig[] = [
  {
    slug: "square",
    n: "01",
    short: "Square",
    name: "Square Table",
    code: "VARI-2FLEG072-PC",
    image: "/varidex/meet-square.jpg",
    imageAlt: "VARIDEX square meeting table with two chairs",
    lens: [900, 1000, 1200],
    deps: [900, 1000, 1200],
    seats: "—",
    beam: "—",
    sq: true,
    bom: [{ name: "2 legs package", code: "VARI-2FLEG072-PC", qty: "2 pcs" }],
  },
  {
    slug: "single-short",
    n: "02",
    short: "Single 1.4m",
    name: "Single Table · Short Beam",
    code: "VARI-2B120140-PC",
    image: "/varidex/single-desk.jpg",
    imageAlt: "VARIDEX single table with modesty panel and white legs",
    lens: [1200, 1400],
    deps: [600, 800],
    seats: "—",
    beam: "2B120140",
    bom: [
      { name: "4 legs package", code: "VARI-4FLEG072-PC", qty: "1 pc" },
      { name: "Horizontal beam · short", code: "VARI-2B120140-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "single-medium",
    n: "03",
    short: "Single 1.8m",
    name: "Single Table · Medium Beam",
    code: "VARI-2B150180-PC",
    image: "/varidex/single-desk.jpg",
    imageAlt: "VARIDEX single table with modesty panel and white legs",
    lens: [1500, 1800],
    deps: [600, 800],
    seats: "—",
    beam: "2B150180",
    bom: [
      { name: "4 legs package", code: "VARI-4FLEG072-PC", qty: "1 pc" },
      { name: "Horizontal beam · medium", code: "VARI-2B150180-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "single-long",
    n: "04",
    short: "Single 2.4m",
    name: "Single Table · Long Beam",
    code: "VARI-2B190240-PC",
    image: "/varidex/single-desk.jpg",
    imageAlt: "VARIDEX single table with modesty panel and white legs",
    lens: [1900, 2400],
    deps: [600, 800],
    seats: "—",
    beam: "2B190240",
    bom: [
      { name: "4 legs package", code: "VARI-4FLEG072-PC", qty: "1 pc" },
      { name: "Horizontal beam · long", code: "VARI-2B190240-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "return",
    n: "05",
    short: "Return",
    name: "Return Table",
    code: "VARI-2B120140-PC",
    image: "/varidex/l-shape.jpg",
    imageAlt: "VARIDEX desk with a perpendicular return",
    lens: [1200, 1400],
    deps: [600, 800],
    seats: "—",
    beam: "2B120140",
    bom: [
      { name: "4 legs package", code: "VARI-4FLEG072-PC", qty: "1 pc" },
      { name: "Horizontal beam · short", code: "VARI-2B120140-PC", qty: "1 pc" },
      { name: "2 legs package", code: "VARI-2FLEG072-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "inline-bench",
    n: "06",
    short: "In line",
    name: "Single In Line Bench",
    code: "VARI-SLMLEG-PC",
    image: "/varidex/bench-2.jpg",
    imageAlt: "VARIDEX two desks run in line with screens",
    lens: [1200, 1400],
    deps: [600, 800],
    seats: "2",
    beam: "2B120140",
    bom: [
      { name: "4 legs package", code: "VARI-4FLEG072-PC", qty: "1 pc" },
      { name: "Single in line mid leg", code: "VARI-SLMLEG-PC", qty: "1 pc" },
      { name: "Horizontal beam · short", code: "VARI-2B120140-PC", qty: "2 pcs" },
    ],
  },
  {
    slug: "face-to-face-short",
    n: "07",
    short: "F2F short",
    name: "Face To Face Bench · Short Beam",
    code: "VARI-2B120140-PC",
    image: "/varidex/bench-4.jpg",
    imageAlt: "VARIDEX four-seater face-to-face bench",
    lens: [1200, 1400],
    deps: [1200, 1600],
    seats: "4",
    beam: "2B120140",
    bom: [
      { name: "Bench legs, one pair", code: "VARI-2BLEG-PC", qty: "1 pc" },
      { name: "Horizontal beam · short", code: "VARI-2B120140-PC", qty: "4 pcs" },
      { name: "Bench mid leg", code: "VARI-BMLEG-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "face-to-face-medium",
    n: "08",
    short: "F2F medium",
    name: "Face To Face Bench · Medium Beam",
    code: "VARI-2B150180-PC",
    image: "/varidex/bench-4-screen.jpg",
    imageAlt: "VARIDEX four-seater face-to-face bench with side screens",
    lens: [1500, 1800],
    deps: [1200, 1600],
    seats: "4",
    beam: "2B150180",
    bom: [
      { name: "Bench legs, one pair", code: "VARI-2BLEG-PC", qty: "1 pc" },
      { name: "Horizontal beam · medium", code: "VARI-2B150180-PC", qty: "4 pcs" },
      { name: "Bench mid leg", code: "VARI-BMLEG-PC", qty: "1 pc" },
    ],
  },
  {
    slug: "meeting-long-beam",
    n: "09",
    short: "Meeting 2.4m",
    name: "Meeting Table · Long Beam",
    code: "VARI-2B190240-PC",
    image: "/varidex/meet-rect.jpg",
    imageAlt: "VARIDEX rectangular meeting table",
    lens: [1900, 2400],
    deps: [1200, 1600],
    seats: "—",
    beam: "2B190240",
    bom: [
      { name: "Bench legs, one pair", code: "VARI-2BLEG-PC", qty: "1 pc" },
      { name: "Horizontal beam · long", code: "VARI-2B190240-PC", qty: "2 pcs" },
    ],
  },
  {
    slug: "meeting-extended",
    n: "10",
    short: "Meeting 3.6m",
    name: "Meeting Table · Extended Run",
    code: "VARI-2B150180-PC",
    image: "/varidex/meet-long.jpg",
    imageAlt: "VARIDEX extended meeting table in a dark finish",
    lens: [3000, 3600],
    deps: [1200, 1600],
    seats: "—",
    beam: "2B150180",
    bom: [
      { name: "Bench legs, one pair", code: "VARI-2BLEG-PC", qty: "1 pc" },
      { name: "Horizontal beam · medium", code: "VARI-2B150180-PC", qty: "4 pcs" },
      { name: "Bench mid leg", code: "VARI-BMLEG-PC", qty: "1 pc" },
    ],
  },
];

/** Landing configuration — the face-to-face bench is the range's most specified table. */
export const VARIDEX_DEFAULT_SLUG = "face-to-face-medium";
