import { describe, expect, it } from "vitest";
import {
  configDepthLabel,
  configLengthLabel,
  configParts,
  configSizeRange,
  enquiryInterest,
  rangeLabel,
  sizeLabel,
  spanLabel,
} from "./derive";
import { PROS_SERIES, VARIDEX_SERIES } from "./index";
import type { SeriesConfig } from "./types";

/** The no-break space the labels bind values, units and range ends with. */
const NB = "\u00A0";

function config(overrides: Partial<SeriesConfig>): SeriesConfig {
  return {
    slug: "fixture",
    n: "01",
    short: "Fixture",
    name: "Fixture",
    code: "FIX-01",
    image: "/fixture.jpg",
    imageAlt: "",
    lens: [1200, 1600],
    deps: [600, 900],
    seats: "1",
    bom: [],
    ...overrides,
  };
}

function bySlug(slug: string, configs: SeriesConfig[]): SeriesConfig {
  const found = configs.find((c) => c.slug === slug);
  if (!found) throw new Error(`fixture config ${slug} missing`);
  return found;
}

describe("rangeLabel", () => {
  it("prints min – max", () => {
    expect(rangeLabel([1200, 1400, 1600])).toBe(`1200${NB}–${NB}1600`);
  });

  it("prints a single value once", () => {
    expect(rangeLabel([900])).toBe("900");
  });

  it("orders unsorted input", () => {
    expect(rangeLabel([1600, 1200])).toBe(`1200${NB}–${NB}1600`);
  });

  it("returns an empty string for no values rather than inventing one", () => {
    expect(rangeLabel([])).toBe("");
  });
});

describe("configLengthLabel", () => {
  it("is the length range for a rectangular top", () => {
    expect(configLengthLabel(config({ lens: [1200, 1400, 1600] }))).toBe(`1200${NB}–${NB}1600`);
  });

  it("is a diameter for a round top", () => {
    expect(configLengthLabel(config({ dia: true, lens: [800, 1200] }))).toBe(`Ø800${NB}–${NB}1200`);
  });
});

describe("configDepthLabel", () => {
  it("is the depth range for a rectangular top", () => {
    expect(configDepthLabel(config({ deps: [600, 750, 900] }))).toBe(`600${NB}–${NB}900`);
  });

  it("mirrors the side for a square top", () => {
    expect(configDepthLabel(config({ sq: true, lens: [800, 1000], deps: [800, 1000] }))).toBe(
      `800${NB}–${NB}1000`,
    );
  });

  it("is null for a round top, which has no depth", () => {
    expect(configDepthLabel(config({ dia: true }))).toBeNull();
  });
});

describe("configSizeRange", () => {
  it("joins length and depth ranges", () => {
    expect(configSizeRange(config({ lens: [1200, 1600], deps: [600, 900] }))).toBe(
      `1200${NB}–${NB}1600 × 600${NB}–${NB}900`,
    );
  });

  it("is the diameter alone for a round top", () => {
    expect(configSizeRange(config({ dia: true, lens: [800, 1200] }))).toBe(`Ø800${NB}–${NB}1200`);
  });

  it("reads the real PROS single desk off the series data", () => {
    const single = bySlug("single", PROS_SERIES.configs);
    expect(configSizeRange(single)).toBe(`1200${NB}–${NB}2000 × 600${NB}–${NB}900`);
  });
});

describe("sizeLabel", () => {
  it("binds the unit to the last figure, so the size can only wrap at a ×", () => {
    const single = bySlug("single", PROS_SERIES.configs);
    const selection = { series: PROS_SERIES, config: single, lenIndex: 0, depIndex: 0 };
    expect(sizeLabel(selection)).toBe(
      `${single.lens[0]} × ${single.deps[0]} × ${PROS_SERIES.workingHeightMm}${NB}mm`,
    );
  });

  it("prints a round top as a bound diameter", () => {
    const round = config({ dia: true, lens: [800, 1200] });
    expect(sizeLabel({ series: PROS_SERIES, config: round, lenIndex: 0, depIndex: 0 })).toBe(
      `Ø800${NB}mm`,
    );
  });
});

describe("spanLabel", () => {
  it("spans the shortest to the longest length across configurations", () => {
    expect(spanLabel([config({ lens: [800, 1000] }), config({ lens: [2400, 4000] })])).toBe(
      `800${NB}→${NB}4000${NB}mm`,
    );
  });

  it("covers the whole PROS range, round table to meeting table", () => {
    expect(spanLabel(PROS_SERIES.configs)).toBe(`800${NB}→${NB}4000${NB}mm`);
  });

  it("covers the whole VARIDEX range", () => {
    const lens = VARIDEX_SERIES.configs.flatMap((c) => c.lens);
    expect(spanLabel(VARIDEX_SERIES.configs)).toBe(
      `${Math.min(...lens)}${NB}→${NB}${Math.max(...lens)}${NB}mm`,
    );
  });

  it("returns an empty string for no configurations", () => {
    expect(spanLabel([])).toBe("");
  });
});

describe("configParts", () => {
  const beamed = config({
    lens: [1200, 1400, 1800],
    variants: [
      { lens: [1200, 1400], code: "SHORT", bom: [{ name: "Short beam", code: "B-S", qty: "1 pc" }] },
      { lens: [1800], code: "LONG", bom: [{ name: "Long beam", code: "B-L", qty: "1 pc" }] },
    ],
  });

  it("swaps the lead code and schedule with the length", () => {
    expect(configParts(beamed, 1400).code).toBe("SHORT");
    expect(configParts(beamed, 1800).bom[0].code).toBe("B-L");
  });

  it("falls back to the first variant for a length outside every variant", () => {
    expect(configParts(beamed, 9999).code).toBe("SHORT");
  });

  it("uses the configuration's own schedule when it has no variants", () => {
    const plain = config({ code: "PLAIN", bom: [{ name: "Leg", code: "L", qty: "2 pcs" }] });
    expect(configParts(plain, 1200)).toMatchObject({ code: "PLAIN", bom: [{ code: "L" }] });
  });

  it("puts the selected length's code in the enquiry interest", () => {
    const single = bySlug("single", PROS_SERIES.configs);
    const longIndex = single.lens.indexOf(2000);
    const interest = enquiryInterest({ series: PROS_SERIES, config: single, lenIndex: longIndex, depIndex: 0 });
    expect(interest).toContain("CHSS-ST-SB200");
  });
});

describe("series data", () => {
  const all = [...PROS_SERIES.configs, ...VARIDEX_SERIES.configs];

  it.each(all.map((c) => [c.slug, c] as const))("%s: every length has exactly one schedule", (_, c) => {
    if (!c.variants) {
      expect(c.bom?.length ?? 0).toBeGreaterThan(0);
      return;
    }
    for (const length of c.lens) {
      expect(c.variants.filter((v) => v.lens.includes(length))).toHaveLength(1);
    }
    for (const v of c.variants) {
      expect(v.lens.every((length) => c.lens.includes(length))).toBe(true);
    }
  });

  it("uses plain catalogue names — no beam or seat qualifiers", () => {
    for (const c of all) {
      expect(c.name).not.toMatch(/beam|seater|·|with screen/i);
    }
  });

  it("mirrors the catalogue's table types, in its order", () => {
    expect(PROS_SERIES.configs.map((c) => c.name)).toEqual([
      "Round table",
      "Square table",
      "Single table",
      "Return table",
      "Meeting table",
      "Bench",
    ]);
    expect(VARIDEX_SERIES.configs.map((c) => c.name)).toEqual([
      "Square table",
      "Single table",
      "Return table",
      "Meeting table",
      "In-line bench",
      "Face-to-face bench",
    ]);
  });

  it("lands on a configuration that exists", () => {
    for (const series of [PROS_SERIES, VARIDEX_SERIES]) {
      expect(series.configs.some((c) => c.slug === series.defaultConfigSlug)).toBe(true);
    }
  });
});
