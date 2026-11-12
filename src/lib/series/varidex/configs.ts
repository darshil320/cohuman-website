import type { SeriesBomLine, SeriesConfig } from "../types";

/**
 * STRETCH V (slug `varidex`) — the six table types of the 2026 catalogue (pp. 36–37), in
 * its order. The catalogue lists ten rows; rows that differ only by beam length (single
 * table, meeting table, face-to-face bench) are one configuration each here, and the
 * beam follows the selected length (`variants`, read by `configParts`).
 *
 * Two things about this data, because both are easy to get wrong later:
 *
 * 1. Every top is quoted as a **range** ("1200–1400 mm"), not as discrete sizes. Only
 *    the endpoints are listed here — no intermediate size is invented.
 * 2. `VARIDEX.pdf` gives no per-configuration part number, so `code` carries the beam or
 *    leg package that defines the configuration. The UI labels it "Lead component" (see
 *    `codeLabel` on the series definition).
 *
 * Products photographed in the PDF without a size table (round top, L shape, manager
 * tables) live in the series' `gallery`, not here.
 */

const FOUR_LEG: SeriesBomLine = { name: "4 legs package", code: "CHS-4FLEG072-PC", qty: "1 pc" };
const TWO_LEG = (qty: string): SeriesBomLine => ({ name: "2 legs package", code: "CHS-2FLEG072-PC", qty });
const BENCH_LEG_PAIR: SeriesBomLine = { name: "Bench legs, one pair", code: "CHS-2BLEG-PC", qty: "1 pc" };
const BENCH_MID_LEG: SeriesBomLine = { name: "Bench mid leg", code: "CHS-BMLEG-PC", qty: "1 pc" };
const SHORT_BEAM = (qty: string): SeriesBomLine => ({
  name: "Horizontal beam · short",
  code: "CHS-2B120140-PC",
  qty,
});
const MEDIUM_BEAM = (qty: string): SeriesBomLine => ({
  name: "Horizontal beam · medium",
  code: "CHS-2B150180-PC",
  qty,
});
const LONG_BEAM = (qty: string): SeriesBomLine => ({
  name: "Horizontal beam · long",
  code: "CHS-2B190240-PC",
  qty,
});

/** Depths the catalogue quotes for desks and for facing pairs, as range endpoints. */
const DESK_DEPTHS = [600, 900];
const PAIR_DEPTHS = [1200, 1600];

export const VARIDEX_CONFIGS: SeriesConfig[] = [
  {
    slug: "square",
    n: "01",
    short: "Square table",
    name: "Square table",
    code: "CHS-2FLEG072-PC",
    image: "/varidex/meet-square.jpg",
    imageAlt: "Stretch V square table with two chairs",
    lens: [900, 1000, 1200],
    deps: [900, 1000, 1200],
    seats: "—",
    sq: true,
    bom: [TWO_LEG("2 pcs")],
  },
  {
    slug: "single",
    n: "02",
    short: "Single table",
    name: "Single table",
    code: "CHS-2B120140-PC",
    image: "/varidex/single-desk.jpg",
    imageAlt: "Stretch V single table with modesty panel and white legs",
    lens: [1200, 1400, 1500, 1800, 1900, 2400],
    deps: DESK_DEPTHS,
    seats: "—",
    variants: [
      { lens: [1200, 1400], code: "CHS-2B120140-PC", bom: [FOUR_LEG, SHORT_BEAM("1 pc")] },
      { lens: [1500, 1800], code: "CHS-2B150180-PC", bom: [FOUR_LEG, MEDIUM_BEAM("1 pc")] },
      { lens: [1900, 2400], code: "CHS-2B190240-PC", bom: [FOUR_LEG, LONG_BEAM("1 pc")] },
    ],
  },
  {
    slug: "return",
    n: "03",
    short: "Return table",
    name: "Return table",
    code: "CHS-2B120140-PC",
    image: "/varidex/l-shape.jpg",
    imageAlt: "Stretch V desk with a perpendicular return",
    lens: [1200, 1400],
    deps: DESK_DEPTHS,
    seats: "—",
    bom: [FOUR_LEG, SHORT_BEAM("1 pc"), TWO_LEG("1 pc")],
  },
  {
    slug: "meeting",
    n: "04",
    short: "Meeting table",
    name: "Meeting table",
    code: "CHS-2B190240-PC",
    image: "/varidex/meet-long.jpg",
    imageAlt: "Stretch V long meeting table in a dark finish",
    lens: [1900, 2400, 3000, 3600],
    deps: PAIR_DEPTHS,
    seats: "—",
    variants: [
      { lens: [1900, 2400], code: "CHS-2B190240-PC", bom: [BENCH_LEG_PAIR, LONG_BEAM("2 pcs")] },
      {
        lens: [3000, 3600],
        code: "CHS-2B150180-PC",
        bom: [BENCH_LEG_PAIR, MEDIUM_BEAM("4 pcs"), BENCH_MID_LEG],
      },
    ],
  },
  {
    slug: "inline-bench",
    n: "05",
    short: "In-line bench",
    name: "In-line bench",
    code: "CHS-SLMLEG-PC",
    image: "/varidex/bench-2.jpg",
    imageAlt: "Stretch V two desks run in line with screens",
    lens: [1200, 1400],
    deps: DESK_DEPTHS,
    seats: "2",
    bom: [
      FOUR_LEG,
      { name: "Single in line mid leg", code: "CHS-SLMLEG-PC", qty: "1 pc" },
      SHORT_BEAM("2 pcs"),
    ],
  },
  {
    slug: "face-to-face",
    n: "06",
    short: "Face-to-face bench",
    name: "Face-to-face bench",
    code: "CHS-2B150180-PC",
    image: "/varidex/bench-4-screen.jpg",
    imageAlt: "Stretch V four-seat face-to-face bench with side screens",
    lens: [1200, 1400, 1500, 1800],
    deps: PAIR_DEPTHS,
    seats: "4",
    variants: [
      {
        lens: [1200, 1400],
        code: "CHS-2B120140-PC",
        bom: [BENCH_LEG_PAIR, SHORT_BEAM("4 pcs"), BENCH_MID_LEG],
      },
      {
        lens: [1500, 1800],
        code: "CHS-2B150180-PC",
        bom: [BENCH_LEG_PAIR, MEDIUM_BEAM("4 pcs"), BENCH_MID_LEG],
      },
    ],
  },
];

/** Landing configuration — the face-to-face bench is the range's most specified table. */
export const VARIDEX_DEFAULT_SLUG = "face-to-face";
