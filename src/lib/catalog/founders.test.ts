import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { founderSchema, foundersSchema } from "./founder-schema";
import { LocalCatalogRepository } from "./local-repository";

const repo = new LocalCatalogRepository();

/**
 * CLAUDE.md, "No heritage claims", and its one exception.
 *
 * Cohuman — the brand — is presented as new: no founding year, no years in business, no
 * "since", no previous trading name, no counted proof stats. A founder's *personal*
 * career history ("Since 1989, he has worked…") is allowed, on the client's decision, so
 * years and durations are not checked here. What a bio must still never do is reach for
 * the old trading name or put a count on Cohuman's own track record.
 */
const BRAND_HERITAGE = [
  /furniture concepts/i,
  /\b\d+\+?\s*(clients|projects|installations|offices|floors)\b/i,
  /cohuman\s+(has|was)\s+(been\s+)?(founded|established|trading|operating)\s+(in|since)/i,
];

const valid = {
  slug: "tushar-shah",
  name: "Tushar Shah",
  role: "Co-founder",
  bio: "Runs the workshop floor. Owns every drawing that leaves it.",
  focus: ["Manufacturing", "Specification"],
};

describe("founderSchema", () => {
  it("accepts a complete founder", () => {
    expect(founderSchema.parse(valid)).toEqual(valid);
  });

  it("accepts the optional photo, LinkedIn and quote", () => {
    const full = {
      ...valid,
      photo: { src: "/founders/tushar-shah.jpg", alt: "Tushar Shah in the Surat workshop" },
      linkedin: "https://www.linkedin.com/in/example",
      quote: "Measure twice.",
    };
    expect(founderSchema.parse(full)).toEqual(full);
  });

  it("rejects a founder with no bio", () => {
    expect(() => founderSchema.parse({ ...valid, bio: "" })).toThrow();
  });

  it("rejects a photo outside public/founders", () => {
    expect(() =>
      founderSchema.parse({ ...valid, photo: { src: "/site/hero.jpg", alt: "x" } }),
    ).toThrow();
  });

  it("rejects a photo with no alt text", () => {
    expect(() =>
      founderSchema.parse({ ...valid, photo: { src: "/founders/a.jpg", alt: "" } }),
    ).toThrow();
  });

  it("rejects a LinkedIn link that is not a linkedin.com https URL", () => {
    expect(() => founderSchema.parse({ ...valid, linkedin: "http://example.com/me" })).toThrow();
  });

  it("rejects duplicate slugs across the list", () => {
    expect(() => foundersSchema.parse([valid, valid])).toThrow();
  });
});

describe("LocalCatalogRepository.getFounders", () => {
  it("returns the founders from src/data/founders.json, validated", async () => {
    const founders = await repo.getFounders();
    expect(() => foundersSchema.parse(founders)).not.toThrow();
  });

  it("carries no brand-heritage claim in any founder's copy", async () => {
    for (const founder of await repo.getFounders()) {
      const copy = [founder.role, founder.bio, founder.quote ?? "", ...founder.focus].join(" ");
      for (const pattern of BRAND_HERITAGE) expect(copy, `${founder.name}: ${pattern}`).not.toMatch(pattern);
    }
  });

  it("keeps bios short — two to four sentences", async () => {
    for (const founder of await repo.getFounders()) {
      const sentences = founder.bio.split(/(?<=[.!?])\s+/).filter(Boolean);
      expect(sentences.length, founder.name).toBeGreaterThanOrEqual(2);
      expect(sentences.length, founder.name).toBeLessThanOrEqual(4);
    }
  });

  it("points every photo at a file that exists in public/", async () => {
    for (const founder of await repo.getFounders()) {
      if (!founder.photo) continue;
      expect(existsSync(join(process.cwd(), "public", founder.photo.src)), founder.photo.src).toBe(true);
    }
  });
});
