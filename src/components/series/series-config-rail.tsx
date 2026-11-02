"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { FinishChip } from "@/components/ui/finish-chip";
import { configSizeRange, type SeriesConfig } from "@/lib/series";
import { cn } from "@/lib/utils";
import { ConfigFlight, prefersReducedMotion, scrollToViewer, type Flight } from "./series-config-flight";
import { useSeriesConfigurator } from "./series-context";

/** How long a card takes to grow — matches the width/height transitions below. */
const GROW_MS = 450;
/** How far the strip arrows scroll it. */
const STRIP_STEP_PX = 480;

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

/** Two-digit ordinal, so the counter never jumps width as it counts. */
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * The configuration picker, under the spec block — a filmstrip you can compare across.
 *
 * Every configuration is a card in one horizontal strip. The selected one is wide, with
 * a large render and its name, size range, seats and code; the rest shrink to compact
 * cards beside it, so the chosen table is always read against its neighbours. Picking a
 * card:
 *
 *   1. selects it at once — the viewer above starts its dissolve, the spec rows update;
 *   2. the card grows while the others shrink (CSS width/height, GROW_MS);
 *   3. a copy of its render flies from the card into the viewer while the page scrolls up
 *      to it (`ConfigFlight`), landing on the viewer already showing that render;
 *   4. the strip re-centres on the chosen card, ready for the next comparison.
 *
 * Reduced motion skips 2–3: the selection applies and the page jumps to the viewer.
 */
export function SeriesConfigRail() {
  const { series, config, finish, setFinish, visibleConfigs, pickConfig } = useSeriesConfigurator();
  const filters = series.finishFilters;
  const position = visibleConfigs.indexOf(config) + 1;
  const codeFor = (label: string) => series.swatches?.find((swatch) => swatch.name === label)?.code;

  const stripRef = useRef<HTMLDivElement>(null);
  const flightTimer = useRef<number | null>(null);
  const [flight, setFlight] = useState<Flight | null>(null);
  const endFlight = useCallback(() => setFlight(null), []);

  useEffect(
    () => () => {
      if (flightTimer.current) window.clearTimeout(flightTimer.current);
    },
    [],
  );

  // Re-centre the strip on the selected card once it has finished growing.
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const timer = window.setTimeout(() => {
      const card = strip.querySelector<HTMLElement>(`[data-slug="${config.slug}"]`);
      if (!card) return;
      strip.scrollTo({
        left: card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, GROW_MS);
    return () => window.clearTimeout(timer);
  }, [config.slug, visibleConfigs.length]);

  const choose = (item: SeriesConfig) => {
    const alreadyChosen = item.slug === config.slug;
    pickConfig(series.configs.indexOf(item));

    if (prefersReducedMotion()) {
      scrollToViewer("auto");
      return;
    }

    if (flightTimer.current) window.clearTimeout(flightTimer.current);
    // Let the card finish growing first, so the flight starts from its full-size render.
    flightTimer.current = window.setTimeout(
      () => {
        const img = stripRef.current?.querySelector<HTMLImageElement>(`[data-slug="${item.slug}"] img`);
        if (!img) return;
        const box = img.getBoundingClientRect();
        setFlight({
          src: img.currentSrc || img.src,
          from: { left: box.left, top: box.top, width: box.width, height: box.height },
        });
        scrollToViewer("smooth");
      },
      alreadyChosen ? 0 : GROW_MS,
    );
  };

  const nudge = (direction: 1 | -1) => {
    stripRef.current?.scrollBy({
      left: direction * STRIP_STEP_PX,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <p className="co-eyebrow">02 / Configurations — pick one to see it above</p>
          {filters ? (
            <div role="group" aria-label="Filter by top finish" className="mt-4 flex flex-wrap gap-3.5">
              {filters.map((filter) => (
                <FinishChip
                  key={filter.key}
                  name={filter.label}
                  code={codeFor(filter.label) ?? (filter.key === "all" ? "All tops" : undefined)}
                  fill={filter.swatch}
                  selected={finish === filter.key}
                  onSelect={() => setFinish(filter.key)}
                  className="w-[64px]"
                />
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-4">
          <p className="co-data text-co-muted-2">
            {/* A finish filter can hide the selected configuration; show the count alone then. */}
            {position > 0 ? `${pad(position)} / ` : ""}
            {pad(visibleConfigs.length)}
          </p>
          <div className="hidden sm:flex">
            <button
              type="button"
              aria-label="Scroll configurations left"
              onClick={() => nudge(-1)}
              className="flex h-10 w-10 items-center justify-center border border-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Scroll configurations right"
              onClick={() => nudge(1)}
              className="-ml-px flex h-10 w-10 items-center justify-center border border-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
            >
              →
            </button>
          </div>
        </div>
      </div>

      <div
        ref={stripRef}
        role="group"
        aria-label={`${series.wordmark} configurations`}
        className="relative -mx-[18px] flex snap-x snap-proximity items-start gap-3 overflow-x-auto px-[18px] pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0"
      >
        {visibleConfigs.map((item) => {
          const on = item.slug === config.slug;
          return (
            <button
              key={item.slug}
              type="button"
              data-slug={item.slug}
              title={item.name}
              aria-pressed={on}
              aria-label={`${item.n} — ${item.name}${on ? ", shown above" : ""}`}
              onClick={() => choose(item)}
              className={cn(
                "group relative flex shrink-0 snap-center flex-col overflow-hidden border bg-co-bg p-3 text-left transition-[width,border-color,background-color] duration-[450ms] motion-reduce:transition-none",
                EASE,
                on
                  ? "w-[288px] border-co-ink sm:w-[440px]"
                  : "w-[128px] border-co-border hover:border-co-ink hover:bg-co-bg-alt sm:w-[156px]",
              )}
            >
              <span
                className={cn(
                  "relative block w-full transition-[height] duration-[450ms] motion-reduce:transition-none",
                  EASE,
                  on ? "h-[168px] sm:h-[248px]" : "h-[76px] sm:h-[96px]",
                )}
              >
                <Image
                  src={item.image}
                  alt=""
                  fill
                  sizes="(min-width: 640px) 440px, 288px"
                  className="co-cutout object-contain"
                />
              </span>

              <span className={cn("co-data mt-2.5 block whitespace-nowrap", on ? "text-co-ink" : "text-co-muted-2")}>
                {item.n} · {item.short}
              </span>

              {on ? (
                <span className="mt-2 block border-t border-co-border pt-3">
                  <span className="block font-display text-[clamp(16px,1.5vw,20px)] font-semibold leading-[0.95] tracking-[-0.02em]">
                    {item.name}
                  </span>
                  <span className="co-data mt-2 block text-co-muted-2">
                    {configSizeRange(item)} mm · {item.seats} {item.seats === "1" ? "seat" : "seats"}
                  </span>
                  <span className="co-data block text-co-muted-2">{item.code}</span>
                  <span className="co-data mt-2 block text-co-ink">Shown above ↑</span>
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {flight ? <ConfigFlight flight={flight} onDone={endFlight} /> : null}
    </div>
  );
}
