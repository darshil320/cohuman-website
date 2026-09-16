"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";

/** Two-digit ordinal, so the counter never jumps width as it counts. */
function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function SeriesConfigRail() {
  const { series, config, finish, setFinish, visibleConfigs, pickConfig } =
    useSeriesConfigurator();
  const filters = series.finishFilters;
  const position = visibleConfigs.indexOf(config) + 1;

  return (
    <div>
      <div className="mb-4 mt-6 flex flex-wrap items-center gap-x-4 gap-y-2.5 border-t border-co-border pt-5">
        {filters ? (
          <>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-co-placeholder">
              Top finish
            </span>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {filters.map((filter) => {
                const on = finish === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFinish(filter.key)}
                    className={cn(
                      // Text switch, not a chip: the swatch carries the colour and the
                      // underline carries the state, so nothing here reads as a card.
                      "flex items-center gap-2 py-0.5 text-[12.5px] font-medium underline-offset-[6px] transition-colors",
                      on ? "text-co-ink underline" : "text-co-placeholder hover:text-co-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className="block h-[10px] w-[10px] rounded-full"
                      style={{ background: filter.swatch }}
                    />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-co-placeholder">
            Configurations
          </span>
        )}
        <span className="ml-auto font-mono text-[11px] tabular-nums text-co-placeholder">
          {/* A finish filter can hide the configuration that is currently selected, and
              indexOf would then read -1 — show the count alone rather than "00 / 14". */}
          {position > 0 ? `${pad(position)} / ` : ""}
          {pad(visibleConfigs.length)}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-x-3 gap-y-4">
        {visibleConfigs.map((item) => {
          const on = item.slug === config.slug;
          return (
            <motion.button
              key={item.slug}
              type="button"
              title={item.name}
              aria-pressed={on}
              onClick={() => pickConfig(series.configs.indexOf(item))}
              animate={{ opacity: on ? 1 : 0.42 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="group relative block bg-transparent p-0 text-left"
            >
              <span className="relative block aspect-[4/3] w-full overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="140px"
                  className="object-contain mix-blend-multiply"
                />
              </span>
              {/* State lives on a 1px rule under the thumbnail — no frame, no fill. */}
              <span
                aria-hidden
                className={cn(
                  "mt-2 block h-px w-full origin-left transition-transform duration-300",
                  on ? "scale-x-100 bg-co-ink" : "scale-x-100 bg-co-border group-hover:bg-co-ink",
                )}
              />
              <span
                className={cn(
                  "mt-1.5 block text-[9.5px] font-semibold uppercase leading-tight tracking-[0.13em] transition-colors",
                  on ? "text-co-ink" : "text-co-placeholder",
                )}
              >
                {item.short}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
