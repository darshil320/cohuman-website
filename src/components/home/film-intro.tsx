import Link from "next/link";
import { Button } from "@/components/ui/button";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { HEADER_HEIGHT } from "@/lib/layout";
import { siteConfig } from "@/lib/site-config";

const LABEL = "Office systems — Surat, IN";
const SENTENCE = "Configurable desking, cabins and meeting tables, specified to the millimetre.";

/**
 * The page's claim, set straight onto the lead film as a heads-up readout — no panel, no
 * scrim, no box (Nov 2026: the framed title block read as a widget pasted on the video).
 *
 * Placement is measured, not guessed. Across every frame of the 10s orbit (desktop cut)
 * the desk fills 19–84% of the frame's height; only the top 19% of sweep stays empty the
 * whole time, and the bottom edge is floor. So, from md:
 *
 *   ── OFFICE SYSTEMS — SURAT, IN ───────────────────────────── 21.1702° N 72.8311° E
 *   Precision-made modular office furniture.            ← one line, sized to the band
 *   ·
 *   ·                       (the desk, unobstructed)
 *   ·
 *   [controls]  Configurable desking, cabins and meeting tables, …
 *               CONFIGURE A DESK →   ── FIG. 01 — ARQ EXECUTIVE DESK →
 *
 * The headline's size is `min(vw, vh)`-bound so the label and headline always end inside
 * the empty band whatever the window's shape. The phone cut is portrait, with the desk in
 * its lower half and 10–53% of the frame empty, so phones stack everything up there.
 *
 * It is the homepage's H1 and LCP text: `KineticHeading` animates transform only, so the
 * words paint on the first frame and read with scripting off. Copy is the site's existing
 * tagline and hero line, not new claims.
 */
export function FilmIntro({ product }: { product: { name: string; href: string } }) {
  return (
    <div
      className="co-shell relative min-h-[100svh] pb-[clamp(112px,16vh,160px)]"
      style={{ paddingTop: `calc(${HEADER_HEIGHT}px + clamp(10px, 2vh, 20px))` }}
    >
      {/* The footage is a link to the product it shows; the readout sits above it. */}
      <Link href={product.href} aria-label={`See ${product.name}`} className="absolute inset-0 z-0" />

      {/* Top band: the label on a datum line, then the headline. */}
      <div className="pointer-events-none relative z-10 text-co-ink">
        <p className="co-data flex items-center gap-3">
          <span aria-hidden className="block h-px w-8 shrink-0 bg-co-ink" />
          <span className="shrink-0">{LABEL}</span>
          <span aria-hidden data-reveal className="co-rule hidden h-px min-w-0 flex-1 bg-co-ink sm:block" />
          <span aria-hidden className="hidden shrink-0 sm:block">
            {siteConfig.coordinates.label}
          </span>
        </p>
        <h1 className="co-display mt-3 max-w-[14ch] text-[clamp(2rem,8.6vw,2.75rem)] leading-[1.02] md:mt-2.5 md:max-w-none md:whitespace-nowrap md:text-[clamp(1.75rem,min(2.8vw,4.6vh),3.25rem)]">
          <KineticHeading>{`${siteConfig.tagline}.`}</KineticHeading>
        </h1>

        {/* Phones: the sentence and both links stay in the empty upper half of the cut. */}
        <div className="mt-5 max-w-[34ch] md:hidden">
          <p className="text-[14px] leading-[1.5]">{SENTENCE}</p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <Button asChild variant="link" arrow className="pointer-events-auto">
              <Link href="/configure">Configure a desk</Link>
            </Button>
            <Button asChild variant="link" arrow className="pointer-events-auto">
              <Link href={product.href}>{product.name}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/*
        From md, a readout along the floor, bottom left. Measured: across the loop the
        floor's left ~55% stays clear, while the desk's legs cross the right half — so the
        sentence, the action and the figure callout share one left-hand group, starting
        clear of the ink control block (or on the shell's column on wide screens) and
        capped short of the halfway line. Type only, nothing boxed. Positioned with left /
        width rather than `co-shell`, whose own padding would override the offsets.
      */}
      <div className="pointer-events-none absolute bottom-[clamp(14px,2.6vh,26px)] left-[max(196px,calc((100vw-1440px)/2+48px))] z-10 hidden w-[min(540px,calc(54vw-196px))] text-co-ink md:block">
        <p className="text-[14px] leading-[1.5]">{SENTENCE}</p>
        <div className="mt-2 flex flex-wrap items-center gap-x-7 gap-y-1">
          <Button asChild variant="link" arrow className="pointer-events-auto">
            <Link href="/configure">Configure a desk</Link>
          </Button>
          <Link
            href={product.href}
            className="group co-data pointer-events-auto inline-flex min-h-11 items-center gap-3"
          >
            <span
              aria-hidden
              className="block h-px w-8 origin-left bg-co-ink transition-transform duration-(--duration-press) ease-(--ease-enter) group-hover:scale-x-150"
            />
            <span className="underline-offset-4 group-hover:underline">Fig. 01 — {product.name}</span>
            <span
              aria-hidden
              className="transition-transform duration-(--duration-press) ease-(--ease-enter) group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
