import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { LocalCatalogRepository } from "./local-repository";
import { pieceImages, pieceSchema, piecesSchema, pieceSizeLabel } from "./piece-schema";

const repo = new LocalCatalogRepository();

const valid = {
  slug: "loop",
  name: "LOOP",
  type: "Executive desk",
  group: "pm-x-cohuman",
  tagline: "A long executive top.",
  about: "LOOP balances an open leg against a pedestal.",
  size: { w: [2400], d: [1100], h: [800] },
  scene: { src: "/pieces/loop/scene.jpg", alt: "LOOP in a cabin" },
  views: [{ src: "/pieces/loop/front.jpg", alt: "LOOP from the front", label: "Front" }],
};

describe("pieceSchema", () => {
  it("accepts a catalogue piece", () => {
    expect(pieceSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an unknown group", () => {
    expect(pieceSchema.safeParse({ ...valid, group: "tables" }).success).toBe(false);
  });

  it("rejects a view without alt text", () => {
    const views = [{ ...valid.views[0], alt: " " }];
    expect(pieceSchema.safeParse({ ...valid, views }).success).toBe(false);
  });

  it("rejects an image outside public/", () => {
    const scene = { ...valid.scene, src: "https://example.com/a.jpg" };
    expect(pieceSchema.safeParse({ ...valid, scene }).success).toBe(false);
  });

  it("rejects duplicate slugs", () => {
    expect(piecesSchema.safeParse([valid, valid]).success).toBe(false);
  });
});

describe("pieceSizeLabel", () => {
  it("prints width × depth × height in millimetres", () => {
    expect(pieceSizeLabel({ w: [2400], d: [1100], h: [800] })).toBe("2400 × 1100 × 800 mm");
  });

  it("lists every value the catalogue offers on an axis", () => {
    expect(pieceSizeLabel({ w: [900, 1400, 2000], d: [750], h: [750] })).toBe(
      "900 / 1400 / 2000 × 750 × 750 mm",
    );
  });
});

describe("src/data/pieces.json", () => {
  it("carries the catalogue's eight PM x Cohuman pieces, in its order", async () => {
    const pieces = await repo.getPieces();
    expect(pieces.filter((p) => p.group === "pm-x-cohuman").map((p) => p.slug)).toEqual([
      "arq",
      "loop",
      "duet",
      "axen",
      "mellow",
      "modo",
      "orca",
      "ren",
    ]);
  });

  it("points every image at a file that exists", async () => {
    const pieces = await repo.getPieces();
    const images = pieces.flatMap(pieceImages);
    for (const image of images) {
      expect(existsSync(join(process.cwd(), "public", image.src)), image.src).toBe(true);
    }
  });

  it("lists Type A under workstations as drawings only, with the catalogue's three sizes", async () => {
    const typeA = await repo.getPiece("type-a");
    expect(typeA?.group).toBe("workstations");
    expect(typeA?.scene).toBeUndefined();
    expect(typeA?.parts?.map((part) => pieceSizeLabel(part.size))).toEqual([
      "2400 × 1200 × 750\u00A0mm",
      "2100 × 800 × 750\u00A0mm",
      "1700 × 400 × 650\u00A0mm",
    ]);
  });

  it("keeps counted or heritage claims out of the copy", async () => {
    const pieces = await repo.getPieces();
    for (const piece of pieces) {
      const copy = `${piece.tagline} ${piece.about}`;
      expect(copy, piece.slug).not.toMatch(/\bsince\b|years|Furniture Concepts/i);
    }
  });
});
