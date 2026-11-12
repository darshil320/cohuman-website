import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FounderCard } from "@/components/about/founder-card";
import { CtaBand } from "@/components/common/cta-band";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { HairlineGrid } from "@/components/ui/hairline-grid";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { SpecRows } from "@/components/ui/spec-rows";
import { catalog } from "@/lib/catalog";
import { sitePhotos } from "@/lib/photos";
import { publicFileExists } from "@/lib/public-assets";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { siteConfig, telHref } from "@/lib/site-config";

const DESCRIPTION =
  "Humans make offices. Cohuman designs and makes office furniture in its own factory in Surat: cutting, edge banding, boring, drilling and assembly under one roof.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description: DESCRIPTION, url: "/about", images: [SHARE_IMAGE] },
  twitter: { title: "About", description: DESCRIPTION },
};

/**
 * The four datum cells under the hero.
 *
 * Words, never counts. The page used to open on a strip of figures — founding year, years
 * in business, brands represented — and all of it is gone: Cohuman is presented as a new
 * company, so there is nothing to total up. These carry the same structural rhythm the
 * figures did without making a claim about duration.
 */
const DATUM = [
  { k: "Discipline", v: "Modular" },
  { k: "Method", v: "Own factory" },
  { k: "Output", v: "Specified" },
  { k: "Ground", v: "Surat, IN" },
];

/**
 * The name, read as a specification.
 *
 * The third row is the point of the section: a new company has no back catalogue, and
 * saying so plainly is stronger than working around it. This is the only place on the
 * site the word "founded" appears.
 */
const DEFINITION = [
  {
    morpheme: "Co—",
    gloss: "A workplace is shared before it is anything else. Benches, not desks in rows.",
  },
  {
    morpheme: "—human",
    gloss: "The measurements that matter are the ones taken off a body, not off a floor plan.",
  },
  {
    morpheme: "—new",
    gloss: `Founded by ${siteConfig.founder} in Surat. No back catalogue to defend, no legacy line to protect.`,
  },
];

/**
 * The factory, as the 2026 catalogue shows it (pp. 04–05): six photographs from the
 * Surat floor, captioned with the process each one shows and nothing more.
 */
const FACTORY = [
  { src: "/factory/cnc-routing.jpg", caption: "CNC routing", alt: "A CNC router cutting a pattern into a green panel" },
  { src: "/factory/panel-cutting.jpg", caption: "Panel cutting", alt: "A worker feeding a board into a panel saw" },
  { src: "/factory/edge-banding.jpg", caption: "Edge banding", alt: "A white panel coming out of an edge-banding machine" },
  { src: "/factory/boring.jpg", caption: "Boring", alt: "A line of drill heads boring holes along a panel" },
  { src: "/factory/assembly.jpg", caption: "Assembly", alt: "A worker drilling into a storage carcass during assembly" },
  { src: "/factory/factory-floor.jpg", caption: "The factory floor", alt: "The factory floor under a curved roof, with workbenches and stacked panels" },
] as const;

const PRINCIPLES = [
  {
    name: "Measured off a body",
    blurb: "Heights, depths and reach distances come from how people sit, not from what is cheapest to cut.",
  },
  {
    name: "Made, not re-badged",
    blurb: "We manufacture. Finishes can be matched, sizes changed, and spares still exist in year seven.",
  },
  {
    name: "Quoted, not listed",
    blurb: "A price that ignores quantity, finish and installation is a guess. We would rather do the arithmetic.",
  },
  {
    name: "Fixed, not replaced",
    blurb: "Re-upholstery, new gas lifts and new castors before a skip. Cheaper for you, better for everyone.",
  },
];

/**
 * The founders section's closing line, as supplied by the client. It names both
 * co-founders, so it lives beside the section rather than in founders.json — revisit it
 * if the founders change.
 */
const FOUNDERS_CLOSE =
  "Where Tushar brings depth, Jigar brings momentum, and Cohuman was built to combine the two.";

/** "§01 — Definition": the /about section label, numbered in the order sections render. */
function sectionLabel(n: number, name: string): string {
  return `§${String(n).padStart(2, "0")} — ${name}`;
}

export default async function AboutPage() {
  const founders = await catalog.getFounders();
  // Rendered from whatever photography is actually in `public/` — drop the files in and
  // the section appears, with no code change and no broken image while we wait.
  const suratPhotos = siteConfig.suratPhotos.filter((photo) => publicFileExists(photo.src));

  // Sections are numbered as they render, so the founders section — which appears only
  // once founders.json has entries — never leaves a gap in the count.
  let section = 0;
  const next = (name: string) => sectionLabel(++section, name);
  // Figures run down the page the same way: field photo, founders, showroom.
  let figure = 0;

  return (
    <div>
      {/*
        §0 Datum. Text on the canvas over the hairline grid, so the LCP element is the
        headline and there is no image to fetch before the page means something.
      */}
      <section className="relative overflow-hidden border-b border-co-ink">
        <HairlineGrid />
        <div className="co-shell relative pb-[clamp(48px,6vw,88px)] pt-[clamp(48px,8vw,128px)]">
          <p className="co-eyebrow">CO—001 · Surat, Gujarat</p>
          <h1 className="co-display mt-[clamp(20px,3vw,36px)] max-w-[13ch]">
            <KineticHeading>Humans make offices.</KineticHeading>
          </h1>
          {/* The catalogue's About, verbatim (2026 catalogue p. 02). */}
          <p className="co-lead mt-[clamp(24px,3vw,40px)] max-w-[46ch]">
            Not the computers, the screens or the peripherals. People do the work, and the idea
            of working together starts with them. That is the meaning of our name.
          </p>

          <dl className="mt-[clamp(48px,6vw,88px)] grid grid-cols-2 border-t border-co-ink sm:grid-cols-4">
            {DATUM.map((d, i) => (
              <div
                key={d.k}
                className={`border-co-border py-4 pr-6 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}
              >
                <dt className="co-eyebrow">{d.k}</dt>
                <dd className="mt-2 font-display text-[clamp(16px,1.6vw,22px)] font-semibold leading-[1.2] tracking-[-0.02em]">
                  {d.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Definition — the name read as a spec entry. */}
      <section className="co-shell co-section">
        <SectionHeading
          eyebrow={next("Definition")}
          title="Co·human"
          blurb="/kəʊˈhjuːmən/ · noun"
          className="mb-0"
        />
        <StaggerContainer as="ol" className="grid">
          {DEFINITION.map((row) => (
            <StaggerItem
              as="li"
              key={row.morpheme}
              className="grid grid-cols-1 gap-x-[clamp(20px,2.5vw,40px)] gap-y-2 border-b border-co-border py-[clamp(20px,2.4vw,32px)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,420px)]"
            >
              <span aria-hidden className="hidden lg:block" />
              <h3 className="co-h2">{row.morpheme}</h3>
              <p className="max-w-[46ch] self-end text-[15px] leading-[1.55] text-co-ink-soft">{row.gloss}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Factory — the catalogue's "Made in our own factory." as photographs. */}
      <section className="border-y border-co-ink bg-co-bg-alt">
        <div className="co-shell co-section">
          <SectionHeading
            eyebrow={next("Factory")}
            title="Made in our own factory."
            blurb="A full-fledged factory in Surat: cutting, edge banding, boring, drilling and assembly under one roof."
          />
          <StaggerContainer className="co-rail md:grid md:grid-cols-3 md:gap-6">
            {FACTORY.map((photo) => (
              <StaggerItem key={photo.src}>
                <figure>
                  <ClipReveal className="aspect-[3/4] border border-co-border bg-co-bg">
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 768px) 31vw, 80vw"
                      quality={90}
                      className="object-cover"
                    />
                  </ClipReveal>
                  <figcaption className="co-data mt-3 text-co-ink">{photo.caption}</figcaption>
                </figure>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Field — one photograph, wiped open. */}
      <section className="co-shell co-section">
        <figure className="relative">
          <RegistrationCross className="-left-2 -top-2 z-10 text-co-ink" />
          <RegistrationCross className="-right-2 -top-2 z-10 text-co-ink" />
          <ClipReveal className="aspect-[16/9] max-h-[78svh] w-full border border-co-border bg-co-bg-alt lg:aspect-[21/9]">
            <Image
              src={sitePhotos.heroOpenPlan}
              alt="Open-plan bench desking installed on a finished floor"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </ClipReveal>
          <div className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-[1fr_minmax(0,420px)]">
            <FigureCaption n={++figure}>Installed — open-plan bench desking</FigureCaption>
            {/* The catalogue's About, continued. */}
            <div className="grid max-w-[46ch] gap-3 text-[15px] leading-[1.55] text-co-ink-soft">
              <p>
                Furniture should not be static. A good design can be put to more than one use, and
                the same table can serve a different purpose at a different hour.
              </p>
              <p>
                Our aim is meaning, rather than volume: offices people are happy to come to, where
                arriving at work feels relaxed, not pressured.
              </p>
            </div>
          </div>
        </figure>
      </section>

      {/* Standard — the one ink block on the page above the footer. */}
      <section className="bg-co-panel text-co-panel-fg">
        <div className="co-shell co-section">
          <SectionHeading
            tone="dark"
            eyebrow={next("Standard")}
            title="What we hold ourselves to."
            className="mb-0"
          />
          <StaggerContainer as="ol" className="grid">
            {PRINCIPLES.map((p, i) => (
              <StaggerItem
                as="li"
                key={p.name}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-[clamp(16px,2.5vw,40px)] gap-y-3 border-b border-co-panel-border py-[clamp(24px,3vw,44px)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,420px)]"
              >
                <span aria-hidden className="co-data text-co-panel-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="co-h2 text-co-panel-fg">{p.name}</h3>
                <p className="col-start-2 max-w-[44ch] text-[15px] leading-[1.55] text-co-panel-muted lg:col-start-3">
                  {p.blurb}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/*
        Founders. Data from src/data/founders.json through the catalog repository; the
        section renders only once there is at least one founder to show.
      */}
      {founders.length ? (
        <section id="founders" className="co-shell co-section">
          <SectionHeading
            eyebrow={next("Founders")}
            title="The people who sign the drawings."
            blurb="Ask for them by name — the person who specifies your floor is one of the people who started the company."
          />
          <StaggerContainer className="grid grid-cols-1 gap-x-[clamp(32px,5vw,96px)] gap-y-16 md:grid-cols-2">
            {founders.map((founder) => (
              <StaggerItem key={founder.slug}>
                <FounderCard founder={founder} figure={++figure} />
              </StaggerItem>
            ))}
          </StaggerContainer>
          <Reveal className="mt-[clamp(48px,6vw,88px)] border-t border-co-ink pt-[clamp(24px,3vw,40px)]">
            {/* Eighteen words: set to be read, in the Body cut, not as a wall of capitals. */}
            <p className="max-w-[40ch] text-[clamp(22px,2.2vw,30px)] leading-[1.3] text-co-ink">
              {FOUNDERS_CLOSE}
            </p>
          </Reveal>
        </section>
      ) : null}

      {/* Where — offices, then the showroom if its photography exists. */}
      <section className="border-t border-co-ink bg-co-bg-alt">
        <div className="co-shell co-section">
          <SectionHeading
            eyebrow={next("Where")}
            title="Where we work from."
            blurb="Each office has a person, not a queue. Ask for them by name."
          />

          <StaggerContainer className="grid grid-cols-1 border-l border-t border-co-ink sm:grid-cols-3">
            {siteConfig.offices.map((office) => (
              <StaggerItem key={office.city} className="flex h-full flex-col border-b border-r border-co-ink bg-co-bg p-[clamp(20px,2.4vw,32px)]">
                <p className="co-eyebrow">{office.state}</p>
                <h3 className="co-h3 mt-3">{office.city}</h3>
                <p className="mt-2 text-[15px] leading-[1.55] text-co-ink-soft">{office.role}</p>
                {office.contact ? (
                  <SpecRows
                    className="mt-auto pt-6"
                    rows={[
                      { k: "Contact", v: office.contact.name },
                      { k: "Role", v: office.contact.title },
                      // Rendered only where a number exists — see `offices` in site-config.
                      ...(office.phoneDisplay && office.phoneE164
                        ? [
                            {
                              k: "Phone",
                              v: (
                                <a href={telHref(office.phoneE164)} className="underline-offset-4 hover:underline">
                                  {office.phoneDisplay}
                                </a>
                              ),
                            },
                          ]
                        : []),
                    ]}
                  />
                ) : null}
              </StaggerItem>
            ))}
          </StaggerContainer>

          {suratPhotos.length ? (
            <div className="mt-[clamp(44px,5.5vw,88px)] grid grid-cols-1 items-end gap-x-[clamp(28px,5vw,96px)] gap-y-8 lg:grid-cols-[1.2fr_1fr]">
              <StaggerContainer className={suratPhotos.length > 1 ? "grid grid-cols-1 gap-6 sm:grid-cols-2" : "grid"}>
                {suratPhotos.map((photo) => (
                  <StaggerItem key={photo.src}>
                    <figure>
                      <ClipReveal className="aspect-[16/10] border border-co-border">
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                        />
                      </ClipReveal>
                      <FigureCaption n={++figure} className="mt-3">
                        {photo.caption}
                      </FigureCaption>
                    </figure>
                  </StaggerItem>
                ))}
              </StaggerContainer>
              <Reveal>
                <p className="co-eyebrow">The showroom</p>
                <h3 className="co-h2 mt-4 max-w-[14ch]">Come and sit on it before you specify it.</h3>
                <p className="co-data mt-6">{siteConfig.address.line1}</p>
                <p className="co-data text-co-muted-2">{siteConfig.address.line2}</p>
                <p className="co-data mt-1 text-co-muted-2">{siteConfig.coordinates.label}</p>
                <Button asChild variant="secondary" className="mt-8">
                  <Link href="/contact">Book a showroom visit</Link>
                </Button>
              </Reveal>
            </div>
          ) : null}
        </div>
      </section>

      {/* Light close: the footer is already ink, so a dark CTA would merge into it. */}
      <CtaBand
        tone="light"
        heading="Send a floor plan. Get it back as a drawing."
        body={`A specifier will come back with test-fits, a component schedule and a costed proposal — usually inside ${siteConfig.enquiryTurnaround}.`}
        subject="About page enquiry"
      />
    </div>
  );
}
