import { describe, expect, it } from "vitest";
import { ORGATEC_2026, isAnnouncementLive } from "./orgatec";

describe("isAnnouncementLive", () => {
  it("is live before the show", () => {
    expect(isAnnouncementLive(ORGATEC_2026, new Date("2026-11-05T12:00:00+05:30"))).toBe(true);
  });

  it("is live on the last day of the show", () => {
    expect(isAnnouncementLive(ORGATEC_2026, new Date("2026-11-21T23:59:00+05:30"))).toBe(true);
  });

  it("switches off once the show has ended", () => {
    expect(isAnnouncementLive(ORGATEC_2026, new Date("2026-11-22T00:00:00+05:30"))).toBe(false);
  });

  it("rejects an unparseable end date rather than showing forever", () => {
    expect(() => isAnnouncementLive({ ...ORGATEC_2026, endsAt: "soon" }, new Date())).toThrow(/Invalid endsAt/);
  });

  it("matches the invitation", () => {
    expect(ORGATEC_2026).toMatchObject({ booth: "H18", city: "Mumbai", datesLabel: "19–21 Nov 2026" });
  });
});
