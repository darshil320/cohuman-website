"use client";

import { MobilePeek } from "@/components/common/mobile-peek";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/** Rows a phone shows before the list asks to be opened. */
const MOBILE_PEEK = 3;

/**
 * Component schedule.
 *
 * Read as an index rather than a card wall: a large ghost ordinal, a hairline rule per
 * row, and no fill anywhere. The reference code keeps the leading position because that
 * is what a specifier quotes from.
 */
export function SeriesElements() {
  const { series } = useSeriesConfigurator();
  const { elementsSection: section } = series;

  return (
    <section className="border-b border-co-border bg-co-bg">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(58px,7vw,116px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(38px,5vw,72px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
          <Reveal>
            <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-co-placeholder">
              {section.eyebrow}
            </p>
            <h2 className="max-w-[20ch] font-display text-[clamp(30px,4vw,54px)] font-medium leading-[1.0] tracking-[-0.038em]">
              {section.heading}
            </h2>
          </Reveal>
          {section.blurb ? (
            <Reveal step={1}>
              <p className="max-w-[46ch] text-[15.5px] font-light leading-relaxed text-co-muted">
                {section.blurb}
              </p>
            </Reveal>
          ) : null}
        </div>

        <MobilePeek peek={MOBILE_PEEK} total={series.elements.length} noun="components">
          <ul className="grid list-none grid-cols-1 gap-0 p-0 md:grid-cols-2 md:gap-x-[clamp(32px,4vw,72px)]">
            {series.elements.map((element, index) => (
              <Reveal
                as="li"
                key={element.code}
                step={index}
                className="group grid grid-cols-[auto_1fr] items-start gap-x-4 border-t border-co-border py-[clamp(18px,2.2vw,28px)] sm:gap-x-6"
              >
                {/* Ghost ordinal: the index device, not a badge. */}
                <span
                  aria-hidden
                  className="font-display text-[clamp(26px,3vw,38px)] font-normal leading-none tracking-[-0.04em] text-co-border-strong tabular-nums transition-colors duration-300 group-hover:text-co-ink"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="min-w-0">
                  <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 className="font-display text-[clamp(17px,1.5vw,21px)] font-medium leading-tight tracking-[-0.025em]">
                      {element.name}
                    </h3>
                    <span className="ml-auto shrink-0 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-co-placeholder">
                      {element.kind}
                    </span>
                  </div>
                  <p className="mb-3 max-w-[48ch] text-[13.5px] font-light leading-relaxed text-co-muted">
                    {element.note}
                  </p>
                  <div className="flex items-baseline gap-3 font-mono text-[11px] tracking-[0.04em] text-co-placeholder">
                    <span className="font-semibold text-co-ink-soft">{element.ref}</span>
                    <span aria-hidden className="h-px flex-1 bg-co-border" />
                    <span>{element.code}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
        </MobilePeek>

        {series.elementsNote ? (
          <div className="mt-[clamp(26px,3vw,40px)] flex items-start gap-4 border-t border-co-border pt-5">
            <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.2em] text-co-placeholder">
              Note
            </span>
            <p className="max-w-[60ch] text-[13.5px] font-light leading-relaxed text-co-muted">
              {series.elementsNote}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
