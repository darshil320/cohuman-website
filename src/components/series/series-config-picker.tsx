"use client";

import Image from "next/image";
import { Field } from "@/components/configurator/configurator-controls";
import { FinishChip } from "@/components/ui/finish-chip";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";

/**
 * The configuration picker, directly under the viewer (client, Nov 2026): every
 * configuration as one small thumbnail in a plain grid — no carousel, no scrolling strip.
 * Clicking one swaps the viewer's image in place; nothing flies, the page does not move.
 *
 * Selected = ink frame, an ink bar and `aria-pressed`. No green: the spec block's
 * progress rail is this configurator's one green thing. The finish chips under the grid
 * are a filter, not a finish choice, and are labelled so.
 */
export function SeriesConfigPicker() {
  const { series, config, finish, setFinish, visibleConfigs, pickConfig } = useSeriesConfigurator();
  const filters = series.finishFilters;
  const codeFor = (label: string) => series.swatches?.find((swatch) => swatch.name === label)?.code;

  return (
    <div id="configurations" className="mt-6 scroll-mt-[96px]">
      <p className="co-eyebrow">Configurations — pick one to see it above</p>

      {visibleConfigs.length === 0 ? (
        <p className="co-data mt-4 py-6 text-co-muted-2">
          No configuration is photographed in this finish — choose All to see every one.
        </p>
      ) : (
        <div
          role="group"
          aria-label={`${series.wordmark} configurations`}
          className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6"
        >
          {visibleConfigs.map((item) => {
            const on = item.slug === config.slug;
            return (
              <button
                key={item.slug}
                type="button"
                title={item.name}
                aria-pressed={on}
                aria-label={`${item.name}${on ? ", shown above" : ""}`}
                onClick={() => pickConfig(series.configs.indexOf(item))}
                className={cn(
                  "co-hit group relative flex min-w-0 flex-col border bg-co-bg p-2 text-left transition-colors duration-(--duration-press)",
                  on ? "border-co-ink" : "border-co-border hover:border-co-ink hover:bg-co-bg-alt",
                )}
              >
                <span className="relative block h-[64px] w-full sm:h-[72px]">
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 160px, 33vw"
                    className="co-cutout object-contain"
                  />
                </span>
                <span
                  className={cn(
                    "co-data mt-2 block min-h-[2lh] leading-[1.3]",
                    on ? "text-co-ink" : "text-co-muted-2 group-hover:text-co-ink",
                  )}
                >
                  {item.short}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-co-ink transition-transform duration-300 ease-(--ease-enter)",
                    on ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </button>
            );
          })}
        </div>
      )}

      {filters ? (
        <Field label="Filter by top finish" className="mt-6">
          <div
            role="group"
            aria-label="Filter configurations by top finish"
            className="flex flex-wrap items-start gap-3.5"
          >
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
  );
}
