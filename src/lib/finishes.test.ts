import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { BOARD_SHADES, allSwatches } from "./finishes";

describe("finishes", () => {
  it("carries the catalogue's seven board shades with their codes", () => {
    expect(BOARD_SHADES.map((s) => s.code)).toEqual(["22091", "20059", "21076", "20017", "11005", "10002", "10613"]);
  });

  it("points every swatch at a file that exists", () => {
    for (const swatch of allSwatches()) {
      expect(existsSync(join(process.cwd(), "public", swatch.src)), swatch.src).toBe(true);
    }
  });
});
