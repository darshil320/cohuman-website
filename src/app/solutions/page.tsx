import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/common/cta-band";
import { EnquireButton } from "@/components/common/enquire-button";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { spacePhoto } from "@/lib/photos";
import { publicFileExists } from "@/lib/public-assets";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Workspace Solutions",
  description:
    "Specified by the room, not the SKU — cabin, workstation, meeting and lounge furniture schedules from Cohuman.",
  alternates: { canonical: "/solutions" },
  openGraph: {
    title: "Workspace Solutions",
    description:
      "Specified by the room, not the SKU — cabin, workstation, meeting and lounge furniture schedules from Cohuman.",
    url: "/solutions",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Workspace Solutions",
    description:
      "Specified by the room, not the SKU — cabin, workstation, meeting and lounge furniture schedules from Cohuman.",
  },
};

const PROCESS_STEPS = [
  { num: "01", name: "Plan", blurb: "Your floor plan and headcount become two or three test-fits with real seat counts." },
  { num: "02", name: "Specify", blurb: "Finishes, fabrics and edge details chosen from samples you can hold, not a swatch on a screen." },
  { num: "03", name: "Make & install", blurb: "Manufactured to the schedule, delivered by floor, installed by our own crews." },
  { num: "04", name: "Look after", blurb: "An annual contract, stocked spares, and re-upholstery instead of replacement." },
];

/**
 * Workspace solutions — furniture specified by the room.
 *
 * Each space is a numbered figure (a high-key photograph of a finished install) beside
 * its copy, alternating sides down the page. `Space.includes` is deliberately not shown:
 * it names the illustrative demo products, not real Cohuman ones, and the homepage's
 * space tiles leave it out for the same reason.
 */
export default async function SolutionsPage() {
  const spaces = await catalog.getSpaces();

  return (
    <div>
      <PageHero
        eyebrow="Workspace solutions"
        title="Specified by the room, not the SKU."
        lead="Most enquiries start with a room and a headcount rather than a product code. Pick the space you are fitting out and we will send back a schedule for it."
      />

      <section className="co-shell co-section">
        <SectionHeading eyebrow="01 / Spaces" title="Pick the room." className="mb-0" />

        {spaces.map((sp, i) => {
          const photo = spacePhoto[sp.slug];
          const hasPhoto = photo ? publicFileExists(photo) : false;
          const flip = i % 2 === 1;

          return (
            <article
              key={sp.slug}
              className="grid grid-cols-1 items-center gap-x-[clamp(28px,5vw,96px)] gap-y-8 border-b border-co-border py-[clamp(40px,5vw,80px)] lg:grid-cols-12"
            >
              {hasPhoto ? (
                <figure className={cn("lg:col-span-7", flip && "lg:order-last")}>
                  <ClipReveal className="aspect-[16/10] border border-co-border bg-co-bg-alt">
                    <Image
                      src={photo}
                      alt={sp.slotHint}
                      fill
                      sizes="(min-width: 1024px) 56vw, 100vw"
                      className="co-highkey object-cover"
                    />
                  </ClipReveal>
                  <FigureCaption n={i + 1} className="mt-3">
                    {sp.name}
                  </FigureCaption>
                </figure>
              ) : null}

              <Reveal className={cn(hasPhoto ? "lg:col-span-5" : "lg:col-span-12")}>
                <p className="co-eyebrow">{sp.num} / Space type</p>
                <h3 className="co-h2 mt-4">{sp.name}</h3>
                <p className="co-lead mt-5 max-w-[40ch]">{sp.blurb}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <EnquireButton subject={`${sp.name} — full room schedule`}>
                    Get a {sp.name} schedule
                  </EnquireButton>
                  <Button asChild variant="secondary">
                    <Link href="/collections">Browse collections</Link>
                  </Button>
                </div>
              </Reveal>
            </article>
          );
        })}
      </section>

      <section className="bg-co-panel">
        <div className="co-shell co-section">
          <SectionHeading
            tone="dark"
            eyebrow="02 / Process"
            title="How a whole floor comes together."
          />
          <StaggerContainer
            as="ol"
            className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4"
          >
            {PROCESS_STEPS.map((ps) => (
              <StaggerItem key={ps.num} as="li" className="border-t border-co-panel-border pt-4">
                <p className="co-data text-co-panel-faint">{ps.num}</p>
                <h3 className="co-h3 mt-6 text-co-panel-fg">{ps.name}</h3>
                <p className="mt-3 max-w-[36ch] text-[15px] leading-[1.55] text-co-panel-muted">
                  {ps.blurb}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CtaBand
        heading="Start with one room."
        body="A floor plan and a headcount are enough. Tell us the spaces you are fitting out and we will send back a schedule for each."
        subject="Workspace solutions — room schedule"
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
