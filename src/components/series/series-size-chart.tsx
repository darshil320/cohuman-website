"use client";

import { chartDepths, chartLengths } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

const ROW_GRID = "grid grid-cols-[44px_minmax(200px,1.5fr)_1.5fr_1fr_1fr_84px] gap-4";

const HEADINGS = ["#", "Configuration", "Length mm", "Depth mm", "Beam", "Seats"];

export function SeriesSizeChart() {
  const { series, config, pickConfig } = useSeriesConfigurator();
  const section = series.sizeChartSection;

  return (
    <section className="border-b border-co-border">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(24px,3vw,38px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
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

        <div className="overflow-x-auto border border-co-border">
          <div className="min-w-[720px]">
            <div
              className={cn(ROW_GRID, "border-b border-co-border bg-co-bg-alt px-4 py-3.5")}
              aria-hidden
            >
              {HEADINGS.map((heading, index) => (
                <span
                  key={heading}
                  className={cn(
                    "text-[10.5px] font-semibold uppercase tracking-[0.11em] text-co-placeholder",
                    index === HEADINGS.length - 1 && "text-right",
                  )}
                >
                  {heading}
                </span>
              ))}
            </div>

            {series.configs.map((item, index) => {
              const on = item.slug === config.slug;
              return (
                <button
                  key={item.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => pickConfig(index)}
                  className={cn(
                    ROW_GRID,
                    "w-full items-center border-b border-co-card-border px-4 py-3.5 text-left transition-colors",
                    on
                      ? "bg-co-bg-alt shadow-[inset_3px_0_0_var(--color-co-green)]"
                      : "bg-co-bg hover:bg-co-bg-alt",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-[12.5px]",
                      on ? "text-co-green" : "text-co-placeholder",
                    )}
                  >
                    {item.n}
                  </span>
                  <span className="text-[15px] font-medium text-co-ink">{item.name}</span>
                  <span className="text-sm font-light tabular-nums text-co-muted">
                    {chartLengths(item)}
                  </span>
                  <span className="text-sm font-light tabular-nums text-co-muted">
                    {chartDepths(item)}
                  </span>
                  <span className="font-mono text-[12.5px] text-co-faint">{item.beam}</span>
                  <span className="text-right text-sm font-light text-co-muted">{item.seats}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
