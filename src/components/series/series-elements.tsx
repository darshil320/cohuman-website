"use client";

import { MobilePeek } from "@/components/common/mobile-peek";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/** Rows a phone shows before the list asks to be opened. */
const MOBILE_PEEK = 3;

export function SeriesElements() {
  const { series } = useSeriesConfigurator();
  const { elementsSection: section } = series;

  return (
    <section className="border-b border-co-border bg-co-bg-alt">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(28px,3.4vw,44px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
              {section.eyebrow}
            </p>
            <h2 className="max-w-[20ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em]">
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
          <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-px bg-co-bg p-0">
            {series.elements.map((element, index) => (
              <Reveal
                as="li"
                key={element.code}
                step={index}
                className="bg-co-bg px-4 py-3.5 shadow-[0_0_0_1px_var(--color-co-border)] transition-colors hover:bg-white sm:px-5 sm:pb-5 sm:pt-[22px]"
              >
                {/*
                  One flex row, reordered rather than duplicated: on a phone the reference,
                  name and kind share a line so a card is a schedule row; from `sm` the name
                  takes a full basis and drops to its own line, which is the card layout.
                */}
                <div className="mb-1.5 flex flex-wrap items-baseline gap-x-2.5 gap-y-1 sm:mb-2">
                  <span className="order-1 font-display text-[19px] font-medium leading-none tracking-[-0.03em] text-co-green sm:text-[26px]">
                    {element.ref}
                  </span>
                  <h3 className="order-2 min-w-0 font-display text-[15.5px] font-medium leading-tight tracking-[-0.02em] sm:order-3 sm:mt-3 sm:basis-full sm:text-lg">
                    {element.name}
                  </h3>
                  <span className="order-3 ml-auto shrink-0 text-[10px] font-semibold uppercase tracking-[0.12em] text-co-placeholder sm:order-2 sm:text-[10.5px] sm:tracking-[0.13em]">
                    {element.kind}
                  </span>
                </div>
                <p className="mb-1.5 text-[13px] font-light leading-snug text-co-muted sm:mb-3.5 sm:text-[13.5px] sm:leading-normal">
                  {element.note}
                </p>
                <p className="font-mono text-[11px] text-co-faint sm:text-xs">{element.code}</p>
              </Reveal>
            ))}
          </ul>
        </MobilePeek>

        {series.elementsNote ? (
          <div className="mt-5 flex items-start gap-3 border-l-[3px] border-co-green bg-co-green-paler px-4 py-3.5">
            <span className="shrink-0 pt-0.5 text-[11px] font-bold tracking-[0.1em] text-co-green-dark">
              NOTE
            </span>
            <p className="text-[14.5px] leading-snug text-[#35461C]">{series.elementsNote}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
