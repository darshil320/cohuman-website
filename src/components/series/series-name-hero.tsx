"use client";

import Link from "next/link";
import { DimensionLine } from "@/components/ui/dimension-line";
import { configSizeRange } from "@/lib/series";
import { useSeriesConfigurator } from "./series-context";

/** Two-digit ordinal, so the counter never jumps width. */
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * A — the name hero. Officemate's first beat, in Signal: the configuration's name in
 * extended caps on a lot of canvas, a series eyebrow that says where you are in the
 * range, and a dimension rule carrying the size range the configuration is offered in.
 * The ink block in the bottom-left corner is the top of the spec block below, reaching
 * up into the white — one brand colour used as one solid block, not sprinkled.
 *
 * Everything reads the shared configurator state, so picking a configuration anywhere
 * on the page renames this hero.
 */
export function SeriesNameHero() {
  const { series, config } = useSeriesConfigurator();
  const position = series.configs.indexOf(config) + 1;

  return (
    <section id="configuration" className="relative scroll-mt-[72px] overflow-hidden">
      <div className="co-shell relative pb-[clamp(96px,10vw,150px)] pt-[clamp(24px,3vw,40px)]">
        <nav aria-label="Breadcrumb" className="co-eyebrow flex flex-wrap items-center gap-2">
          <Link href="/collections" className="hover:text-co-ink">
            Collections
          </Link>
          <span aria-hidden>/</span>
          <span className="text-co-ink">{series.wordmark}</span>
        </nav>

        <div className="mt-[clamp(48px,7vw,104px)] lg:pl-[clamp(0px,18vw,280px)]">
          <p className="co-eyebrow">
            {series.wordmark} series — {series.eyebrow} — Config {pad(position)} / {pad(series.configs.length)}
          </p>
          <h1 className="co-display mt-4 max-w-[20ch] text-[clamp(30px,4.2vw,64px)]">
            {config.name}
            <span className="sr-only">, {series.name}</span>
          </h1>
          <DimensionLine
            label={`${configSizeRange(config)} mm`}
            className="mt-[clamp(20px,2.4vw,32px)] w-full max-w-[820px]"
          />
          <p className="co-lead mt-6 max-w-[46ch]">{series.promise}</p>
        </div>

        {/* Anchored to the shell's outer edge — the same edge the spec block starts on. */}
        <div aria-hidden className="absolute -bottom-px left-0 h-[clamp(56px,7vw,110px)] w-[clamp(120px,21vw,300px)] bg-co-panel" />
      </div>
    </section>
  );
}
