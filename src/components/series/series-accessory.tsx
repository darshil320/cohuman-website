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
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <div className="grid items-start gap-[clamp(24px,3.4vw,54px)] lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green-light">
              {accessory.eyebrow}
            </p>
            <h2 className="mb-4 max-w-[22ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em] text-co-panel-fg">
              {accessory.heading}
            </h2>
            <p className="max-w-[44ch] text-[15.5px] font-light leading-relaxed text-co-panel-muted">
              {accessory.blurb}
            </p>

            <dl className="mt-6 grid gap-px bg-co-panel-border">
              {accessory.parts.map((part) => (
                <div key={part.name} className="bg-co-panel py-3.5">
                  <dt className="mb-1 font-display text-[17px] font-medium tracking-[-0.02em] text-co-panel-fg">
                    {part.name}
                  </dt>
                  <dd className="max-w-[46ch] text-[13.5px] font-light leading-normal text-co-panel-muted">
                    {part.note}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal step={1}>
            <div className="border border-co-panel-border">
              <div className="grid grid-cols-[1.6fr_1fr_1fr] gap-4 border-b border-co-panel-border bg-white/5 px-4 py-3">
                {accessory.columns.map((column, index) => (
                  <span
                    key={column}
                    className={`text-[10.5px] font-semibold uppercase tracking-[0.11em] text-co-panel-faint ${
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
                  className="grid grid-cols-[1.6fr_1fr_1fr] items-center gap-4 border-b border-co-panel-border px-4 py-3.5 last:border-b-0"
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
            <p className="mt-3.5 text-[12.5px] font-light leading-snug text-co-panel-faint">
              Travel is the span the tray covers, not the length of the top — we size it
              against the beam on the quote.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
