import { CountUp } from "@/components/common/count-up";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { siteConfig } from "@/lib/site-config";

/**
 * The landing beat under the hero.
 *
 * A full-viewport photograph dropping straight into the next chapter gives the visitor
 * two maximum-contrast grounds back to back with nothing between them. This strip sits
 * on `co-bg-alt`, a half-step off white, so it reads as the bottom of the hero rather
 * than the top of something new — which is the job the stats strip used to do here.
 *
 * Deliberately short: `co-section` would make it a chapter of its own.
 *
 * Both figures are derived, never typed. A literal "37 yrs" is wrong every January and
 * nobody remembers to edit it.
 */
const yearsInBusiness = new Date().getFullYear() - siteConfig.foundedYear;

const PROOF = [
  { v: String(siteConfig.foundedYear), k: "Founded in Surat" },
  { n: yearsInBusiness, suffix: " yrs", k: "Designing and making workplaces" },
  { n: 6, k: "Product families in production" },
];

export function HomeProof() {
  return (
    <section className="border-b border-co-border bg-co-bg-alt">
      <StaggerContainer className="co-shell grid grid-cols-3 divide-x divide-co-border py-[clamp(30px,3.6vw,52px)]">
        {PROOF.map((s) => (
          <StaggerItem
            key={s.k}
            className="flex flex-col px-[clamp(10px,2vw,32px)] first:pl-0 last:pr-0"
          >
            {/*
              Figure and label sit in one box with the figure on a fixed line box, so all
              three baselines agree whether or not the cell is animated. `tabular-nums`
              holds the digits still while the count runs.
            */}
            <p className="mb-2.5 flex min-h-[1.05em] items-end whitespace-nowrap font-display text-[clamp(30px,4.4vw,62px)] font-medium leading-none tracking-[-0.045em] tabular-nums text-co-ink">
              {s.n ? <CountUp value={s.n} suffix={s.suffix} /> : s.v}
            </p>
            <p className="co-eyebrow mt-auto max-w-[18ch] leading-[1.5]">{s.k}</p>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
