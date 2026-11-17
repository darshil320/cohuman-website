import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  POWER_OPTIONS,
  SYSTEMS,
  TO_PLAN,
  defaultSpecification,
  resolveSpecification,
  summaryRows,
  summarySubject,
  summaryText,
  withSystem,
} from "./index";

const exists = (src: string) => existsSync(join(process.cwd(), "public", src));

describe("configurator systems (catalogue v31, Nov 2026 review)", () => {
  it("offers the seven catalogue systems, then square and loop legs", () => {
    expect(SYSTEMS.map((s) => s.name)).toEqual([
      "Stretch S",
      "Stretch V",
      "Stretch F",
      "Apex",
      "Element",
      "Stretch E",
      "Stretch R",
      "Square legs",
      "Loop legs",
    ]);
  });

  it("points every leg picture and power picture at a file that exists", () => {
    for (const system of SYSTEMS) if (system.legImage) expect(exists(system.legImage), system.legImage).toBe(true);
    for (const option of POWER_OPTIONS) expect(exists(option.src), option.src).toBe(true);
  });

  it("sizes Stretch S tables from its specification, at 750 mm", () => {
    const resolved = resolveSpecification(defaultSpecification("stretch-s"));
    expect(resolved.size).toMatch(/750 mm$/);
  });

  it("gives Stretch E and R a cabin table sized to the plan", () => {
    for (const slug of ["stretch-e", "stretch-r"]) {
      const resolved = resolveSpecification(defaultSpecification(slug));
      expect(resolved.tables.map((t) => t.name)).toEqual(["Cabin table"]);
      expect(resolved.size).toBe(TO_PLAN);
    }
  });

  it("lends shared systems Stretch S's sizes but never its renders", () => {
    const resolved = resolveSpecification(defaultSpecification("apex"));
    expect(resolved.tables.length).toBeGreaterThan(0);
    expect(resolved.tables.every((t) => t.image === "")).toBe(true);
  });

  it("has no tables yet for square and loop legs, and says so", () => {
    const resolved = resolveSpecification(defaultSpecification("loop-legs"));
    expect(resolved.top).toBeNull();
    expect(summaryRows(resolved).find((r) => r.label === "Configuration")?.value).toBe("Not available");
  });

  it("tags benches sharing or non-sharing", () => {
    const v = resolveSpecification(defaultSpecification("stretch-v"));
    expect(v.tables.find((t) => t.slug === "face-to-face")?.sharing).toBe("sharing");
    expect(v.tables.find((t) => t.slug === "inline-bench")?.sharing).toBe("non-sharing");
  });

  it("keeps the frame finish within the new system's shades when the system changes", () => {
    const spec = withSystem(defaultSpecification("stretch-s"), "stretch-f");
    expect(resolveSpecification(spec).frameShade?.name).toBe("Orange");
  });

  it("keeps the enquiry subject on one line under the API's 200 characters", () => {
    for (const system of SYSTEMS) {
      const subject = summarySubject(resolveSpecification(defaultSpecification(system.slug)));
      expect(subject.length).toBeLessThanOrEqual(200);
      expect(subject).not.toMatch(/\n/);
    }
  });

  it("never sends supplier part codes in the enquiry text", () => {
    const text = summaryText(resolveSpecification({ ...defaultSpecification(), power: "pop-up-box" }));
    expect(text).not.toMatch(/PROS-|CHSS-|CHS-|Q\d{3,}/);
  });
});
