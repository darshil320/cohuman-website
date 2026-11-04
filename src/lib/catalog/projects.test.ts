import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import projectsData from "@/data/projects.json";
import { LocalCatalogRepository } from "./local-repository";
import type { Project } from "./types";

const repo = new LocalCatalogRepository();

/** Counted proof stats are banned site-wide (CLAUDE.md, "No heritage claims"). */
const COUNTED_CLAIM = /\b\d+\+?\s*(clients|projects|installations|offices|floors|years?|seats)\b/i;

describe("src/data/projects.json", () => {
  it("never publishes an entry flagged hidden", async () => {
    const hidden = (projectsData as Project[]).filter((p) => p.hidden).map((p) => p.slug);
    const published = (await repo.getProjects()).map((p) => p.slug);
    expect(published.filter((slug) => hidden.includes(slug))).toEqual([]);
    for (const slug of hidden) expect(await repo.getProject(slug)).toBeNull();
  });

  it("has unique slugs", async () => {
    const projects = await repo.getProjects();
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("gives every project a name, a description and at least one photograph", async () => {
    const projects = await repo.getProjects();
    for (const project of projects) {
      expect(project.name.trim(), project.slug).not.toBe("");
      expect(project.delivered.trim(), project.slug).not.toBe("");
      expect(project.images.length, project.slug).toBeGreaterThan(0);
    }
  });

  it("points every photograph at a file in public/", async () => {
    const projects = await repo.getProjects();
    const missing = projects
      .flatMap((p) => p.images)
      .filter((src) => !existsSync(join(process.cwd(), "public", src)));
    expect(missing).toEqual([]);
  });

  it("keeps counted claims and the old trading name out of the copy", async () => {
    const projects = await repo.getProjects();
    for (const project of projects) {
      const copy = `${project.name} ${project.city ?? ""} ${project.delivered}`;
      expect(copy, project.slug).not.toMatch(COUNTED_CLAIM);
      expect(copy, project.slug).not.toMatch(/furniture concepts/i);
    }
  });
});
