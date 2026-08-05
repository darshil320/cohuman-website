import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
import { CtaBand } from "@/components/common/cta-band";
import { AnimatedStat } from "@/components/about/animated-stat";
import { BrandMarquee } from "@/components/about/brand-marquee";
import { StoryTimeline } from "@/components/about/story-timeline";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "About",
  description:
    "Thirty-seven years of watching how people actually work — the story of Furniture Concepts becoming Cohuman, founded by Tushar Shah in Surat, 1989.",
};

const TIMELINE = [
  { year: "1989", what: "Furniture Concepts opens in Surat. Desks for one accountancy practice on Ring Road." },
  { year: "1998", what: "First full-floor contract. Manufacturing moves into a dedicated workshop." },
  { year: "2009", what: "Seating brought in-house — upholstery, foam and mechanism assembly." },
  { year: "2018", what: "Turnkey fit-out offered as a single contract alongside furniture." },
  { year: "2026", what: "Relaunched as Cohuman: one brand across desking, seating, storage and lounge." },
];

const PRINCIPLES = [
  { name: "Measured off a body", blurb: "Heights, depths and reach distances come from how people sit, not from what is cheapest to cut." },
  { name: "Made, not re-badged", blurb: "We manufacture. Finishes can be matched, sizes changed, and spares still exist in year seven." },
  { name: "Quoted, not listed", blurb: "A price that ignores quantity, finish and installation is a guess. We would rather do the arithmetic." },
  { name: "Fixed, not replaced", blurb: "Re-upholstery, new gas lifts and new castors before a skip. Cheaper for you, better for everyone." },
];

const CAPABILITIES = [
  {
    name: "Metal bases, made in-house",
    blurb:
      "Advanced European machinery producing precision metal bases ourselves — the one component most furniture makers still outsource.",
  },
  {
    name: "Modular by design",
    blurb:
      "High-accuracy fabrication behind truly modular systems — flexible to lay out, easy to reconfigure, clean to install.",
  },
  {
    name: "Drawings before deliveries",
    blurb:
      "Technical drawings and software-backed specifications for architects and facility teams, from concept through to execution.",
  },
  {
    name: "A finish for every brief",
    blurb:
      "An extensive range of metal finishes and colour palettes, so a spec can match a brand without giving up durability.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative border-b border-co-border">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(48px,7vw,96px)] pb-[clamp(56px,7vw,88px)] sm:px-6 lg:px-11">
          <p className="animate-co-fade mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            About · Cohuman
          </p>
          <h1 className="animate-co-rise mb-6 max-w-[18ch] font-display text-[clamp(34px,5.4vw,66px)] font-medium leading-none tracking-tight">
            Thirty-seven years of watching how people actually work.
          </h1>
          <p className="max-w-[44ch] text-[clamp(18px,1.8vw,24px)] font-light leading-[1.45] text-co-ink-soft">
            {siteConfig.founder} started Furniture Concepts in Surat in {siteConfig.foundedYear}
            . Cohuman is what the workshop became.
          </p>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
          <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-co-green" />
        </div>
      </section>

      {/* Origin story, sticky image */}
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[clamp(28px,4vw,68px)] px-[18px] py-[clamp(44px,6vw,80px)] sm:px-6 lg:grid-cols-2 lg:px-11">
        <div className="grid max-w-[62ch] gap-[22px]">
          <p className="text-[clamp(16.5px,1.5vw,19px)] font-light leading-[1.65] text-co-ink-soft">
            The first workshop made desks for one accountancy practice on Ring Road. The brief
            has not changed much since: a surface at the right height, storage that locks, and a
            chair somebody can sit in for eight hours without thinking about it.
          </p>
          <p className="text-[clamp(16.5px,1.5vw,19px)] font-light leading-[1.65] text-co-ink-soft">
            What changed is the scale, and the questions clients bring. Fewer people ask for a
            desk. More ask how many desks fit, whether the floor works for three days a week
            instead of five, and what happens to it all in year seven.
          </p>
          <p className="text-[clamp(16.5px,1.5vw,19px)] font-light leading-[1.65] text-co-ink-soft">
            The Cohuman name is the answer to that. Co- because a workplace is shared before it
            is anything else. Human because the measurements that matter are the ones taken off
            a body, not a floor plan. Same workshop, same family, a wider brief.
          </p>
          <p className="text-[clamp(16.5px,1.5vw,19px)] font-light leading-[1.65] text-co-ink-soft">
            Along the way we have represented and marketed globally renowned names in this
            industry — exposure that set a standard for what &ldquo;quality&rdquo; means before we
            ever apply it to something we make ourselves.
          </p>
        </div>
        <div className="grid gap-3.5 lg:sticky lg:top-[100px] lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden bg-co-hero-bg">
            <ImagePlaceholder hint="Workshop or founder portrait" alt="Cohuman workshop or founder portrait" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
            <ImagePlaceholder hint="Making: joinery or upholstery detail" alt="Joinery or upholstery detail" />
          </div>
        </div>
      </section>

      {/* Stat strip */}
      <section className="bg-co-panel">
        <div className="mx-auto grid max-w-[1320px] grid-cols-2 gap-8 px-[18px] py-[clamp(40px,5vw,60px)] sm:grid-cols-4 sm:px-6 lg:px-11">
          <AnimatedStat value={siteConfig.foundedYear} label="Founded" />
          <AnimatedStat value={2026 - siteConfig.foundedYear} suffix=" yrs" label="In business" />
          <AnimatedStat value={siteConfig.locations.length} label="Cities we work from" />
          <AnimatedStat value={siteConfig.brandsRepresented.length} label="Global brands represented" />
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-[clamp(28px,3.5vw,46px)] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
            A short timeline
          </h2>
          <StoryTimeline items={TIMELINE} />
          <p className="mt-5 text-[13px] font-light text-co-faint">
            Milestone dates to be confirmed with the founder before publication.
          </p>
        </div>
      </section>

      {/* Brand partnerships */}
      <section className="border-t border-co-border bg-co-panel">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-3 max-w-[26ch] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight text-co-panel-fg">
            International standards, close to home.
          </h2>
          <p className="mb-10 max-w-[58ch] text-[15.5px] font-light leading-relaxed text-co-panel-muted">
            Over three decades we have represented and marketed globally renowned brands,
            bringing their manufacturing and design standards into everything we build ourselves.
          </p>
        </div>
        <BrandMarquee brands={siteConfig.brandsRepresented} />
        <div className="h-[clamp(52px,6vw,88px)]" />
      </section>

      {/* Manufacturing capability */}
      <section className="border-t border-co-border">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-3 max-w-[24ch] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
            A game changer in metal bases.
          </h2>
          <p className="mb-[clamp(28px,3.5vw,46px)] max-w-[58ch] text-[15.5px] font-light leading-relaxed text-co-muted">
            Most furniture makers outsource the metal base. We manufacture ours in-house on
            advanced European machinery — which is why the modular systems we build hold their
            precision on-site, not just on a drawing.
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {CAPABILITIES.map((c) => (
              <div
                key={c.name}
                className="border border-co-border p-6 transition-colors hover:border-co-green hover:bg-co-bg-alt"
              >
                <h3 className="mb-2.5 font-display text-lg font-medium tracking-tight text-co-ink">
                  {c.name}
                </h3>
                <p className="text-[14.5px] font-light leading-relaxed text-co-muted">{c.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="border-t border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-[clamp(28px,3.5vw,46px)] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
            Where we work from.
          </h2>
          <div className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-3">
            {siteConfig.locations.map((loc) => (
              <div key={loc.city} className="bg-co-bg p-[clamp(24px,3vw,32px)]">
                <p className="mb-1 font-display text-2xl font-medium tracking-tight text-co-ink">
                  {loc.city}
                </p>
                <p className="mb-3 text-[13px] font-light text-co-faint">{loc.detail}</p>
                <p className="text-[15px] font-light leading-relaxed text-co-ink-soft">{loc.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-co-panel">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-[clamp(28px,3.5vw,44px)] max-w-[22ch] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight text-co-panel-fg">
            What we hold ourselves to.
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-11">
            {PRINCIPLES.map((p) => (
              <div key={p.name}>
                <h3 className="mb-2.5 font-display text-xl font-medium tracking-tight text-co-panel-fg">
                  {p.name}
                </h3>
                <p className="text-[15.5px] font-light leading-relaxed text-co-panel-muted">
                  {p.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        heading="Have a floor plan already?"
        body="Send it over with a headcount — a specifier will come back with test-fits and a costed schedule."
        subject="About page enquiry"
      />
    </div>
  );
}
