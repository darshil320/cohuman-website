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
 *
 * The footage itself is a link to the product it shows (Nov 2026 review): a full-frame
 * link sits under the title block, and a caption in the bottom-right corner names the
 * product so the click is not a surprise.
 */
export function FilmIntro({ product }: { product: { name: string; href: string } }) {
  return (
    <div
      className="co-shell relative min-h-[100svh] pb-[clamp(112px,16vh,160px)]"
      style={{ paddingTop: `calc(${HEADER_HEIGHT}px + clamp(16px, 3vh, 32px))` }}
    >
      {/*
        Phones: a 360px stacked block. From lg: a short, wide strip — the headline on one
        line, then label | sentence | action — so it stays in the band of sweep above the
        desk instead of reaching down onto the marble.
      */}
      <Link href={product.href} aria-label={`See ${product.name}`} className="absolute inset-0 z-0" />
      <Link
        href={product.href}
        className="co-data absolute bottom-[clamp(16px,3vh,28px)] right-[18px] sm:right-6 lg:right-12 z-10 flex min-h-11 items-center border border-co-ink bg-co-bg px-4 text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
      >
        {product.name} →
      </Link>
      <div className="relative z-10 w-full max-w-[360px] border border-co-ink bg-co-bg lg:grid lg:w-fit lg:max-w-none lg:grid-cols-[auto_minmax(0,1fr)_auto]">
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
