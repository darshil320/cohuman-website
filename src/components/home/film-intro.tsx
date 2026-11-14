import Link from "next/link";
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
 *               CONFIGURE A DESK →  |  ARQ EXECUTIVE DESK →
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
          <HeroLinks product={product} className="mt-2" />
        </div>
      </div>

      {/*
        From md, a readout along the floor, bottom left. Measured: across the loop the
        floor's left ~55% stays clear, while the desk's legs cross the right half — so the
        sentence and the two links share one left-hand group, starting
        clear of the ink control block (or on the shell's column on wide screens) and
        capped short of the halfway line. Type only, nothing boxed. Positioned with left /
        width rather than `co-shell`, whose own padding would override the offsets.
      */}
      <div className="pointer-events-none absolute bottom-[clamp(14px,2.6vh,26px)] left-[max(196px,calc((100vw-1440px)/2+48px))] z-10 hidden w-[min(540px,calc(54vw-196px))] text-co-ink md:block">
        <p className="text-[14px] leading-[1.5]">{SENTENCE}</p>
        <HeroLinks product={product} className="mt-1.5" />
      </div>
    </div>
  );
}

/**
 * The hero's two actions as one matched pair: same mono caps, same arrow, same rule,
 * same baseline, split by a hairline. Each sits on a faint resting rule (so it reads as
 * a link on the footage); on hover or focus an ink rule is drawn over it left to right
 * and the arrow steps forward. Every moving part stays inside its own link's box, so
 * nothing ever runs into its neighbour.
 */
function HeroLinks({ product, className }: { product: { name: string; href: string }; className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-5 gap-y-1 ${className ?? ""}`}>
      <HeroLink href="/configure">Configure a desk</HeroLink>
      <span aria-hidden className="hidden h-3.5 w-px bg-co-ink/30 sm:block" />
      <HeroLink href={product.href}>{product.name}</HeroLink>
    </div>
  );
}

function HeroLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="group co-data pointer-events-auto relative inline-flex min-h-11 items-center gap-2.5 text-co-ink"
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-(--duration-press) ease-(--ease-enter) group-hover:translate-x-1 group-focus-visible:translate-x-1"
      >
        →
      </span>
      {/* Resting rule, then the ink rule drawn over it on hover. */}
      <span aria-hidden className="absolute inset-x-0 bottom-2.5 h-px bg-co-ink/25" />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-2.5 h-px origin-left scale-x-0 bg-co-ink transition-transform duration-300 ease-(--ease-enter) group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </Link>
  );
}
