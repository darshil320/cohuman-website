"use client";

import Image from "next/image";
import { useState } from "react";
import { RegistrationCross } from "@/components/ui/registration-cross";
import type { SeriesConfig, SeriesDefinition } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { scrollToId } from "@/lib/motion";

/** The finish a configuration was photographed in, or null where the series names none. */
function finishCaption(series: SeriesDefinition, item: SeriesConfig): string | null {
  const label = series.finishFilters?.find((f) => f.key === item.finish)?.label;
  return label ? `${label} top` : null;
}

/**
 * C — the per-configuration gallery. Officemate's one-frame-per-variant beat: every
 * configuration's studio render in turn, with its finish label, its real length range on
 * a dimension line, and bar pagination.
 *
 * Browsing here does not change the configuration being specified — the spec block keeps
 * its selection — until "Configure this" loads the one on screen. Each new frame wipes in
 * left to right; the active pagination bar is the view's one green thing.
 */
export function SeriesConfigGallery() {
  const { series, config, pickConfig } = useSeriesConfigurator();
  const configs = series.configs;
  const [index, setIndex] = useState(() => Math.max(0, configs.indexOf(config)));
  const [moved, setMoved] = useState(false);
  const item = configs[index];

  const go = (next: number) => {
    setIndex((next + configs.length) % configs.length);
    setMoved(true);
  };

  const configure = () => {
    pickConfig(index);
    scrollToId("configuration");
  };

  return (
    <section aria-roledescription="carousel" aria-label={`${series.wordmark} configurations`} className="border-b border-co-ink">
      <div className="co-shell py-[clamp(56px,7vw,104px)] text-center">
        <p className="co-eyebrow">
          03 / Gallery
        </p>
        <h2 className="co-h2 mt-3" aria-live="polite">
          {item.name}
        </h2>

        <div className="mt-[clamp(20px,3vw,40px)] grid grid-cols-[44px_minmax(0,1fr)_44px] items-center gap-3 sm:grid-cols-[52px_minmax(0,1fr)_52px] sm:gap-[clamp(16px,5vw,80px)]">
          <button
            type="button"
            aria-label="Previous configuration"
            onClick={() => go(index - 1)}
            className="flex h-[44px] items-center justify-center border border-co-ink transition-colors hover:bg-co-ink hover:text-co-bg sm:h-[52px]"
          >
            ←
          </button>

          <figure className="relative mx-auto w-full max-w-[720px] text-co-ink">
            <RegistrationCross className="left-0 top-0" />
            <RegistrationCross className="right-0 top-0" />
            {/* Keyed so each frame remounts; the wipe sits on the image itself, because a
                clip-path on a wrapper would isolate the multiply and flash the white box. */}
            <div key={item.slug} className="relative aspect-[16/9]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(min-width: 1024px) 720px, 80vw"
                className={cn("co-cutout object-contain", moved && "co-wipe-in")}
              />
            </div>
            {finishCaption(series, item) ? (
              <figcaption className="co-data mt-4">{finishCaption(series, item)}</figcaption>
            ) : null}
          </figure>

          <button
            type="button"
            aria-label="Next configuration"
            onClick={() => go(index + 1)}
            className="flex h-[44px] items-center justify-center border border-co-ink transition-colors hover:bg-co-ink hover:text-co-bg sm:h-[52px]"
          >
            →
          </button>
        </div>

        {/*
          Each bar's button is 44px tall and padded 4px a side with no gap between them, so
          the bars sit 8px apart as before but every target is ≥ 28×44 and none overlap.
        */}
        <div className="mt-6 flex flex-wrap justify-center" role="group" aria-label="Configurations">
          {configs.map((c, i) => (
            <button
              key={c.slug}
              type="button"
              aria-label={`${c.n} — ${c.name}`}
              aria-current={i === index}
              onClick={() => go(i)}
              className="flex h-11 items-center px-1"
            >
              <span className={cn("block h-[3px] w-5 sm:w-7", i === index ? "bg-co-green" : "bg-co-border hover:bg-co-muted-2")} />
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={configure}
          disabled={item.slug === config.slug}
          className="co-data mt-6 inline-flex items-center gap-2 border-b border-co-ink pb-1 disabled:border-transparent disabled:text-co-muted-2"
        >
          {item.slug === config.slug ? "Currently specified" : "Configure this →"}
        </button>
      </div>
    </section>
  );
}
