import Link from "next/link";
import { EnquireButton } from "@/components/common/enquire-button";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/scroll-reveal";
import { siteConfig } from "@/lib/site-config";

/**
 * Showroom and enquiry, merged (Nov 2026 review): the address and both actions on the
 * left, the map on the right. Replaces the homepage's separate showroom section and its
 * closing CTA band. The map renders only when `siteConfig.mapEmbedUrl` is set, so the
 * section never shows an empty frame.
 */
export function VisitAndEnquire({ eyebrow }: { eyebrow: string }) {
  const hasMap = Boolean(siteConfig.mapEmbedUrl);

  return (
    <section className="border-t border-co-ink bg-co-bg-alt">
      <div className="co-shell co-section">
        <SectionHeading
          layout="stacked"
          eyebrow={eyebrow}
          title="Sit on it before you specify it."
          blurb={`See the systems at our Surat showroom, or send us your floor plan and get a costed proposal back, usually inside ${siteConfig.enquiryTurnaround}.`}
          linkHref="/contact"
          linkLabel="Contact & showroom"
        />

        <div
          className={
            hasMap
              ? "grid grid-cols-1 items-start gap-x-[clamp(28px,5vw,96px)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]"
              : "grid grid-cols-1"
          }
        >
          <Reveal>
            <address className="not-italic">
              <p className="co-data text-co-ink">{siteConfig.address.line1}</p>
              <p className="co-data mt-1 max-w-[46ch] text-co-muted-2">{siteConfig.address.line2}</p>
              <a href={`tel:+${siteConfig.phoneE164}`} className="co-data mt-4 inline-block text-co-ink">
                {siteConfig.phoneDisplay}
              </a>
            </address>
            <div className="mt-8 flex flex-wrap gap-3">
              <EnquireButton subject="Workspace enquiry">Get a quote</EnquireButton>
              <Button asChild variant="secondary">
                <Link href="/contact">Book a showroom visit</Link>
              </Button>
            </div>
          </Reveal>

          {hasMap ? (
            <Reveal>
              <iframe
                title="Cohuman showroom on the map"
                src={siteConfig.mapEmbedUrl}
                className="aspect-[4/3] w-full border border-co-border bg-co-bg"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
