"use client";

import { useSeriesConfigurator } from "./series-context";

/**
 * A — the top of the product. The breadcrumb was removed (client, Nov 2026); what is
 * left is the `#configuration` anchor the pager scrolls back to. `SeriesNameHeading`
 * opens the spec block's left column, above the viewer, beside the ink panel.
 */
export function SeriesNameHero() {
  return <div id="configuration" aria-hidden className="scroll-mt-[72px]" />;
}

/** The heading half of the name hero, set at the top of the spec block's left column. */
export function SeriesNameHeading() {
  const { series, config } = useSeriesConfigurator();

  return (
    <div>
      <p className="co-eyebrow">
        {series.wordmark} — {series.eyebrow}
      </p>
      <h1 className="co-display mt-4 max-w-[20ch] text-[clamp(30px,4.2vw,64px)]">
        {config.name}
        <span className="sr-only">, {series.name}</span>
      </h1>
      {/*<p className="co-lead mt-6 max-w-[46ch]">{series.promise}</p>*/}
    </div>
  );
}
