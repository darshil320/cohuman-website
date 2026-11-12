import type { SeriesBomLine, SeriesConfig } from "../types";

/**
 * STRETCH S (slug `pros`) — the six table types of the 2026 catalogue (pp. 32–33), in
 * its order, with its sizes. The catalogue lists nine rows; rows that differ only by
 * beam length (single table, meeting table, bench) are one configuration each here, and
 * the beam schedule follows the selected length (`variants`, read by `configParts`).
 *
 * Part codes and quantities come from `PROS.pdf`, matched by length: where the PDF gave
 * a schedule for a length it is used as printed. Lengths the catalogue offers but the PDF
 * gave no schedule for carry the nearest PDF pattern (noted per variant) or a note in
 * place of a schedule — never invented quantities.
 *
 * Renders are the studio photography from `PROS.pdf`. Codes pattern-matched rather than
 * read off the PDF are listed once in the series' `inferredCodes`.
 */

const FOUR_LEG: SeriesBomLine = { name: "Four-leg package", code: "CHSS-4FLEG072-PC", qty: "1 pc" };
const TWO_LEG: SeriesBomLine = { name: "Two-leg package", code: "CHSS-2FLEG072-PC", qty: "1 pc" };
const BENCH_LEG_PAIR = (qty: string): SeriesBomLine => ({
  name: "Bench legs, one pair",
  code: "CHSS-2BLEG-PC",
  qty,
});
const BENCH_MID_LEG = (qty: string): SeriesBomLine => ({
  name: "Bench mid leg",
  code: "CHSS-BMLEG-PC",
  qty,
});
const SHORT_BEAM = (qty: string): SeriesBomLine => ({ name: "Short beam", code: "PRO-SB110-PC", qty });
const MEDIUM_BEAM = (qty: string): SeriesBomLine => ({ name: "Medium beam", code: "PRO-SB160-PC", qty });
const LONG_BEAM = (qty: string): SeriesBomLine => ({ name: "Long beam", code: "PRO-SB200-PC", qty });

export const PROS_CONFIGS: SeriesConfig[] = [
  {
    slug: "round",
    n: "01",
    short: "Round table",
    name: "Round table",
    code: "CHSS-MRD",
    image: "/pros/meet-round.jpg",
    imageAlt: "Stretch S round table for four",
    finish: "walnut",
    lens: [800, 900, 1000, 1200],
    deps: [800, 900, 1000, 1200],
    seats: "4",
    dia: true,
    bom: [{ ...TWO_LEG, qty: "2 pcs" }],
  },
  {
    slug: "square",
    n: "02",
    short: "Square table",
    name: "Square table",
    code: "CHSS-MSQ",
    image: "/pros/meet-square.jpg",
    imageAlt: "Stretch S square table for four",
    finish: "walnut",
    lens: [800, 1000],
    deps: [800, 1000],
    seats: "4",
    sq: true,
    bom: [{ ...TWO_LEG, qty: "2 pcs" }],
  },
  {
    slug: "single",
    n: "03",
    short: "Single table",
    name: "Single table",
    code: "CHSS-ST-SB160",
    image: "/pros/single-desk.jpg",
    imageAlt: "Stretch S single table with modesty panel",
    finish: "oak",
    lens: [1200, 1400, 1500, 1600, 1800, 2000],
    deps: [600, 700, 750, 900],
    seats: "1",
    variants: [
      { lens: [1200, 1400, 1500, 1600], code: "CHSS-ST-SB160", bom: [MEDIUM_BEAM("1 pc"), FOUR_LEG] },
      // No single table at 1800/2000 in the PDF; the long-beam desk schedule (manager table) is.
      { lens: [1800, 2000], code: "CHSS-ST-SB200", bom: [LONG_BEAM("1 pc"), FOUR_LEG] },
    ],
  },
  {
    slug: "return",
    n: "04",
    short: "Return table",
    name: "Return table",
    code: "CHSS-RT-SB110",
    image: "/pros/return-desk.jpg",
    imageAlt: "Stretch S return table with desk screen",
    finish: "oak",
    lens: [1200, 1400, 1500, 1600],
    deps: [600, 700, 750, 900],
    seats: "1",
    bom: [TWO_LEG, FOUR_LEG, SHORT_BEAM("1 pc")],
  },
  {
    slug: "meeting",
    n: "05",
    short: "Meeting table",
    name: "Meeting table",
    code: "CHSS-MT-SB200",
    image: "/pros/meet-long.jpg",
    imageAlt: "Stretch S meeting table on the long beam",
    finish: "walnut",
    lens: [2400, 3200, 3600, 4000],
    deps: [1200],
    seats: "8–12",
    bom: [
      LONG_BEAM("1 pc"),
      BENCH_LEG_PAIR("1 pc"),
      BENCH_MID_LEG("2 pcs"),
      { name: "Wire box", code: "CHSS-WBOX-PC", qty: "2 pcs" },
    ],
  },
  {
    slug: "bench",
    n: "06",
    short: "Bench",
    name: "Bench",
    code: "CHSS-BN4-SB160",
    image: "/pros/bench-4-screen.jpg",
    imageAlt: "Stretch S bench with screens",
    finish: "oak",
    lens: [1200, 1400, 1500, 1600, 1800, 2000],
    deps: [600, 700, 750],
    seats: "—",
    variants: [
      {
        lens: [1200, 1400, 1500, 1600],
        code: "CHSS-BN4-SB160",
        bom: [MEDIUM_BEAM("2 pcs"), BENCH_LEG_PAIR("1 pc"), BENCH_MID_LEG("4 pcs")],
      },
      {
        lens: [1800, 2000],
        code: "CHSS-BN4-SB200",
        bom: [LONG_BEAM("2 pcs"), BENCH_LEG_PAIR("2 pcs"), BENCH_MID_LEG("4 pcs")],
      },
    ],
  },
];

/** Landing configuration — the meeting table shows the range's reach. */
export const PROS_DEFAULT_SLUG = "meeting";
