import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { findSeries } from "@/lib/series";
import { collectionSchema, collectionsSchema } from "./collection-schema";
import { LocalCatalogRepository } from "./local-repository";

const repo = new LocalCatalogRepository();

const valid = {
  slug: "apex",
  name: "APEX Series",
  kicker: "Splayed-leg desks and benches",
  blurb: "A tapered leg under desks and benches.",
  slotHint: "APEX: team bench",
  wordmark: "APEX",
  lead: "One leg drawn two ways.",
  pieces: ["Executive desk"],
  photos: [{ src: "/apex/cabin.jpg", alt: "A desk", caption: "Executive desk", kind: "scene" }],
};

describe("collectionSchema", () => {
  it("accepts a photographed collection", () => {
    expect(collectionSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a configurator collection with no photographs", () => {
    const { wordmark, lead, pieces, photos, ...base } = valid;
    void wordmark;
    void lead;
    void pieces;
    void photos;
    expect(collectionSchema.safeParse(base).success).toBe(true);
  });

  it("rejects a photo without alt text", () => {
    const photos = [{ ...valid.photos[0], alt: " " }];
    expect(collectionSchema.safeParse({ ...valid, photos }).success).toBe(false);
  });

  it("rejects a photographed collection whose first photo is not a scene", () => {
    const photos = [{ ...valid.photos[0], kind: "cutout" }];
    expect(collectionSchema.safeParse({ ...valid, photos }).success).toBe(false);
  });

  it("rejects a photographed collection without a wordmark, lead or pieces", () => {
    const { wordmark, ...rest } = valid;
    void wordmark;
    expect(collectionSchema.safeParse(rest).success).toBe(false);
  });

  it("rejects duplicate slugs", () => {
    expect(collectionsSchema.safeParse([valid, valid]).success).toBe(false);
  });
});

describe("src/data/collections.json", () => {
  it("serves every collection either a configurator or a photographed range", async () => {
    const collections = await repo.getCollections();
    for (const collection of collections) {
      const hasSeries = Boolean(findSeries(collection.slug));
      const hasPhotos = Boolean(collection.photos?.length);
      expect(hasSeries || hasPhotos, collection.slug).toBe(true);
    }
  });

  it("points every photograph at a file that exists", async () => {
    const collections = await repo.getCollections();
    const photos = collections.flatMap((c) => [...(c.photos ?? []), ...(c.legFinishes ? [c.legFinishes] : [])]);
    expect(photos.length).toBeGreaterThan(0);
    for (const photo of photos) {
      expect(existsSync(join(process.cwd(), "public", photo.src)), photo.src).toBe(true);
    }
  });

  /*
    A photographed collection has no specification behind it, so it must not quote one:
    no millimetre sizes, no seat counts, no part codes. Sizes come from src/lib/series.
  */
  it("states no sizes for a photographed collection", async () => {
    const collections = await repo.getCollections();
    const unmeasured = collections.filter((c) => !findSeries(c.slug));
    expect(unmeasured.length).toBeGreaterThan(0);
    for (const c of unmeasured) {
      const text = [c.blurb, c.lead ?? "", ...(c.photos ?? []).map((p) => `${p.alt} ${p.caption}`)].join(" ");
      expect(text, c.slug).not.toMatch(/\d\s*(mm|cm|m)\b|\d+\s*-?\s*seat/i);
    }
  });
});
