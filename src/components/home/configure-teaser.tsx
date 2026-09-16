import Link from "next/link";
import { ALL_OPTIONS } from "@/lib/configurator";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

/**
 * Configurator teaser.
 *
 * The four choice types are read off the real option model rather than written as copy,
 * so the promise on the homepage cannot drift from what /configure actually asks.
 *
 * On white, and placed after the collections and the range rather than before them:
 * specifying a table is a mid-funnel action, so it is asked for once the visitor has
 * seen what there is to specify. The dark panel this used to carry now belongs to
 * "Furnish by space", which has photography to put on it.
 */
export function ConfigureTeaser() {
  const total = ALL_OPTIONS.reduce((sum, entry) => sum + entry.tops.length, 0);
  const legs = ALL_OPTIONS.reduce((sum, entry) => sum + entry.legs.length, 0);
  const finishes = ALL_OPTIONS.reduce((sum, entry) => sum + entry.finishes.length, 0);

  const choices = [
    { n: "01", label: "Configuration", count: `${total}`, note: "Desks, benches, meeting tables." },
    { n: "02", label: "Top & size", count: "mm", note: "Length and depth to the millimetre." },
    { n: "03", label: "Finish", count: `${finishes}`, note: "Tops, frames and screens." },
    { n: "04", label: "Legs & extras", count: `${legs}`, note: "Leg packages, wire, screens." },
  ];

  return (
    <section className="border-t border-co-border">
      <div className="co-shell co-section">
        <div className="grid grid-cols-1 items-end gap-x-[clamp(28px,4vw,80px)] gap-y-8 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <p className="co-eyebrow mb-4">Configurator</p>
            <h2 className="co-h2 max-w-[17ch]">
              <TextReveal>Specify the table before you ask the price.</TextReveal>
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="lg:justify-self-end">
            <p className="mb-8 max-w-[44ch] text-[clamp(15px,1.3vw,18px)] font-light leading-relaxed text-co-muted lg:text-right">
              Pick the configuration, the size, the top and the legs. The drawing follows every
              choice and the specification arrives with the part numbers already on it.
            </p>
            <div className="lg:text-right">
              <Link
                href="/configure"
                className="group inline-flex items-center gap-3 border-b-2 border-co-ink pb-2 text-[clamp(15px,1.4vw,19px)] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
              >
                Start configuring
                <svg
                  aria-hidden
                  width="15"
                  height="10"
                  viewBox="0 0 13 9"
                  fill="none"
                  className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1.5"
                >
                  <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </Reveal>
        </div>

        <StaggerContainer className="mt-[clamp(44px,5.4vw,84px)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-[clamp(20px,2.4vw,44px)]">
          {choices.map((choice) => (
            <StaggerItem
              key={choice.n}
              className="flex flex-col border-t border-co-border py-[clamp(20px,2.4vw,32px)]"
            >
              <span
                aria-hidden
                className="mb-[clamp(24px,3vw,44px)] font-display text-[clamp(22px,2.4vw,32px)] font-normal leading-none tracking-[-0.04em] tabular-nums text-co-border-strong"
              >
                {choice.n}
              </span>
              <p className="co-eyebrow mb-2.5">{choice.label}</p>
              <p className="max-w-[26ch] text-[13.5px] font-light leading-relaxed text-co-muted">
                {choice.note}
              </p>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
