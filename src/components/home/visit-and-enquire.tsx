import Link from "next/link";
import { EnquireButton } from "@/components/common/enquire-button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { Button } from "@/components/ui/button";
import { FigureCaption } from "@/components/ui/figure-caption";
import { Reveal } from "@/components/ui/scroll-reveal";
import { siteConfig } from "@/lib/site-config";

/** Aspect of `public/lines/pros-bench.png`, so the frame reserves its space (no shift). */
const DRAWING_ASPECT = "aspect-[1257/773]";

/**
 * The homepage's close: the showroom and the enquiry as two facing columns on the fog,
 * split by a hairline, with a line drawing of a Stretch S bench standing across the foot
 * of the divider — the drawing set's own way of saying "come and see it".
 *
 * The drawing is traced from the real Stretch S studio render
 * (`scripts/trace-line-drawing.py` → `public/lines/pros-bench.png`), not an illustration.
 * It is used as a CSS mask over a steel fill, so its lines take a Signal colour rather
 * than the PNG's own ink, and it is plotted in left to right behind the wipe hairline
 * (`ClipReveal`). On phones it sits between the two columns.
 *
 * Address and turnaround come from `siteConfig`, never typed here. The map is off on
 * purpose (see `siteConfig.mapEmbedUrl`), so this section has no map.
 */
export function VisitAndEnquire({ eyebrow, figure }: { eyebrow: string; figure: number }) {
  return (
    <section className="relative border-t border-co-ink bg-co-bg-alt">
      <div className="co-shell co-section-lg relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:pb-[clamp(180px,20vw,300px)]">
          {/* Showroom */}
          <Reveal className="lg:pr-[clamp(32px,5vw,96px)]">
            <p className="co-eyebrow">{eyebrow}</p>
            <h2 className="co-h2 mt-5 max-w-[14ch]">Sit on it before you specify it.</h2>
            <p className="co-lead mt-6 max-w-[46ch]">
              Stretch S and Stretch V are set up at our Surat showroom. Bring the floor plan —
              we will lay the configurations out at the sizes you are considering.
            </p>
            <address className="mt-7 not-italic">
              <p className="co-data max-w-[48ch] text-co-ink">
                {siteConfig.address.line1}
                <br />
                {siteConfig.address.line2}
              </p>
              <a href={`tel:+${siteConfig.phoneE164}`} className="co-data mt-2 inline-block text-co-muted-2 hover:text-co-ink">
                {siteConfig.phoneDisplay}
              </a>
            </address>
            <Button asChild variant="secondary" className="mt-8">
              <Link href="/contact">Book a showroom visit</Link>
            </Button>
          </Reveal>

          {/*
            The drawing. From lg it stands across the foot of the divider (absolute, so it
            takes no grid cell); on phones it sits between the columns in the flow.
          */}
          <figure className="pointer-events-none mx-auto mt-12 w-[min(100%,520px)] lg:absolute lg:bottom-[clamp(40px,5vw,80px)] lg:left-1/2 lg:mt-0 lg:w-[min(42vw,600px)] lg:-translate-x-[58%]">
            <ClipReveal>
              <div
                role="img"
                aria-label="Line drawing of a Stretch S bench: four desks with screens, task chairs and a plant"
                className={`${DRAWING_ASPECT} w-full bg-co-muted-2 [mask:url(/lines/pros-bench.png)_center/contain_no-repeat] [-webkit-mask:url(/lines/pros-bench.png)_center/contain_no-repeat]`}
              />
            </ClipReveal>
            <FigureCaption n={figure} className="mt-3 text-center lg:text-right">
              Stretch S bench, traced from the studio render
            </FigureCaption>
          </figure>

          {/* Enquiry — the hairline divider is this column's left rule, so it stops where
              the column does and leaves the drawing clear beneath it. */}
          <Reveal className="mt-14 border-t border-co-border pt-12 lg:mt-0 lg:self-start lg:border-l lg:border-t-0 lg:pl-[clamp(32px,5vw,96px)] lg:pt-0">
            <p className="co-eyebrow">Enquiry</p>
            <h2 className="co-h2 mt-5 max-w-[14ch]">Send us your floor plan.</h2>
            <p className="co-lead mt-6 max-w-[42ch]">
              Get a costed proposal back — no cart, no checkout, a real specification from a
              real person, usually inside {siteConfig.enquiryTurnaround}.
            </p>
            <div className="mt-8">
              <EnquireButton subject="Workspace enquiry">Get a quote</EnquireButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
