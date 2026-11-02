import { describe, expect, it } from "vitest";
import {
  configDepthLabel,
  configLengthLabel,
  configSizeRange,
  rangeLabel,
  spanLabel,
} from "./derive";
import { PROS_SERIES, VARIDEX_SERIES } from "./index";
import type { SeriesConfig } from "./types";

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
    beam: "—",
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
  it("prints min — max", () => {
    expect(rangeLabel([1200, 1400, 1600])).toBe("1200 — 1600");
  });

  it("prints a single value once", () => {
    expect(rangeLabel([900])).toBe("900");
  });

  it("orders unsorted input", () => {
    expect(rangeLabel([1600, 1200])).toBe("1200 — 1600");
  });

  it("returns an empty string for no values rather than inventing one", () => {
    expect(rangeLabel([])).toBe("");
  });
});

describe("configLengthLabel", () => {
  it("is the length range for a rectangular top", () => {
    expect(configLengthLabel(config({ lens: [1200, 1400, 1600] }))).toBe("1200 — 1600");
  });

  it("is a diameter for a round top", () => {
    expect(configLengthLabel(config({ dia: true, lens: [800, 1200] }))).toBe("Ø800 — 1200");
  });
});

describe("configDepthLabel", () => {
  it("is the depth range for a rectangular top", () => {
    expect(configDepthLabel(config({ deps: [600, 750, 900] }))).toBe("600 — 900");
  });

  it("mirrors the side for a square top", () => {
    expect(configDepthLabel(config({ sq: true, lens: [800, 1000], deps: [800, 1000] }))).toBe(
      "800 — 1000",
    );
  });

  it("is null for a round top, which has no depth", () => {
    expect(configDepthLabel(config({ dia: true }))).toBeNull();
  });
});

describe("configSizeRange", () => {
  it("joins length and depth ranges", () => {
    expect(configSizeRange(config({ lens: [1200, 1600], deps: [600, 900] }))).toBe(
      "1200 — 1600 × 600 — 900",
    );
  });

  it("is the diameter alone for a round top", () => {
    expect(configSizeRange(config({ dia: true, lens: [800, 1200] }))).toBe("Ø800 — 1200");
  });

  it("reads the real PROS single desk off the series data", () => {
    const single = bySlug("single-medium", PROS_SERIES.configs);
    expect(configSizeRange(single)).toBe("1200 — 1600 × 600 — 900");
  });
});

describe("spanLabel", () => {
  it("spans the shortest to the longest length across configurations", () => {
    expect(spanLabel([config({ lens: [800, 1000] }), config({ lens: [2400, 4000] })])).toBe(
      "800 → 4000 mm",
    );
  });

  it("covers the whole PROS range, single desk to boardroom", () => {
    expect(spanLabel(PROS_SERIES.configs)).toBe("800 → 4000 mm");
  });

  it("covers the whole VARIDEX range", () => {
    const lens = VARIDEX_SERIES.configs.flatMap((c) => c.lens);
    expect(spanLabel(VARIDEX_SERIES.configs)).toBe(
      `${Math.min(...lens)} → ${Math.max(...lens)} mm`,
    );
  });

  it("returns an empty string for no configurations", () => {
    expect(spanLabel([])).toBe("");
  });
});
