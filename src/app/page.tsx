import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { CtaBand } from "@/components/common/cta-band";
import { MobileRail } from "@/components/common/mobile-rail";
import { HeroSlider, type HeroSlide } from "@/components/home/hero-slider";
import { ManifestTicker } from "@/components/home/manifest-ticker";
import { Specimen } from "@/components/home/specimen";
import { ConfigureTeaser } from "@/components/home/configure-teaser";
import { SpaceTiles } from "@/components/home/space-tiles";
import { CollectionCard } from "@/components/catalog/collection-card";
import { ParallaxImage } from "@/components/ui/parallax-image";
import { SpecLabel } from "@/components/ui/spec-label";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { catalog } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";

/*
  The homepage declares its own canonical rather than leaning on the root layout, which
  no longer sets one — every route now states its own. Title and description come from
  the layout defaults, which are already written for this page.
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Hero slides.
 *
 * Each photograph gets its own headline describing what is actually in that frame, and
 * its own `objectPosition`: the three shots put their furniture in three different
 * places, so one crop meant the words landed on top of the product in at least one.
 * Panning toward the subject clears the left column, which is where the copy sits.
 */
const HERO_SLIDES: HeroSlide[] = [
  {
    src: "/hero-3.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUGAgT/xAAfEAEAAwABBAMAAAAAAAAAAAABAAIRBQMhMVEykcH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8AfnK9Fc76+yc5zBbwVdc+X5Jxs4937mDyQKPqcjVvWqVBc01hEtbPthLtTI//2Q==",
    alt: "Open-plan bench desking with task chairs and a city skyline beyond",
    objectPosition: "24% center",
    tag: "01 / Bench",
    headline: "Workspaces, engineered to the millimetre.",
    sub: "Modular desking drawn, made and installed by us. Every part carries a number.",
    linkLabel: "Height-adjustable desking",
    // STRETCH (`varidex`) is the adjustable-beam series. The route is keyed on the series
    // slug, not the wordmark — the wordmarks changed in the rebrand and the slugs did not.
    linkHref: "/collections/varidex",
  },
  {
    src: "/hero-2.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEDBP/EACAQAAICAgICAwAAAAAAAAAAAAECAxEAIQQSEzFBYXH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANc8Uar2Xv1Hu1+sSvAIqBYvRHv5rWCzuW3v9xTcKCc95F3VaoZaV45+KZmUo1KQbIu7GGUh8ddfEp1W94YH/9k=",
    alt: "Executive desk and credenza in a corner office overlooking the city",
    objectPosition: "58% center",
    tag: "02 / Cabin",
    headline: "The cabin, quoted as one room.",
    sub: "Desk, credenza, storage and seating on a single schedule, in one finish, installed in one visit.",
    linkLabel: "Executive suites",
    linkHref: "/sectors/executive",
  },
  {
    src: "/hero-1.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAQCAwX/xAAgEAACAQQCAwEAAAAAAAAAAAABAgADBBEhEjEFFUFC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AftWy6F1LYde9/RJ+ytXu0pLxBDFSvHZMpsCcHf6EXrqB5CkQACX3qUbL3lC3ZFqUwpbGDw13CK3ozasTvAhIR//Z",
    alt: "Executive office with desk, credenza and a meeting setting along the glazed wall",
    objectPosition: "28% center",
    tag: "03 / Floor",
    headline: "A floor that still works in year seven.",
    sub: "Made in our own workshop in Surat, so finishes can be matched and spares still exist a decade later.",
    linkLabel: "Open-plan benching",
    linkHref: "/collections",
  },
];

export default async function HomePage() {
  const [collections, spaces, services, projects] = await Promise.all([
    catalog.getCollections(),
    catalog.getSpaces(),
    catalog.getServices(),
    catalog.getProjects(),
  ]);

  return (
    <div>
      <HeroSlider slides={HERO_SLIDES} />

      <ManifestTicker />

      {/* 01 — Systems */}
      <section className="co-shell co-section-lg">
        <SectionHeading
          eyebrow="01 / Systems"
          title="Two chassis. Every table you need."
          blurb="Both run at 720mm, so tops sit flush wherever two configurations meet."
          linkHref="/collections"
          linkLabel="All collections"
        />
        <StaggerContainer className="grid grid-cols-1 gap-x-[clamp(22px,3vw,56px)] gap-y-[clamp(34px,4vw,64px)] sm:grid-cols-2">
          {collections.map((c, i) => (
            <StaggerItem key={c.slug}>
              <CollectionCard collection={c} index={i} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <Specimen />

      <SpaceTiles spaces={spaces} />

      <ConfigureTeaser />

      {/*
        05 — Work. The full-bleed band and the project grid used to be two consecutive
        sections both about projects, with a white gap between them. Merged onto one dark
        ground the photography carries far more weight, and the page loses a flicker.
      */}
      <section className="bg-co-panel text-co-panel-fg">
        {/*
          The band sets its own height and the picture fills it absolutely, so the copy
          layer is a normal in-flow child that can actually be bottom-aligned. Giving the
          height to the image instead left this wrapper at zero height, and the headline
          dropped straight out of the bottom of its own scrim.
        */}
        <div className="relative isolate flex min-h-[clamp(380px,58vh,620px)] flex-col justify-end overflow-hidden">
          <ParallaxImage
            src="/projects/narola/01.jpg"
            alt="An open-plan Cohuman floor: bench desking, acoustic screens and task seating"
            fill
            sizes="100vw"
            className="absolute inset-0"
          />
          {/* Bottom-weighted, so the copy sits on the darkest part and the ceiling of the
              photograph stays readable. */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/15"
          />
          <div className="co-shell relative pb-[clamp(32px,4.5vw,64px)] pt-[clamp(80px,14vh,160px)]">
            <SpecLabel tone="dark" rule className="mb-6 text-white/70">
              05 / Work
            </SpecLabel>
            <h2 className="co-h1 max-w-[16ch] text-white">
              <KineticHeading>Every floor here was drawn, made and installed by us.</KineticHeading>
            </h2>
          </div>
        </div>

        <div className="co-shell co-section-lg">
          <SectionHeading
            eyebrow="Selected projects"
            title="Floors we've finished."
            linkHref="/projects"
            linkLabel="All projects"
            titleClassName="text-co-panel-fg"
            className="[&_a]:border-co-panel-fg [&_a]:text-co-panel-fg [&_a:hover]:border-co-panel-faint [&_a:hover]:text-co-panel-muted"
          />
          <MobileRail total={Math.min(projects.length, 3)} label="Recent work">
            <StaggerContainer className="flex gap-5 [&>*]:w-[78vw] [&>*]:shrink-0 [&>*]:snap-start sm:grid sm:grid-cols-2 sm:gap-x-[clamp(20px,2.6vw,48px)] sm:gap-y-[clamp(34px,4vw,60px)] sm:[&>*]:w-auto lg:grid-cols-3">
              {projects.slice(0, 3).map((pr, i) => (
                <StaggerItem key={pr.slug}>
                  <Link href="/projects" className="group block text-co-panel-fg">
                    <div className="relative aspect-[4/3] overflow-hidden bg-co-panel-border">
                      <Image
                        src={pr.images[0]}
                        alt={`${pr.name} — completed fit-out`}
                        fill
                        sizes="(min-width: 1024px) 30vw, 100vw"
                        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.05]"
                      />
                      <span
                        aria-hidden
                        className="absolute left-3 top-3 font-mono text-[10.5px] tabular-nums text-white/70"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <span
                      aria-hidden
                      className="mt-[clamp(12px,1.4vw,18px)] block h-px w-full bg-co-panel-border transition-colors duration-500 group-hover:bg-co-panel-fg"
                    />
                    {pr.city ? (
                      <SpecLabel tone="dark" className="mb-2.5 mt-4">
                        {pr.city}
                      </SpecLabel>
                    ) : (
                      <div className="mt-4" />
                    )}
                    <h3 className="mb-2 font-display text-[clamp(17px,1.5vw,20px)] font-medium leading-tight tracking-[-0.026em]">
                      {pr.name}
                    </h3>
                    <p className="line-clamp-2 text-[13.5px] font-light leading-relaxed text-co-panel-muted">
                      {pr.delivered}
                    </p>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </MobileRail>
        </div>
      </section>

      {/* What we do */}
      <section className="border-t border-co-border">
        <div className="co-shell co-section grid grid-cols-1 gap-x-[clamp(28px,4vw,88px)] gap-y-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="lg:sticky lg:top-[clamp(110px,12vw,160px)] lg:self-start">
            <SpecLabel rule className="mb-6">
              06 / Scope
            </SpecLabel>
            <h2 className="co-h2 mb-6 max-w-[18ch]">
              <KineticHeading>Not just the furniture. The whole fit-out.</KineticHeading>
            </h2>
            <p className="co-lead mb-9 max-w-[42ch]">
              Most clients come to us with a floor plate and a headcount. We take it from there
              — layout, specification, manufacture, install, and a service contract that keeps
              it all working.
            </p>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2.5 border-b-2 border-co-ink pb-1.5 text-[14px] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
            >
              Our services
              <svg
                aria-hidden
                width="13"
                height="9"
                viewBox="0 0 13 9"
                fill="none"
                className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1"
              >
                <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </Link>
          </Reveal>

          <StaggerContainer className="grid">
            {services.map((sv) => (
              <StaggerItem
                key={sv.num}
                className="group grid grid-cols-[auto_1fr] items-start gap-x-5 border-t border-co-border py-[clamp(18px,2.2vw,30px)]"
              >
                <span
                  aria-hidden
                  className="mt-1.5 font-mono text-[10.5px] tracking-[0.16em] tabular-nums text-co-placeholder transition-colors duration-300 group-hover:text-co-ink"
                >
                  {sv.num}
                </span>
                <div className="min-w-0">
                  <h3 className="mb-2 font-display text-[clamp(17px,1.5vw,21px)] font-medium leading-tight tracking-[-0.026em]">
                    {sv.name}
                  </h3>
                  <p className="max-w-[46ch] text-[13.5px] font-light leading-relaxed text-co-muted">
                    {sv.blurb}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <CtaBand
        tone="dark"
        heading="Send us your floor plan. Get a costed proposal."
        body={`No obligation, no cart, no checkout — a real specification from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
