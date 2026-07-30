import Link from "next/link";
import { HeroCarousel } from "@/components/common/hero-carousel";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { SectionHeading } from "@/components/common/section-heading";
import { CtaBand } from "@/components/common/cta-band";
import { CollectionCard } from "@/components/catalog/collection-card";
import { ProductCard } from "@/components/catalog/product-card";
import { HEADER_HEIGHT } from "@/components/layout/site-header";
import { catalog } from "@/lib/catalog";
import { resolveCatLabel, resolveColName } from "@/lib/catalog/resolve";
import { siteConfig } from "@/lib/site-config";
import { projectPhoto, stockPhotos } from "@/lib/stock-photos";

const FEATURED_SLUGS = [
  "aria-task",
  "loom-linear",
  "meridian-executive",
  "parlour-sofa",
  "assembly-conference",
  "stack-storage-wall",
];

const HERO_SLIDES = [
  { src: stockPhotos.heroDeskClean, alt: "Bright, clean Cohuman workspace desk" },
  { src: stockPhotos.openOfficeDesks, alt: "Row of ergonomic desks and chairs in an open office" },
  { src: stockPhotos.conferenceTable, alt: "Boardroom conference table with floor-to-ceiling windows" },
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
          <div className="mx-auto flex h-full max-w-[1320px] flex-col justify-start px-[18px] pb-20 pt-[145px] sm:px-6 sm:pt-[155px] lg:px-11 lg:pt-[165px]">
            <div className="flex max-w-[560px] flex-col gap-6">
              <p className="animate-co-fade text-xs font-semibold uppercase tracking-[0.22em] text-[#a6d85b]">
                Cohuman · Surat · Since {siteConfig.foundedYear}
              </p>
              <h1 className="animate-co-rise max-w-[13ch] font-display text-[clamp(38px,4.4vw,60px)] font-medium leading-[1.03] tracking-tight text-white">
                Offices built around the people in them.
              </h1>
              <p className="max-w-[46ch] text-[16.5px] font-light leading-relaxed text-white/80">
                Thirty-seven years of making chairs, desks and rooms that people actually want to
                sit in. We plan the space, build the furniture, install it, and look after it
                afterwards.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/contact"
                  className="rounded-md bg-[#6fa82b] px-[26px] py-[14px] text-[15px] font-semibold text-[#0d140e] shadow-[0_0_15px_rgba(111,168,43,0.3)] transition-all hover:bg-[#80bc33]"
                >
                  Request a Quote
                </Link>
                <Link
                  href="/catalog"
                  className="rounded-md border border-white/30 bg-white/10 px-[25px] py-3.5 text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
                >
                  Browse the catalog
                </Link>
              </div>
            </div>
          </div>
        </HeroCarousel>
      </section>


      {/* Stats */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 px-[18px] sm:px-6 lg:grid-cols-4 lg:px-11">
          {STATS.map((s) => (
            <div
              key={s.k}
              className="border-co-border py-[clamp(26px,3vw,38px)] px-6 first:pl-0 last:pr-0 [&:not(:last-child)]:border-r"
            >
              <p className="mb-1.5 whitespace-nowrap font-display text-[clamp(30px,3.2vw,42px)] font-medium leading-none tracking-tight">
                {s.v}
              </p>
              <p className="text-[13.5px] leading-snug text-co-muted-2">{s.k}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Collections */}
      <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
        <SectionHeading
          eyebrow="Collections"
          title="Four families. One coherent floor."
          linkHref="/collections"
          linkLabel="All collections"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((c) => (
            <CollectionCard key={c.slug} collection={c} />
          ))}
        </div>
      </section>

      {/* Furnish by space */}
      <section className="bg-co-panel text-co-panel-fg">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(64px,8vw,108px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green-light">
            Furnish by space
          </p>
          <h2 className="mb-[clamp(34px,4vw,52px)] max-w-[24ch] font-display text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.05] tracking-tight">
            Tell us the room. We&apos;ll tell you what goes in it.
          </h2>
          <div className="grid grid-cols-1 gap-px border border-co-panel-border bg-co-panel-border sm:grid-cols-2 lg:grid-cols-4">
            {spaces.map((sp) => (
              <Link
                key={sp.slug}
                href="/solutions"
                className="block min-h-[220px] bg-co-panel p-[clamp(22px,2.4vw,30px)] py-[clamp(26px,3vw,36px)] text-co-panel-fg hover:bg-[#232D22]"
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
            ))}
          </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
              catLabel={resolveCatLabel(categories, p.cat)}
              colName={resolveColName(collections, p.col)}
            />
          ))}
        </div>
      </section>

      {/* What we do */}
      <section className="border-b border-t border-co-border bg-co-bg-alt">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-8 px-[18px] py-[clamp(64px,8vw,100px)] sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-11">
          <div>
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
              What we do
            </p>
            <h2 className="mb-[18px] max-w-[20ch] font-display text-[clamp(28px,3.6vw,44px)] font-medium leading-[1.06] tracking-tight">
              Not just the furniture. The whole fit-out.
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
          </div>
          <div className="grid gap-px border border-co-border bg-co-border">
            {services.map((sv) => (
              <div key={sv.num} className="flex gap-[18px] bg-co-bg p-[22px]">
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
              </div>
            ))}
          </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 3).map((pr) => (
            <Link key={pr.slug} href="/projects" className="group block text-co-ink">
              <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
                <ImagePlaceholder
                  hint={pr.slotHint}
                  alt={pr.name}
                  src={projectPhoto[pr.slug]}
                  className="transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mb-1 mt-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-co-faint">
                {pr.sector}
              </p>
              <h3 className="mb-1.5 font-display text-[20px] font-medium tracking-tight">
                {pr.name}
              </h3>
              <p className="text-sm font-light text-co-muted-2">{pr.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      <CtaBand
        heading="Send us your floor plan. Get a costed proposal."
        body={`No obligation, no cart, no checkout — a real specification from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
