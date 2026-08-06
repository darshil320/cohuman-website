import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/common/hero-carousel";
import { AnimatedStat } from "@/components/about/animated-stat";
import { MobileRail } from "@/components/common/mobile-rail";
import { SectionHeading } from "@/components/common/section-heading";
import { CtaBand } from "@/components/common/cta-band";
import { BrandMarquee } from "@/components/common/brand-marquee";
import { CollectionCard } from "@/components/catalog/collection-card";
import { ProductCard } from "@/components/catalog/product-card";
import { brandLogos } from "@/lib/brand-logos";
import { catalog } from "@/lib/catalog";
import { resolveCatLabel } from "@/lib/catalog/resolve";
import { HEADER_HEIGHT } from "@/lib/layout";
import { siteConfig } from "@/lib/site-config";
import { sitePhotos } from "@/lib/photos";
import { OrgatecBanner } from "@/components/home/orgatec-banner";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

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
    src: "/hero-3.png",
    alt: "Open-plan bench desking with task chairs and a city skyline beyond",
    // The benching is dead centre in this shot, so the crop is pulled toward the left of
    // the source, which pushes the desks right and away from the copy. A third line of
    // headline would have reached them regardless — the sub-line carries the rest.
    objectPosition: "22% center",
    headline: ["Height adjustable", "workstations"],
    sub: "Bench desking that raises and lowers, specified to the millimetre and quoted off a component schedule.",
    linkLabel: "Height Adjustable Table",
    linkHref: "/collections/stretchs",
  },
  {
    src: "/hero-2.png",
    alt: "Executive desk and credenza in a corner office overlooking the city",
    // Desk and both figures already sit right of centre; this holds them there.
    objectPosition: "58% center",
    headline: ["The cabin,", "quoted as one room"],
    sub: "Desk, credenza, storage and seating on a single schedule, in one finish, installed in one visit.",
    linkLabel: "Executive Suites",
    linkHref: "/sectors/executive",
  },
  {
    src: "/hero-1.png",
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

/** `n` counts up when the strip scrolls into view; the rest render as written. */
const STATS = [
  { v: String(siteConfig.foundedYear), k: "Furniture Concepts founded, Surat" },
  { n: 37, suffix: " yrs", v: "37 yrs", k: "Designing and making workplaces" },
  { n: 6, v: "6", k: "Product families in production" },
  { v: "~2 days", k: `Typical quote turnaround (${siteConfig.enquiryTurnaround})` },
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


      {/* Stats */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <StaggerContainer className="mx-auto grid max-w-[1320px] grid-cols-2 px-[18px] sm:px-6 lg:grid-cols-4 lg:px-11">
          {STATS.map((s) => (
            <StaggerItem
              key={s.k}
              className="border-co-border py-[clamp(26px,3vw,38px)] px-6 first:pl-0 last:pr-0 [&:not(:last-child)]:border-r"
            >
              {s.n ? (
                <AnimatedStat value={s.n} suffix={s.suffix} label={s.k} tone="page" />
              ) : (
                <>
                  <p className="mb-1.5 whitespace-nowrap font-display text-[clamp(30px,3.2vw,42px)] font-medium leading-none tracking-tight">
                    {s.v}
                  </p>
                  <p className="text-[13.5px] leading-snug text-co-muted-2">{s.k}</p>
                </>
              )}
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Brands represented */}
      <section className="border-b border-co-border bg-co-panel">
        <div className="mx-auto max-w-[1320px] px-[18px] pt-[clamp(28px,3.5vw,40px)] sm:px-6 lg:px-11">
          <p className="mb-6 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green-light">
            Brands we&apos;ve represented
          </p>
        </div>
        <BrandMarquee brands={brandLogos} />
        <div className="h-[clamp(28px,3.5vw,40px)]" />
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
        <SectionHeading
          eyebrow="Collections"
          title="Two desking systems, specified to the millimetre."
          linkHref="/collections"
          linkLabel="All collections"
        />
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {collections.map((c) => (
            <StaggerItem key={c.slug}>
              <CollectionCard collection={c} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Furnish by space */}
      <section className="bg-co-panel text-co-panel-fg">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
          <Reveal>
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green-light">
              Furnish by space
            </p>
            <h2 className="mb-[clamp(34px,4vw,52px)] max-w-[24ch] font-display text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.05] tracking-tight">
              <TextReveal>Tell us the room. We&apos;ll tell you what goes in it.</TextReveal>
            </h2>
          </Reveal>
          <StaggerContainer className="grid grid-cols-1 gap-px border border-co-panel-border bg-co-panel-border sm:grid-cols-2 lg:grid-cols-4">
            {spaces.map((sp) => (
              <StaggerItem key={sp.slug} className="block min-h-[220px] bg-co-panel h-full">
                <Link
                  href="/solutions"
                  className="block h-full w-full p-[clamp(22px,2.4vw,30px)] py-[clamp(26px,3vw,36px)] text-co-panel-fg hover:bg-[#232D22]"
                >
                  <p className="font-display text-[13px] font-semibold tracking-wide text-co-green">
                    {sp.num}
                  </p>
                  <h3 className="mb-2.5 mt-6 font-display text-[24px] font-medium tracking-tight">
                    {sp.name}
                  </h3>
                  <p className="text-[14.5px] font-light leading-relaxed text-co-panel-muted">
                    {sp.blurb}
                  </p>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Signature pieces */}
      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
        <SectionHeading
          eyebrow="Signature pieces"
          title="The ones we get asked for."
          linkHref="/catalog"
          linkLabel="Full catalog"
        />
        {/* One swipe apart on a phone, a three-up grid from `sm`. */}
        <MobileRail total={featured.length} label="Signature pieces">
          <StaggerContainer className="flex gap-3 [&>*]:w-[78vw] [&>*]:shrink-0 [&>*]:snap-start sm:grid sm:gap-4 sm:[&>*]:w-auto sm:grid-cols-2 lg:grid-cols-3">
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

      {/* What we do */}
      <section className="border-b border-t border-co-border bg-co-bg-alt">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-[18px] py-[clamp(64px,8vw,100px)] sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-11">
          <Reveal>
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
              What we do
            </p>
            <h2 className="mb-[18px] max-w-[20ch] font-display text-[clamp(28px,3.6vw,44px)] font-medium leading-[1.06] tracking-tight">
              <TextReveal>Not just the furniture. The whole fit-out.</TextReveal>
            </h2>
            <p className="mb-[26px] max-w-[44ch] text-[16.5px] font-light leading-relaxed text-co-muted">
              Most clients come to us with a floor plate and a headcount. We take it from there
              — layout, specification, manufacture, install, and a service contract that keeps
              it all working.
            </p>
            <Link
              href="/services"
              className="border-b-[1.5px] border-co-green pb-0.5 text-[15px] font-semibold text-co-ink hover:text-co-green"
            >
              Our services →
            </Link>
          </Reveal>
          <StaggerContainer className="grid gap-px border border-co-border bg-co-border">
            {services.map((sv) => (
              <StaggerItem key={sv.num} className="flex gap-[18px] bg-co-bg p-[22px]">
                <span className="shrink-0 font-display text-xs font-semibold tracking-wide text-co-green">
                  {sv.num}
                </span>
                <div>
                  <h3 className="mb-1 font-display text-[18px] font-medium tracking-tight">
                    {sv.name}
                  </h3>
                  <p className="text-sm font-light leading-relaxed text-co-muted-2">
                    {sv.blurb}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Recent work */}
      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
        <SectionHeading
          eyebrow="Recent work"
          title="Floors we've finished."
          linkHref="/projects"
          linkLabel="All projects"
        />
        <MobileRail total={Math.min(projects.length, 3)} label="Recent work">
          <StaggerContainer className="flex gap-3 [&>*]:w-[78vw] [&>*]:shrink-0 [&>*]:snap-start sm:grid sm:gap-4 sm:[&>*]:w-auto sm:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 3).map((pr) => (
            <StaggerItem key={pr.slug}>
              <Link href="/projects" className="group block text-co-ink">
                <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
                  <Image
                    src={pr.images[0]}
                    alt={`${pr.name} — completed fit-out`}
                    fill
                    sizes="(min-width: 1024px) 30vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {pr.city ? (
                  <p className="mb-1 mt-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-co-faint">
                    {pr.city}
                  </p>
                ) : (
                  <div className="mt-3.5" />
                )}
                <h3 className="mb-1.5 font-display text-[20px] font-medium tracking-tight">
                  {pr.name}
                </h3>
                <p className="line-clamp-2 text-sm font-light text-co-muted-2">{pr.delivered}</p>
              </Link>
            </StaggerItem>
            ))}
          </StaggerContainer>
        </MobileRail>
      </section>

      <CtaBand
        heading="Send us your floor plan. Get a costed proposal."
        body={`No obligation, no cart, no checkout — a real specification from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
