import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOARD_SHADES, allSwatches } from "./finishes";

describe("finishes", () => {
  it("carries catalogue v31's seven board shades with their codes", () => {
    expect(BOARD_SHADES.map((s) => s.code)).toEqual(["CH-01", "CH-02", "CH-03", "CH-04", "CH-05", "CH-06", "CH-07"]);
  });

  it("points every swatch at a file that exists", () => {
    for (const swatch of allSwatches()) {
      expect(existsSync(join(process.cwd(), "public", swatch.src)), swatch.src).toBe(true);
    }
  });
});
