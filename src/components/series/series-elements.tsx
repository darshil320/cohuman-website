"use client";

import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

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

        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-px bg-co-bg p-0">
          {series.elements.map((element, index) => (
            <Reveal
              as="li"
              key={element.code}
              step={index}
              className="bg-co-bg px-5 pb-5 pt-[22px] shadow-[0_0_0_1px_var(--color-co-border)] transition-colors hover:bg-white"
            >
              <div className="mb-4 flex items-baseline justify-between gap-2.5">
                <span className="font-display text-[26px] font-medium tracking-[-0.03em] text-co-green">
                  {element.ref}
                </span>
                <span className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-co-placeholder">
                  {element.kind}
                </span>
              </div>
              <h3 className="mb-2 font-display text-lg font-medium leading-tight tracking-[-0.02em]">
                {element.name}
              </h3>
              <p className="mb-3.5 text-[13.5px] font-light leading-normal text-co-muted">
                {element.note}
              </p>
              <p className="font-mono text-xs text-co-faint">{element.code}</p>
            </Reveal>
          ))}
        </ul>

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
