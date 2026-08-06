import Image from "next/image";
import Link from "next/link";
import { HeroCarousel } from "@/components/common/hero-carousel";
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

const HERO_SLIDES = [
  { 
    src: "/hero-3.png", 
    alt: "Height Adjustable Workstations",
    linkLabel: "Height Adjustable Table",
    linkHref: "/collections/stretchs"
  },
  { 
    src: "/hero-2.png", 
    alt: "Executive desk with a view of the city skyline",
    linkLabel: "Executive Suites",
    linkHref: "/collections"
  },
  { 
    src: "/hero-1.png", 
    alt: "Spacious executive office with a meeting area",
    linkLabel: "Open Plan Benching",
    linkHref: "/collections"
  },
];

const STATS = [
  { v: String(siteConfig.foundedYear), k: "Furniture Concepts founded, Surat" },
  { v: "37 yrs", k: "Designing and making workplaces" },
  { v: "6", k: "Product families in production" },
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
        <HeroCarousel
          slides={HERO_SLIDES}
          className="h-[calc(100vh-20px)] min-h-[540px] max-h-[760px]"
        >
          <div className="mx-auto flex h-full max-w-[1320px] flex-col justify-center px-[18px] pb-[10vh] sm:px-6 lg:px-11">
            {/*
              Hero type is set three steps quieter than it was: 3.1vw rather than 5.5vw,
              semibold rather than bold, and −0.028em of tracking, because a display face
              set this large reads too loose at its default fit. The soft shadow replaces
              `drop-shadow-lg`, which was thick enough to furr the edges of the glyphs on
              the lighter slides.
            */}
            {/*
              Wide enough that the headline breaks only where the `<br />`s put it: a
              character-width cap re-wrapped "Workstations for" and turned three lines
              into five.
            */}
            <div className="flex max-w-[640px] flex-col gap-[clamp(18px,2vw,28px)]">
              <h1 className="font-display text-[clamp(32px,3.1vw,48px)] font-semibold leading-[1.08] tracking-[-0.028em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)]">
                <TextReveal>
                  Height Adjustable
                  <br />
                  Workstations for
                  <br />
                  Modern Offices
                </TextReveal>
              </h1>
              <p className="max-w-[40ch] text-[clamp(14.5px,1.2vw,17px)] font-normal leading-relaxed tracking-[0.002em] text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
                Modular office furniture,
                <br />
                manufactured for enterprise scale
              </p>
            </div>
          </div>
        </HeroCarousel>
      </section>


      {/* Stats */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <StaggerContainer className="mx-auto grid max-w-[1320px] grid-cols-2 px-[18px] sm:px-6 lg:grid-cols-4 lg:px-11">
          {STATS.map((s) => (
            <StaggerItem
              key={s.k}
              className="border-co-border py-[clamp(26px,3vw,38px)] px-6 first:pl-0 last:pr-0 [&:not(:last-child)]:border-r"
            >
              <p className="mb-1.5 whitespace-nowrap font-display text-[clamp(30px,3.2vw,42px)] font-medium leading-none tracking-tight">
                {s.v}
              </p>
              <p className="text-[13.5px] leading-snug text-co-muted-2">{s.k}</p>
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
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <StaggerItem key={p.slug}>
              <ProductCard
                product={p}
                catLabel={resolveCatLabel(categories, p.cat)}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
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
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
      </section>

      <CtaBand
        heading="Send us your floor plan. Get a costed proposal."
        body={`No obligation, no cart, no checkout — a real specification from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
