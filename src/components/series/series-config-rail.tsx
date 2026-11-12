"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { Field } from "@/components/configurator/configurator-controls";
import { seatLabel } from "@/components/configurator/labels";
import { FinishChip } from "@/components/ui/finish-chip";
import { configSizeRange, type SeriesConfig } from "@/lib/series";
import { cn } from "@/lib/utils";
import { ConfigFlight, prefersReducedMotion, scrollToViewer, type Flight } from "./series-config-flight";
import { useSeriesConfigurator } from "./series-context";

/** How long a card takes to grow — matches the width/height transitions below. */
const GROW_MS = 450;
/** How far the strip arrows scroll it. */
const STRIP_STEP_PX = 480;
/** Sub-pixel slack when deciding the strip is at either end. */
const EDGE_SLACK_PX = 1;

const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

/** Two-digit ordinal, so the counter never jumps width as it counts. */
const pad = (value: number) => String(value).padStart(2, "0");

/** Whether the strip can scroll further left / right — drives the arrows' disabled state. */
function useStripEdges(stripRef: RefObject<HTMLDivElement | null>) {
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const atStart = strip.scrollLeft <= EDGE_SLACK_PX;
    const atEnd = strip.scrollLeft + strip.clientWidth >= strip.scrollWidth - EDGE_SLACK_PX;
    setEdges((prev) => (prev.atStart === atStart && prev.atEnd === atEnd ? prev : { atStart, atEnd }));
  }, [stripRef]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const frame = requestAnimationFrame(measure);
    strip.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      strip.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [stripRef, measure]);

  return { ...edges, measure };
}

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
 * Keyboard activation skips 3 and the scroll: the page staying put keeps the focused card
 * on screen, and the grown card already shows the render, name and size.
 *
 * The finish chips here are a filter, not a finish choice, and are labelled so. They
 * carry no signal dot: the spec block's progress rail is this configurator's one green
 * thing.
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
  const { atStart, atEnd, measure } = useStripEdges(stripRef);

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
      measure();
      const card = strip.querySelector<HTMLElement>(`[data-slug="${config.slug}"]`);
      if (!card) return;
      strip.scrollTo({
        left: card.offsetLeft - (strip.clientWidth - card.offsetWidth) / 2,
        behavior: prefersReducedMotion() ? "auto" : "smooth",
      });
    }, GROW_MS);
    return () => window.clearTimeout(timer);
  }, [config.slug, visibleConfigs.length, measure]);

  const choose = (item: SeriesConfig, viaKeyboard: boolean) => {
    const alreadyChosen = item.slug === config.slug;
    pickConfig(series.configs.indexOf(item));

    if (viaKeyboard) return;

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

  const arrowClass =
    "relative -ml-px flex h-11 w-11 items-center justify-center border border-co-ink transition-colors first:ml-0 enabled:z-[1] enabled:hover:bg-co-ink enabled:hover:text-co-bg disabled:cursor-default disabled:border-co-border disabled:text-co-muted-2 focus-visible:z-10";

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <div>
          <p className="co-eyebrow">02 / Configurations — pick one to see it above</p>
          {filters ? (
            <Field label="Filter by top finish" className="mt-5">
              <div role="group" aria-label="Filter configurations by top finish" className="flex flex-wrap items-start gap-3.5">
                {filters.map((filter) => (
                  <FinishChip
                    key={filter.key}
                    name={filter.label}
                    code={codeFor(filter.label) ?? (filter.key === "all" ? "All tops" : undefined)}
                    fill={filter.swatch}
                    selected={finish === filter.key}
                    onSelect={() => setFinish(filter.key)}
                    dot={false}
                    className="w-[96px]"
                  />
                ))}
              </div>
            </Field>
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
              disabled={atStart}
              onClick={() => nudge(-1)}
              className={arrowClass}
            >
              <span aria-hidden>←</span>
            </button>
            <button
              type="button"
              aria-label="Scroll configurations right"
              disabled={atEnd}
              onClick={() => nudge(1)}
              className={arrowClass}
            >
              <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </div>

      {/*
        `pt-1` and the 4px inset on wide screens leave room for the 2px focus ring (offset
        2px): an overflowing strip clips everything outside it, the ring included.
      */}
      <div
        ref={stripRef}
        role="group"
        aria-label={`${series.wordmark} configurations`}
        className="relative -mx-[18px] flex snap-x snap-proximity items-start gap-3 overflow-x-auto px-[18px] pb-4 pt-1 sm:-mx-6 sm:px-6 lg:-mx-1 lg:px-1"
      >
        {visibleConfigs.length === 0 ? (
          <p className="co-data py-6 text-co-muted-2">
            No configuration is photographed in this finish — choose All to see every one.
          </p>
        ) : null}

        {visibleConfigs.map((item) => {
          const on = item.slug === config.slug;
          const facts = [`${configSizeRange(item)}\u00A0mm`, seatLabel(item.seats)].filter(Boolean).join(" · ");
          return (
            <button
              key={item.slug}
              type="button"
              data-slug={item.slug}
              title={item.name}
              aria-pressed={on}
              aria-label={`${item.n} — ${item.name}${on ? ", shown above" : ""}`}
              // `detail` is 0 for a click synthesised from Enter or Space.
              onClick={(event) => choose(item, event.detail === 0)}
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

              <span className={cn("co-data mt-2.5 block max-w-full truncate", on ? "text-co-ink" : "text-co-muted-2")}>
                {item.short}
              </span>

              {on ? (
                <span className="mt-2 block border-t border-co-border pt-3">
                  <span className="block font-display text-[clamp(16px,1.5vw,20px)] font-semibold leading-[1.2] tracking-[-0.02em]">
                    {item.name}
                  </span>
                  <span className="co-data mt-2 block text-co-muted-2">{facts}</span>
                  <span className="co-data mt-2 block text-co-ink">
                    Shown above <span aria-hidden>↑</span>
                  </span>
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
