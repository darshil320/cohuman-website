"use client";

import { Button } from "@/components/ui/button";
import { useSeriesConfigurator } from "./series-context";

/**
 * D — Prev / All / Next, with the quote action.
 *
 * Officemate's strip between products, here between configurations of one series. It sits
 * in the page flow — never fixed — so it scrolls away like any section. The outer cells
 * load the neighbouring configuration (wrapping at the ends) and take you back up to its
 * name; "All configurations" jumps to the picker under the spec block; "Get a quote" goes
 * to the enquiry form directly below.
 */
export function SeriesPager() {
  const { series, config, pickConfig } = useSeriesConfigurator();
  const count = series.configs.length;
  const index = series.configs.indexOf(config);
  const prev = series.configs[(index - 1 + count) % count];
  const next = series.configs[(index + 1) % count];

  const scrollTo = (id: string) => {
    document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  };

  const load = (target: typeof config) => {
    pickConfig(series.configs.indexOf(target));
    scrollTo("configuration");
  };

  return (
    <nav id="pager" aria-label="Configurations" className="border-y border-co-ink">
      <div className="co-shell grid grid-cols-2 md:grid-cols-[1fr_minmax(260px,340px)_1fr]">
        <button
          type="button"
          onClick={() => load(prev)}
          className="group flex min-w-0 flex-col items-start gap-2 border-r border-co-border py-6 pr-4 text-left transition-colors hover:bg-co-bg-alt md:flex-row md:items-center md:justify-between md:py-8 md:pr-8"
        >
          <span className="co-data text-co-muted-2 transition-colors group-hover:text-co-ink">← Prev</span>
          <span className="truncate font-display text-[clamp(16px,1.7vw,24px)] font-semibold leading-none tracking-[-0.02em]">
            {prev.short}
          </span>
        </button>

        <div className="order-last col-span-2 flex flex-col items-stretch gap-3 border-t border-co-border py-4 sm:flex-row sm:items-center sm:justify-center md:order-none md:col-span-1 md:flex-col md:border-r md:border-t-0 md:px-6 md:py-6">
          <Button type="button" onClick={() => scrollTo("enquire")} className="w-full sm:w-auto md:w-full">
            Get a quote
          </Button>
          <button
            type="button"
            onClick={() => scrollTo("configurations")}
            className="co-data py-1 text-co-muted-2 underline-offset-4 transition-colors hover:text-co-ink hover:underline"
          >
            All {series.wordmark} configurations
          </button>
        </div>

        <button
          type="button"
          onClick={() => load(next)}
          className="group flex min-w-0 flex-col items-end gap-2 py-6 pl-4 text-right transition-colors hover:bg-co-bg-alt md:flex-row-reverse md:items-center md:justify-between md:py-8 md:pl-8"
        >
          <span className="co-data text-co-muted-2 transition-colors group-hover:text-co-ink">Next →</span>
          <span className="truncate font-display text-[clamp(16px,1.7vw,24px)] font-semibold leading-none tracking-[-0.02em]">
            {next.short}
          </span>
        </button>
      </div>
    </nav>
  );
}
