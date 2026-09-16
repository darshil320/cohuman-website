import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/common/cta-band";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { MeasureRule } from "@/components/ui/measure-rule";
import { SpecLabel } from "@/components/ui/spec-label";
import { TickRail } from "@/components/ui/tick-rail";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { sitePhotos } from "@/lib/photos";
import { publicFileExists } from "@/lib/public-assets";
import { siteConfig, telHref } from "@/lib/site-config";

const DESCRIPTION =
  "Cohuman designs and manufactures modular office furniture in Surat — metal bases cut in-house on European machinery, systems specified to the millimetre, drawings issued before anything ships.";

export const metadata: Metadata = {
  title: "About",
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { title: "About", description: DESCRIPTION, url: "/about" },
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

export default function AboutPage() {
  // Rendered from whatever photography is actually in `public/` — drop the files in and
  // the section appears, with no code change and no broken image while we wait.
  const suratPhotos = siteConfig.suratPhotos.filter((photo) => publicFileExists(photo.src));

  return (
    <div>
      {/*
        §0 Datum.

        Text on a solid ground, so the LCP element is the headline and there is no image
        to fetch before the page means something. `KineticHeading` animates transform
        only, so those words are painted and measurable on the first frame.
      */}
      <section className="relative flex min-h-[78svh] flex-col justify-between overflow-hidden bg-co-panel text-co-panel-fg sm:min-h-[86svh]">
        <TickRail axis="x" className="absolute inset-x-0 top-0" />
        <TickRail axis="y" className="absolute inset-y-0 left-0" />

        <div className="co-shell relative flex flex-1 flex-col justify-center py-[clamp(72px,12vh,140px)]">
          <SpecLabel tone="dark" rule className="mb-[clamp(20px,3vw,34px)]">
            CO—001 · Surat, Gujarat
          </SpecLabel>

          <h1 className="co-display max-w-[15ch] text-co-panel-fg">
            <KineticHeading>Furniture measured, not guessed.</KineticHeading>
          </h1>

          <p className="co-lead mt-[clamp(24px,3vw,40px)] max-w-[46ch] text-co-panel-muted">
            Cohuman designs and manufactures modular office furniture in Surat — metal bases cut
            in-house, systems specified to the millimetre, drawings issued before anything ships.
          </p>
        </div>

        <div className="co-shell relative border-t border-co-panel-border">
          <dl className="grid grid-cols-2 sm:grid-cols-4">
            {DATUM.map((d) => (
              <div
                key={d.k}
                className="border-co-panel-border py-[clamp(18px,2.2vw,28px)] pr-6 [&:nth-child(-n+2)]:border-b sm:[&:nth-child(-n+2)]:border-b-0"
              >
                <dt className="font-mono text-[10.5px] uppercase tracking-[0.22em] text-co-panel-faint">
                  {d.k}
                </dt>
                <dd className="mt-2.5 font-display text-[clamp(16px,1.6vw,21px)] font-medium tracking-[-0.026em] text-co-panel-fg">
                  {d.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* §1 Definition — the name read as a spec entry. */}
      <section className="border-b border-co-border">
        <div className="co-shell co-section-lg grid gap-x-[clamp(28px,5vw,96px)] gap-y-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          <Reveal className="lg:sticky lg:top-[clamp(110px,12vw,160px)] lg:self-start">
            <SpecLabel rule className="mb-6">
              §01 — Definition
            </SpecLabel>
            <h2 className="co-h1">
              <KineticHeading>Co·human</KineticHeading>
            </h2>
            <p className="mt-4 font-mono text-[12px] tracking-[0.06em] text-co-placeholder">
              /kəʊˈhjuːmən/ · noun
            </p>
          </Reveal>

          <StaggerContainer className="grid">
            {DEFINITION.map((row) => (
              <StaggerItem
                key={row.morpheme}
                className="grid grid-cols-1 gap-x-[clamp(16px,2.5vw,40px)] gap-y-2.5 border-t border-co-border py-[clamp(20px,2.6vw,34px)] last:border-b sm:grid-cols-[minmax(0,7rem)_1fr]"
              >
                <h3 className="co-h3">{row.morpheme}</h3>
                <p className="max-w-[46ch] text-[14.5px] font-light leading-relaxed text-co-muted">
                  {row.gloss}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/*
        §2 Tolerance — the centrepiece.

        Was a four-up of bordered cards, which is the most conventional layout on the
        internet and reads as a template. A sticky thesis beside a ledger of hairline rows
        is both more editorial and better on a phone, where four cards become four boxes.
      */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="co-shell co-section-lg grid gap-x-[clamp(32px,5vw,88px)] gap-y-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Reveal className="lg:sticky lg:top-[clamp(110px,12vw,160px)] lg:self-start">
            <SpecLabel rule className="mb-6">
              §02 — Capability
            </SpecLabel>
            <h2 className="co-h1 max-w-[13ch]">
              <KineticHeading>The base is where furniture is won or lost.</KineticHeading>
            </h2>
            <p className="co-lead mt-6 max-w-[38ch]">
              Most furniture makers buy the metal base in. We cut and form ours, which is the
              only reason a modular system still lines up on the seventeenth bay.
            </p>
          </Reveal>

          <StaggerContainer as="ol" className="grid">
            {CAPABILITIES.map((c) => (
              <StaggerItem
                as="li"
                key={c.code}
                className="group grid grid-cols-1 gap-x-[clamp(16px,2.4vw,36px)] gap-y-3 border-t border-co-border py-[clamp(24px,3.2vw,44px)] last:border-b sm:grid-cols-[minmax(0,8rem)_1fr]"
              >
                <span
                  aria-hidden
                  className="font-mono text-[10.5px] uppercase tracking-[0.16em] tabular-nums text-co-placeholder transition-colors duration-500 group-hover:text-co-ink"
                >
                  {c.code}
                </span>
                <div className="min-w-0">
                  <h3 className="co-h3 mb-3">{c.name}</h3>
                  <p className="max-w-[48ch] text-[14.5px] font-light leading-relaxed text-co-muted">
                    {c.blurb}
                  </p>
                  <MeasureRule className="mt-[clamp(18px,2.2vw,28px)] max-w-[220px]" />
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* §3 Field — one full-bleed photograph, wiped open. */}
      <section className="relative border-b border-co-border">
        <ClipReveal className="aspect-[16/9] max-h-[78svh] w-full bg-co-hero-bg lg:aspect-[21/9]">
          <Image
            src={sitePhotos.heroOpenPlan}
            alt="Open-plan bench desking installed on a finished floor"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </ClipReveal>
        <div className="co-shell relative -mt-[clamp(32px,5vw,72px)] pb-[clamp(28px,4vw,56px)]">
          <div className="ml-auto max-w-[36ch] bg-co-bg p-[clamp(20px,2.6vw,34px)]">
            <SpecLabel className="mb-3.5">Fig. 01 — installed</SpecLabel>
            <p className="text-[14.5px] font-light leading-relaxed text-co-muted">
              Precision is not a drawing-board virtue. It is whether the twelfth desk meets the
              wall the way the first one did.
            </p>
          </div>
        </div>
      </section>

      {/*
        §4 Standard.

        Same four principles as before, promoted from `text-xl` cards to full-width rows at
        heading scale. The words did not change; the presence did — which is the whole
        compensation for a page that no longer has a history to recite.
      */}
      <section className="bg-co-panel">
        <div className="co-shell co-section-lg">
          <Reveal>
            <SpecLabel tone="dark" rule className="mb-6">
              §03 — Standard
            </SpecLabel>
            <h2 className="co-h1 mb-[clamp(36px,5vw,80px)] max-w-[16ch] text-co-panel-fg">
              <KineticHeading>What we hold ourselves to.</KineticHeading>
            </h2>
          </Reveal>

          <StaggerContainer as="ol" className="grid">
            {PRINCIPLES.map((p, i) => (
              <StaggerItem
                as="li"
                key={p.name}
                className="grid grid-cols-[auto_1fr] items-baseline gap-x-[clamp(16px,3vw,52px)] gap-y-3 border-t border-co-panel-border py-[clamp(26px,3.6vw,52px)] last:border-b lg:grid-cols-[auto_minmax(0,0.9fr)_minmax(0,1.1fr)]"
              >
                <span
                  aria-hidden
                  className="font-mono text-[10.5px] tabular-nums tracking-[0.16em] text-co-panel-faint"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="co-h2 text-co-panel-fg">{p.name}</h3>
                <p className="col-start-2 max-w-[44ch] text-[15px] font-light leading-relaxed text-co-panel-muted lg:col-start-3 lg:mt-0">
                  {p.blurb}
                </p>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* §5 Where — offices, then the showroom if its photography exists. */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="co-shell co-section-lg">
          <Reveal>
            <SpecLabel rule className="mb-6">
              §04 — Where
            </SpecLabel>
            <h2 className="co-h1 mb-4 max-w-[16ch]">
              <KineticHeading>Where we work from.</KineticHeading>
            </h2>
            <p className="co-lead mb-[clamp(28px,3.5vw,52px)] max-w-[44ch]">
              Each office has a person, not a queue. Ask for them by name.
            </p>
          </Reveal>

          <StaggerContainer className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-3">
            {siteConfig.offices.map((office) => (
              <StaggerItem
                key={office.city}
                className="flex h-full flex-col bg-co-bg p-[clamp(24px,3vw,32px)]"
              >
                <SpecLabel className="mb-3.5">{office.state}</SpecLabel>
                <p className="mb-3 font-display text-[clamp(21px,2vw,28px)] font-medium tracking-[-0.03em] text-co-ink">
                  {office.city}
                </p>
                <p className="mb-5 text-[14.5px] font-light leading-relaxed text-co-ink-soft">
                  {office.role}
                </p>

                {office.contact ? (
                  <div className="mt-auto border-t border-co-card-border pt-3.5">
                    <p className="text-[14.5px] font-medium text-co-ink">{office.contact.name}</p>
                    <p className="text-[12.5px] font-light text-co-faint">{office.contact.title}</p>
                    {/* Rendered only where a number exists — see `offices` in site-config. */}
                    {office.phoneDisplay && office.phoneE164 ? (
                      <a
                        href={telHref(office.phoneE164)}
                        className="mt-1.5 inline-block text-[13.5px] font-light text-co-ink-soft underline-offset-4 hover:text-co-ink hover:underline"
                      >
                        {office.phoneDisplay}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </StaggerItem>
            ))}
          </StaggerContainer>

          {suratPhotos.length ? (
            <div className="mt-[clamp(44px,5.5vw,88px)]">
              <Reveal className="mb-[clamp(20px,2.6vw,36px)]">
                <SpecLabel className="mb-3.5">The showroom</SpecLabel>
                <h3 className="co-h3 max-w-[34ch]">
                  Hazira Road, Surat. Come and sit on it before you specify it.
                </h3>
              </Reveal>
              <StaggerContainer
                className={
                  suratPhotos.length > 1 ? "grid grid-cols-1 gap-3.5 sm:grid-cols-2" : "grid grid-cols-1"
                }
              >
                {suratPhotos.map((photo) => (
                  <StaggerItem key={photo.src}>
                    <div className="relative aspect-[16/9] overflow-hidden bg-co-hero-bg">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 640px) 45vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <p className="mt-3.5 text-[12.5px] font-light text-co-muted">{photo.caption}</p>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          ) : null}
        </div>
      </section>

      {/* Light close: the footer is already near-black, so a dark CTA would merge into it. */}
      <CtaBand
        tone="light"
        heading="Send a floor plan. Get it back as a drawing."
        body={`A specifier will come back with test-fits, a component schedule and a costed proposal — usually inside ${siteConfig.enquiryTurnaround}.`}
        subject="About page enquiry"
      />
    </div>
  );
}
