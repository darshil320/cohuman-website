import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { HEADER_HEIGHT } from "@/lib/layout";
import { siteConfig } from "@/lib/site-config";

const LABEL = "Office systems / Surat, IN";
const SENTENCE = "Configurable desking, cabins and meeting tables, specified to the millimetre.";

/**
 * The page's claim, set over the lead film as a drawing's title block.
 *
 * The film orbits the desk, so the desk moves through the frame and no part of it stays
 * empty for the whole loop. So the claim gets its own paper instead of a scrim: a canvas
 * panel in a 1px ink frame, ruled into a mono strip, the headline, one sentence and the
 * action. It sits high in the top left: on desktop as a short, wide strip inside the band
 * of sweep the orbit leaves above the desk, on phones as a small stacked block. The ink
 * control block holds the opposite corner, bottom left.
 *
 * It is the homepage's H1 and LCP text: `KineticHeading` animates transform only, so the
 * words paint on the first frame and read with scripting off. The headline and sentence
 * are the site's existing copy (`siteConfig.tagline` and the hero line), not new claims.
 */
export function FilmIntro() {
  return (
    <div
      className="co-shell min-h-[100svh] pb-[clamp(112px,16vh,160px)]"
      style={{ paddingTop: `calc(${HEADER_HEIGHT}px + clamp(16px, 3vh, 32px))` }}
    >
      {/*
        Phones: a 360px stacked block. From lg: a short, wide strip — the headline on one
        line, then label | sentence | action — so it stays in the band of sweep above the
        desk instead of reaching down onto the marble.
      */}
      <div className="w-full max-w-[360px] border border-co-ink bg-co-bg lg:grid lg:w-fit lg:max-w-none lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <p className="co-data flex items-center border-b border-co-ink px-4 py-2.5 lg:order-2 lg:border-b-0 lg:border-r lg:border-t">
          {LABEL}
        </p>
        <h1 className="co-display px-4 pb-4 pt-3.5 text-[clamp(min(1.625rem,7.6vw),2vw,1.75rem)] lg:order-1 lg:col-span-3 lg:whitespace-nowrap lg:px-5 lg:py-4 lg:text-[clamp(1.375rem,1.9vw,1.75rem)]">
          <KineticHeading>{`${siteConfig.tagline}.`}</KineticHeading>
        </h1>
        <p className="border-t border-co-ink px-4 py-3 text-[14px] leading-[1.45] text-co-ink lg:order-3 lg:flex lg:items-center lg:border-r">
          {SENTENCE}
        </p>
        <Button asChild className="h-auto min-h-12 w-full lg:order-4 lg:w-auto lg:border-t lg:border-co-ink">
          <Link href="/configure">Configure a desk</Link>
        </Button>
      </div>
    </div>
  );
}

/**
 * The previous design, kept for the client to compare (`COMPARE_FILM`): the claim in ink
 * straight on the footage — no scrim, no plate — composed as one band across the top of
 * the frame, claim left and sentence + action bottom-aligned right. That band is the
 * studio sweep's empty air throughout this film's wide-shot loop. On a phone it stacks.
 *
 * An H2: the lead film keeps the page's H1. Remove this with `COMPARE_FILM`.
 */
export function FilmBand() {
  return (
    <div
      className="co-shell grid min-h-[100svh] grid-cols-1 content-start gap-y-5 pb-[clamp(112px,16vh,160px)] lg:grid-cols-12 lg:items-end lg:gap-x-0"
      style={{ paddingTop: `calc(${HEADER_HEIGHT}px + clamp(28px, 7vh, 72px))` }}
    >
      <div className="lg:col-span-7">
        <p className="co-data text-co-ink">{LABEL}</p>
        <h2 className="co-display mt-[clamp(14px,2vh,24px)] max-w-[15ch] text-[clamp(min(2rem,8.6vw),3.9vw,3.75rem)]">
          <KineticHeading>{`${siteConfig.tagline}.`}</KineticHeading>
        </h2>
      </div>
      <div className="lg:col-span-4 lg:col-start-9">
        <p className="max-w-[34ch] text-[clamp(1rem,1.2vw,1.125rem)] leading-[1.5] text-co-ink">
          {SENTENCE}
        </p>
        <Button asChild className="mt-[clamp(16px,2.4vh,24px)]">
          <Link href="/configure">Configure a desk</Link>
        </Button>
      </div>
    </div>
  );
}
