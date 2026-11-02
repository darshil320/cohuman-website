import type { Metadata } from "next";
import { CtaBand } from "@/components/common/cta-band";
import { EnquireButton } from "@/components/common/enquire-button";
import { SectionHeading } from "@/components/common/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { servicesJsonLd } from "@/lib/seo/structured-data";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Space planning, turnkey fit-out, delivery & installation, and AMC aftercare — the whole fit-out, not just the furniture.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services",
    description:
      "Space planning, turnkey fit-out, delivery & installation, and AMC aftercare — the whole fit-out, not just the furniture.",
    url: "/services",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Services",
    description:
      "Space planning, turnkey fit-out, delivery & installation, and AMC aftercare — the whole fit-out, not just the furniture.",
  },
};

/**
 * Services as index rows: number, name in display caps with its one-line blurb, the
 * detail, and what is included as a mono parts list. Two columns of reading on wide
 * screens; on phones everything stacks under the number.
 */
export default async function ServicesPage() {
  const services = await catalog.getServices();

  /*
    `Service` nodes rather than an ItemList of links: services have no page of their own,
    so a list of URLs would point every entry back at this one. Each node names its
    provider by `@id` and states that it is quoted per project.
  */
  const servicesLd = servicesJsonLd(services);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesLd) }}
      />

      <PageHero
        eyebrow="Services"
        title="We do the drawings, the making and the aftercare."
        titleClassName="max-w-[18ch]"
        lead="Furniture is the easy part. The value is in getting the layout right first and keeping it working for a decade afterwards."
      />

      <section className="co-shell co-section">
        <SectionHeading eyebrow="01 / Scope" title="Plan, fit out, install, look after." className="mb-0" />

        <div
          aria-hidden
          className="co-eyebrow hidden border-b border-co-border py-3.5 md:grid md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)] md:gap-x-4 lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)_260px]"
        >
          <span>No.</span>
          <span>Service</span>
          <span>Scope</span>
          <span className="hidden lg:block">Included</span>
        </div>

        <StaggerContainer>
          {services.map((sv) => (
            <StaggerItem
              key={sv.num}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-4 gap-y-6 border-b border-co-border py-[clamp(28px,3.4vw,48px)] md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)] lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)_260px]"
            >
              <span className="co-data pt-1">{sv.num}</span>

              <div className="min-w-0">
                <h3 className="co-index">
                  {sv.name}
                </h3>
                <p className="mt-4 max-w-[34ch] text-[14px] leading-[1.55] text-co-muted">
                  {sv.blurb}
                </p>
              </div>

              <div className="col-start-2 min-w-0 md:col-start-auto">
                <p className="max-w-[56ch] text-[15px] leading-[1.55] text-co-ink-soft">
                  {sv.detail}
                </p>
                <EnquireButton variant="link" arrow subject={sv.name} className="mt-6">
                  Enquire about {sv.name}
                </EnquireButton>
              </div>

              <div className="col-start-2 min-w-0 md:col-start-3 lg:col-start-auto">
                <p className="co-eyebrow lg:sr-only">What is included</p>
                <ul className="co-data mt-3 border-t border-co-border lg:mt-0">
                  {sv.deliverables.map((d) => (
                    <li key={d} className="border-b border-co-border py-2.5">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <CtaBand
        tone="light"
        heading="Start with the floor plan."
        body="Send a CAD or PDF plan and a headcount. We will come back with test-fits and a costed schedule."
        subject="Fit-out services"
      />
    </div>
  );
}
