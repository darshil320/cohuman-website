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
  "Cohuman designs and manufactures modular office furniture in Surat — metal bases cut in-house on European machinery, systems specified to the millimetre, drawings issued before anything ships.";

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
  { k: "Method", v: "In-house metal" },
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
 * Manufacturing capability — the centrepiece.
 *
 * These four survive from the previous page unchanged; only the presentation moved, from
 * a four-up of bordered cards to a ledger of hairline rows. The codes are display
 * indexing rather than real part numbers, which is why they are `aria-hidden` below.
 */
const CAPABILITIES = [
  {
    code: "CH·01 BASE",
    name: "Metal bases, cutting-edge technology",
    blurb:
      "Advanced European machinery producing precision metal bases ourselves — the one component most furniture makers still outsource.",
  },
  {
    code: "CH·02 MOD",
    name: "Modular by design",
    blurb:
      "High-accuracy fabrication behind truly modular systems — flexible to lay out, easy to reconfigure, clean to install.",
  },
  {
    code: "CH·03 DWG",
    name: "Drawings before deliveries",
    blurb:
      "Technical drawings and software-backed specifications for architects and facility teams, from concept through to execution.",
  },
  {
    code: "CH·04 FIN",
    name: "A finish for every brief",
    blurb:
      "An extensive range of metal finishes and colour palettes, so a spec can match a brand without giving up durability.",
  },
];

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
            <KineticHeading>Furniture measured, not guessed.</KineticHeading>
          </h1>
          <p className="co-lead mt-[clamp(24px,3vw,40px)] max-w-[46ch]">
            Cohuman designs and manufactures modular office furniture in Surat — metal bases cut
            in-house, systems specified to the millimetre, drawings issued before anything ships.
          </p>

          <dl className="mt-[clamp(48px,6vw,88px)] grid grid-cols-2 border-t border-co-ink sm:grid-cols-4">
            {DATUM.map((d, i) => (
              <div
                key={d.k}
                className={`border-co-border py-4 pr-6 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0 ${i > 0 ? "sm:border-l sm:pl-6" : ""}`}
              >
                <dt className="co-eyebrow">{d.k}</dt>
                <dd className="mt-2 font-display text-[clamp(16px,1.6vw,22px)] font-semibold leading-none tracking-[-0.02em]">
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

      {/* Capability — the centrepiece, as a parts list. */}
      <section className="border-y border-co-ink bg-co-bg-alt">
        <div className="co-shell co-section">
          <SectionHeading
            eyebrow={next("Capability")}
            title="The base is where furniture is won or lost."
            blurb="Most furniture makers buy the metal base in. We cut and form ours, which is the only reason a modular system still lines up on the seventeenth bay."
            className="mb-0"
          />
          <StaggerContainer as="ol" className="grid">
            {CAPABILITIES.map((c) => (
              <StaggerItem
                as="li"
                key={c.code}
                className="grid grid-cols-1 gap-x-[clamp(20px,2.5vw,40px)] gap-y-3 border-b border-co-border py-[clamp(22px,2.8vw,40px)] lg:grid-cols-[200px_minmax(0,1fr)_minmax(0,420px)]"
              >
                <span aria-hidden className="co-data text-co-muted-2">
                  {c.code}
                </span>
                <h3 className="co-h3">{c.name}</h3>
                <div>
                  <p className="max-w-[48ch] text-[15px] leading-[1.55] text-co-ink-soft">{c.blurb}</p>
                </div>
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
              className="co-highkey object-cover"
            />
          </ClipReveal>
          <div className="mt-4 grid gap-x-10 gap-y-3 md:grid-cols-[1fr_minmax(0,420px)]">
            <FigureCaption n={++figure}>Installed — open-plan bench desking</FigureCaption>
            <p className="max-w-[46ch] text-[15px] leading-[1.55] text-co-ink-soft">
              Precision is not a drawing-board virtue. It is whether the twelfth desk meets the
              wall the way the first one did.
            </p>
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
                          className="co-highkey object-cover"
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
