"use client";

import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/** Finish board. Rendered only for series whose specification names finishes. */
export function SeriesFinishes() {
  const { series } = useSeriesConfigurator();
  const section = series.swatchesSection;
  const swatches = series.swatches;
  if (!swatches?.length || !section) return null;

  return (
    <section className="border-b border-co-border bg-co-panel text-co-panel-fg">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(58px,7vw,116px)] sm:px-6 lg:px-11">
        <Reveal>
          <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-co-panel-faint">
            {section.eyebrow}
          </p>
          <h2 className="mb-[clamp(34px,4.4vw,60px)] max-w-[22ch] font-display text-[clamp(30px,4vw,54px)] font-medium leading-[1.0] tracking-[-0.038em] text-co-panel-fg">
            {section.heading}
          </h2>
        </Reveal>

        {/* Two-up on a phone: at one card per row the board ran to five full-width tiles
            and buried the footnote a screen and a half down. */}
        <ul className="grid list-none grid-cols-2 gap-x-4 gap-y-[26px] p-0 sm:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] sm:gap-x-[clamp(18px,2.4vw,40px)] sm:gap-y-[clamp(26px,3vw,48px)]">
          {swatches.map((swatch, index) => (
            <Reveal as="li" key={swatch.name} step={index}>
              <div
                className="relative aspect-[4/3] overflow-hidden sm:aspect-[5/4]"
                style={{ background: swatch.fill ?? "#2b2d30" }}
              >
                <span
                  aria-hidden
                  className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0)_42%,rgba(0,0,0,0.14)_100%)]"
                />
                {swatch.edge ? (
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 right-0 h-[26%] border-t border-black/10"
                    style={{ background: swatch.edge }}
                  />
                ) : null}
              </div>
              <h3 className="mb-0.5 mt-2.5 font-display text-[15px] font-medium leading-tight tracking-[-0.02em] text-co-panel-fg sm:mb-1 sm:mt-3.5 sm:text-[17.5px]">
                {swatch.name}
              </h3>
              <p className="mb-1 text-[12.5px] font-light leading-normal text-co-panel-muted sm:text-[13.5px]">
                {swatch.spec}
              </p>
              {swatch.code ? (
                <p className="font-mono text-[10.5px] tracking-[0.04em] text-co-panel-faint sm:text-[11px]">
                  {swatch.code}
                </p>
              ) : null}
            </Reveal>
          ))}
        </ul>

        {series.swatchesFootnote ? (
          <p className="mt-[clamp(30px,3.4vw,48px)] border-t border-co-panel-border pt-5 text-[12.5px] font-light leading-relaxed text-co-panel-faint">
            {series.swatchesFootnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
