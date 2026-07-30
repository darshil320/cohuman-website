import type { Metadata } from "next";
import { ImagePlaceholder } from "@/components/common/image-placeholder";
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

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-co-border">
        <div className="mx-auto max-w-[1000px] px-[18px] py-[clamp(48px,7vw,96px)] pb-[clamp(40px,5vw,64px)] sm:px-6 lg:px-11">
          <p className="mb-4 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            About · Cohuman
          </p>
          <h1 className="mb-6 font-display text-[clamp(34px,5.4vw,66px)] font-medium leading-none tracking-tight">
            Thirty-seven years of watching how people actually work.
          </h1>
          <p className="max-w-[44ch] text-[clamp(18px,1.8vw,24px)] font-light leading-[1.45] text-co-ink-soft">
            {siteConfig.founder} started Furniture Concepts in Surat in {siteConfig.foundedYear}
            . Cohuman is what the workshop became.
          </p>
        </div>
      </section>

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
            We manufacture rather than import and re-badge. That means finishes can be matched,
            spares exist years later, and when a client asks for a desk 40mm narrower to clear a
            column, the answer is usually yes.
          </p>
        </div>
        <div className="grid gap-3.5">
          <div className="relative aspect-[4/5] overflow-hidden bg-co-hero-bg">
            <ImagePlaceholder hint="Workshop or founder portrait" alt="Cohuman workshop or founder portrait" />
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-co-hero-bg">
            <ImagePlaceholder hint="Making: joinery or upholstery detail" alt="Joinery or upholstery detail" />
          </div>
        </div>
      </section>

      <section className="border-t border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,6vw,88px)] sm:px-6 lg:px-11">
          <h2 className="mb-[clamp(28px,3.5vw,46px)] font-display text-[clamp(25px,3vw,40px)] font-medium tracking-tight">
            A short timeline
          </h2>
          <div className="grid grid-cols-1 gap-px border border-co-border bg-co-border sm:grid-cols-2 lg:grid-cols-5">
            {TIMELINE.map((t) => (
              <div key={t.year} className="bg-co-bg p-[clamp(24px,3vw,32px)] px-[clamp(20px,2.2vw,26px)]">
                <p className="mb-3.5 font-display text-[26px] font-medium leading-none tracking-tight text-co-green">
                  {t.year}
                </p>
                <p className="text-[15px] font-light leading-relaxed text-co-ink-soft">{t.what}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 text-[13px] font-light text-co-faint">
            Milestone dates to be confirmed with the founder before publication.
          </p>
        </div>
      </section>

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

      {/*
        PLACEHOLDER SECTION — Partnerships.
        The original demo referenced MERRYFAIR / SPACEWOOD / Humanscale. Whether those
        partnerships still legally apply to the Cohuman entity is an open item with
        Tushar/Vaibhav — do not add logos or brand names here until that is confirmed.
      */}
      <section className="border-t border-co-border">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,72px)] sm:px-6 lg:px-11">
          <h2 className="mb-3 font-display text-2xl font-medium tracking-tight sm:text-[28px]">
            Partnerships
          </h2>
          <p className="max-w-[54ch] text-[15.5px] font-light leading-relaxed text-co-muted">
            Cohuman works alongside a small number of manufacturing and design partners. Names
            and logos will appear here once current partnership agreements are confirmed for
            the Cohuman brand.
          </p>
        </div>
      </section>
    </div>
  );
}
