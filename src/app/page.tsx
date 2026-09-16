import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/common/hero-carousel";
import { MobileRail } from "@/components/common/mobile-rail";
import { SectionHeading } from "@/components/common/section-heading";
import { CtaBand } from "@/components/common/cta-band";
import { ConfigureTeaser } from "@/components/home/configure-teaser";
import { HomeProof } from "@/components/home/home-proof";
import { SpaceTiles } from "@/components/home/space-tiles";
import { CapabilityEditorial } from "@/components/home/capability-editorial";
import { HomeImageBand } from "@/components/home/image-band";
import { CollectionCard } from "@/components/catalog/collection-card";
import { ProductCard } from "@/components/catalog/product-card";
import { catalog } from "@/lib/catalog";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { HEADER_HEIGHT } from "@/lib/layout";
import { siteConfig } from "@/lib/site-config";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

/*
  The homepage declares its own canonical rather than leaning on the root layout, which
  no longer sets one — every route now states its own. Title and description come from
  the layout defaults, which are already written for this page.
*/
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURED_SLUGS = [
  "aria-task",
  "loom-linear",
  "meridian-executive",
  "parlour-sofa",
  "assembly-conference",
  "stack-storage-wall",
];

/**
 * Hero slides.
 *
 * Each photograph gets its own headline, describing what is actually in that frame, and
 * its own `objectPosition`. The three shots put their furniture in three different
 * places, so a single crop and a single caption meant the words landed on top of the
 * product in at least one of them. Panning the crop toward the subject clears the left
 * column, which is where the copy sits in all three.
 */
const HERO_SLIDES = [
  {
    src: "/hero-3.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABgDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAUGAgT/xAAfEAEAAwABBAMAAAAAAAAAAAABAAIRBQMhMVEykcH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABYRAQEBAAAAAAAAAAAAAAAAAAABEf/aAAwDAQACEQMRAD8AfnK9Fc76+yc5zBbwVdc+X5Jxs4937mDyQKPqcjVvWqVBc01hEtbPthLtTI//2Q==",
    alt: "Open-plan bench desking with task chairs and a city skyline beyond",
    // The benching is dead centre in this shot, so the crop is pulled toward the left of
    // the source, which pushes the desks right and away from the copy. A third line of
    // headline would have reached them regardless — the sub-line carries the rest.
    objectPosition: "22% center",
    headline: ["Height adjustable", "workstations"],
    sub: "Bench desking that raises and lowers, specified to the millimetre and quoted off a component schedule.",
    linkLabel: "Height Adjustable Table",
    // STRETCH (`varidex`) is the adjustable-beam series, which is what this slide's copy
    // describes. The route is keyed on the series slug, not the wordmark — the wordmark
    // changed to STRETCH/STRETCHS in the rebrand and the slugs deliberately did not, so
    // `/collections/stretchs` never existed and 404'd.
    linkHref: "/collections/varidex",
  },
  {
    src: "/hero-2.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAANABgDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAAEDBP/EACAQAAICAgICAwAAAAAAAAAAAAECAxEAIQQSEzFBYXH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAv/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/ANc8Uar2Xv1Hu1+sSvAIqBYvRHv5rWCzuW3v9xTcKCc95F3VaoZaV45+KZmUo1KQbIu7GGUh8ddfEp1W94YH/9k=",
    alt: "Executive desk and credenza in a corner office overlooking the city",
    // Desk and both figures already sit right of centre; this holds them there.
    objectPosition: "58% center",
    headline: ["The cabin,", "quoted as one room"],
    sub: "Desk, credenza, storage and seating on a single schedule, in one finish, installed in one visit.",
    linkLabel: "Executive Suites",
    linkHref: "/sectors/executive",
  },
  {
    src: "/hero-1.jpg",
    blurDataURL:
      "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAKABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAQCAwX/xAAgEAACAQQCAwEAAAAAAAAAAAABAgADBBEhEjEFFUFC/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAVEQEBAAAAAAAAAAAAAAAAAAAAEf/aAAwDAQACEQMRAD8AftWy6F1LYde9/RJ+ytXu0pLxBDFSvHZMpsCcHf6EXrqB5CkQACX3qUbL3lC3ZFqUwpbGDw13CK3ozasTvAhIR//Z",
    alt: "Executive office with desk, credenza and a meeting setting along the glazed wall",
    // Desk group is centred, lounge to the right; bias left so the empty floor and the
    // glazed wall sit under the copy.
    objectPosition: "28% center",
    headline: ["A floor that still", "works in year seven"],
    sub: "Made in our own workshop in Surat, so finishes can be matched and spares still exist a decade later.",
    linkLabel: "Open Plan Benching",
    linkHref: "/collections",
  },
];

export default async function HomePage() {
  const [categories, collections, spaces, services, projects, allProducts] = await Promise.all([
    catalog.getCategories(),
    catalog.getCollections(),
    catalog.getSpaces(),
    catalog.getServices(),
    catalog.getProjects(),
    catalog.getProducts(),
  ]);

  const featured = FEATURED_SLUGS.map((slug) => allProducts.find((p) => p.slug === slug)).filter(
    (p): p is NonNullable<typeof p> => Boolean(p),
  );

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-co-border" style={{ marginTop: -HEADER_HEIGHT }}>
        {/* Copy lives on each slide now — see HERO_SLIDES. */}
        <HeroCarousel
          slides={HERO_SLIDES}
          className="h-[calc(100vh-20px)] min-h-[540px] max-h-[760px]"
        />
      </section>


      {/* <HomeProof /> */}

      {/* Collections */}
      <section className="co-shell co-section-lg">
        <SectionHeading
          eyebrow="Collections"
          title="Two desking systems, specified to the millimetre."
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

      <SpaceTiles spaces={spaces} />

      {/* Signature pieces */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="Signature pieces"
          title="The ones we get asked for."
          linkHref="/catalog"
          linkLabel="Full catalog"
        />
        {/* One swipe apart on a phone, a three-up grid from `sm`. */}
        <MobileRail total={featured.length} label="Signature pieces">
          <StaggerContainer className="flex gap-5 [&>*]:w-[78vw] [&>*]:shrink-0 [&>*]:snap-start sm:grid sm:grid-cols-2 sm:gap-x-[clamp(20px,2.6vw,48px)] sm:gap-y-[clamp(34px,4vw,60px)] sm:[&>*]:w-auto lg:grid-cols-3">
            {featured.map((p) => (
              <StaggerItem key={p.slug}>
                <ProductCard
                  product={p}
                  catLabel={resolveCatLabel(categories, p.cat)}
                />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </MobileRail>
      </section>

      <CapabilityEditorial />

      <ConfigureTeaser />

      <HomeImageBand />

      {/* Recent work */}
      <section className="co-shell co-section-lg">
        <SectionHeading
          eyebrow="Recent work"
          title="Floors we've finished."
          linkHref="/projects"
          linkLabel="All projects"
        />
        <MobileRail total={Math.min(projects.length, 3)} label="Recent work">
          <StaggerContainer className="flex gap-5 [&>*]:w-[78vw] [&>*]:shrink-0 [&>*]:snap-start sm:grid sm:grid-cols-2 sm:gap-x-[clamp(20px,2.6vw,48px)] sm:gap-y-[clamp(34px,4vw,60px)] sm:[&>*]:w-auto lg:grid-cols-3">
            {projects.slice(0, 3).map((pr) => (
            <StaggerItem key={pr.slug}>
              <Link href="/projects" className="group block text-co-ink">
                <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
                  <Image
                    src={pr.images[0]}
                    alt={`${pr.name} — completed fit-out`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover transition-transform duration-[900ms] ease-[var(--ease-co)] group-hover:scale-[1.05]"
                  />
                </div>
                <span
                  aria-hidden
                  className="mt-[clamp(12px,1.4vw,18px)] block h-px w-full bg-co-border transition-colors duration-500 group-hover:bg-co-ink"
                />
                {pr.city ? <p className="co-eyebrow mb-2.5 mt-4">{pr.city}</p> : <div className="mt-4" />}
                <h3 className="mb-2 font-display text-[clamp(17px,1.5vw,20px)] font-medium leading-tight tracking-[-0.026em]">
                  {pr.name}
                </h3>
                <p className="line-clamp-2 text-[13.5px] font-light leading-relaxed text-co-muted">
                  {pr.delivered}
                </p>
              </Link>
            </StaggerItem>
            ))}
          </StaggerContainer>
        </MobileRail>
      </section>

      {/* What we do */}
      <section className="border-t border-co-border">
        <div className="co-shell co-section grid grid-cols-1 gap-x-[clamp(28px,4vw,88px)] gap-y-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal className="lg:sticky lg:top-[clamp(110px,12vw,160px)] lg:self-start">
            <p className="co-eyebrow mb-4">What we do</p>
            <h2 className="co-h2 mb-6 max-w-[18ch]">
              <TextReveal>Not just the furniture. The whole fit-out.</TextReveal>
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
                  className="font-display text-[clamp(22px,2.4vw,32px)] font-normal leading-none tracking-[-0.04em] tabular-nums text-co-border-strong transition-colors duration-300 group-hover:text-co-ink"
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
