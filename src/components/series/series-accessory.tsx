"use client";

import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/**
 * Accessory quoted by SKU and travel rather than by configuration — VARIDEX's
 * retractable wire channel. Rendered only where the series defines one.
 */
export function SeriesAccessory() {
  const { series } = useSeriesConfigurator();
  const accessory = series.accessory;
  if (!accessory) return null;

  return (
    <section className="border-b border-co-border bg-co-panel text-co-panel-fg">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(58px,7vw,116px)] sm:px-6 lg:px-11">
        <div className="grid items-start gap-[clamp(24px,3.4vw,54px)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
          <Reveal>
            <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-co-panel-faint">
              {accessory.eyebrow}
            </p>
            <h2 className="mb-5 max-w-[22ch] font-display text-[clamp(30px,4vw,54px)] font-medium leading-[1.0] tracking-[-0.038em] text-co-panel-fg">
              {accessory.heading}
            </h2>
            <p className="max-w-[44ch] text-[15.5px] font-light leading-relaxed text-co-panel-muted">
              {accessory.blurb}
            </p>

            <dl className="mt-8 grid">
              {accessory.parts.map((part) => (
                <div key={part.name} className="border-t border-co-panel-border py-4">
                  <dt className="mb-1.5 font-display text-[17px] font-medium tracking-[-0.022em] text-co-panel-fg">
                    {part.name}
                  </dt>
                  <dd className="max-w-[46ch] text-[13.5px] font-light leading-relaxed text-co-panel-muted">
                    {part.note}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal step={1}>
            <div>
              <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-4 border-b border-co-panel-border pb-3">
                {accessory.columns.map((column, index) => (
                  <span
                    key={column}
                    className={`text-[10px] font-semibold uppercase tracking-[0.2em] text-co-panel-faint ${
                      index > 0 ? "text-right" : ""
                    }`}
                  >
                    {column}
                  </span>
                ))}
              </div>
              {accessory.rows.map((row) => (
                <div
                  key={row.code}
                  className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 border-b border-co-panel-border/60 py-3.5 last:border-b-0"
                >
                  <span className="font-mono text-[12.5px] text-co-panel-fg">{row.code}</span>
                  <span className="text-right text-sm font-light tabular-nums text-co-panel-muted">
                    {row.min}
                  </span>
                  <span className="text-right text-sm font-light tabular-nums text-co-panel-muted">
                    {row.max}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[12.5px] font-light leading-relaxed text-co-panel-faint">
              Travel is the span the tray covers, not the length of the top — we size it
              against the beam on the quote.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
