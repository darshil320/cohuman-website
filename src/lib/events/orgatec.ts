/**
 * ORGATEC India 2026 — the trade show Cohuman exhibits at. Values from the organiser's
 * invitation the client supplied. Drives the site-wide announcement popup
 * (`src/components/common/orgatec-popup.tsx`), which switches itself off once the show
 * ends, so nobody has to remember to take it down.
 */
export interface TradeShow {
  name: string;
  /** Printed dates, as the invitation sets them. */
  datesLabel: string;
  venue: string;
  city: string;
  booth: string;
  /** First day, local midnight in India (IST, +05:30). */
  startsAt: string;
  /** The moment the show is over: midnight IST after the last day. */
  endsAt: string;
}

export const ORGATEC_2026: TradeShow = {
  name: "ORGATEC India 2026",
  datesLabel: "19–21 Nov 2026",
  venue: "Jio World Convention Centre",
  city: "Mumbai",
  booth: "H18",
  startsAt: "2026-11-19T00:00:00+05:30",
  endsAt: "2026-11-22T00:00:00+05:30",
};

/** True until the show has ended — the popup runs in the build-up and during the show. */
export function isAnnouncementLive(show: TradeShow, now: Date): boolean {
  const ends = new Date(show.endsAt).getTime();
  if (Number.isNaN(ends)) throw new Error(`Invalid endsAt for ${show.name}: ${show.endsAt}`);
  return now.getTime() < ends;
}
