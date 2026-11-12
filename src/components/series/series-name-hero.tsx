"use client";

import Link from "next/link";
import { DimensionLine } from "@/components/ui/dimension-line";
import { configSizeRange } from "@/lib/series";
import { useSeriesConfigurator } from "./series-context";

/**
 * A — the name hero, split in two so the spec panel can sit beside it (client request,
 * "suggestion 1"): the breadcrumb runs full width here, and `SeriesNameHeading` — the
 * series eyebrow, the configuration's name and the dimension rule carrying its size
 * range — opens the left column of the spec block, above the viewer, with the ink
 * panel rising alongside it on the right.
 *
 * Everything reads the shared configurator state, so picking a configuration anywhere
 * on the page renames this hero. `#configuration` stays on this section: it is the top
 * of the product, where the pager and gallery scroll back to.
 */
export function SeriesNameHero() {
  const { series } = useSeriesConfigurator();

  return (
    <section id="configuration" className="relative scroll-mt-[72px]">
      <div className="co-shell pt-[clamp(24px,3vw,40px)]">
        <nav aria-label="Breadcrumb" className="co-eyebrow flex flex-wrap items-center gap-2">
          <Link href="/collections" className="hover:text-co-ink">
            Collections
          </Link>
          <span aria-hidden>/</span>
          <span className="text-co-ink">{series.wordmark}</span>
        </nav>
      </div>
    </section>
  );
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
      <DimensionLine
        label={`${configSizeRange(config)}\u00A0mm`}
        className="mt-[clamp(20px,2.4vw,32px)] w-full max-w-[820px]"
      />
      <p className="co-lead mt-6 max-w-[46ch]">{series.promise}</p>
    </div>
  );
}
