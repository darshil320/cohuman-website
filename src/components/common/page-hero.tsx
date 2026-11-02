import type { ReactNode } from "react";
import { HairlineGrid } from "@/components/ui/hairline-grid";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  /** Mono label over the claim, e.g. "Sectors" or "Catalog — Office furniture". */
  eyebrow: string;
  /** The claim, set in extended caps. Plain text so `KineticHeading` can mask its words. */
  title: string;
  lead: ReactNode;
  /** Measure for the claim, e.g. "max-w-[16ch]" — each page's line breaks differ. */
  titleClassName?: string;
  /**
   * Optional right-hand column — a block of spec rows summarising the page. With it the
   * hero lays out on the 12-column grid: claim across seven columns, aside across four.
   */
  aside?: ReactNode;
}

/**
 * The page hero every secondary route opens with: canvas, the 12-column hairline grid,
 * a mono label, the claim in extended caps, a lead paragraph, closed by an ink rule.
 *
 * Text only, so the claim is the LCP element; `KineticHeading` animates transform alone,
 * so the words are painted on the first frame.
 */
export function PageHero({ eyebrow, title, lead, titleClassName, aside }: PageHeroProps) {
  const copy = (
    <>
      <p className="co-eyebrow">{eyebrow}</p>
      <h1 className={cn("co-h1 mt-[clamp(20px,2.6vw,36px)] max-w-[16ch]", titleClassName)}>
        <KineticHeading>{title}</KineticHeading>
      </h1>
      <p className="co-lead mt-[clamp(20px,2.6vw,36px)] max-w-[58ch]">{lead}</p>
    </>
  );

  return (
    <section className="relative overflow-hidden border-b border-co-ink">
      <HairlineGrid />
      {aside ? (
        <div className="co-shell relative grid grid-cols-1 gap-y-10 pb-[clamp(48px,6vw,96px)] pt-[clamp(40px,5vw,72px)] lg:grid-cols-12 lg:items-end lg:gap-x-0">
          <div className="lg:col-span-7 lg:pr-10">{copy}</div>
          <div className="bg-co-bg lg:col-span-4 lg:col-start-9">{aside}</div>
        </div>
      ) : (
        <div className="co-shell relative pb-[clamp(48px,6vw,96px)] pt-[clamp(40px,5vw,72px)]">{copy}</div>
      )}
    </section>
  );
}
