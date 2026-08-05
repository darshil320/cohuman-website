"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";

export function SeriesConfigRail() {
  const { series, config, finish, setFinish, visibleConfigs, pickConfig } =
    useSeriesConfigurator();
  const filters = series.finishFilters;

  return (
    <div>
      <div className="my-3.5 flex flex-wrap items-center gap-3">
        {filters ? (
          <>
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
              Top finish
            </span>
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filter) => {
                const on = finish === filter.key;
                return (
                  <button
                    key={filter.key}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setFinish(filter.key)}
                    className={cn(
                      "flex items-center gap-2 border px-3 py-1.5 text-[12.5px] font-semibold transition-colors",
                      on
                        ? "border-co-ink bg-co-ink text-co-bg"
                        : "border-co-border-strong bg-transparent text-co-muted hover:border-co-ink",
                    )}
                  >
                    <span
                      aria-hidden
                      className="block h-[11px] w-[11px] border border-co-ink/20"
                      style={{ background: filter.swatch }}
                    />
                    {filter.label}
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
            Configurations
          </span>
        )}
        <span className="ml-auto text-xs font-light text-co-placeholder">
          {visibleConfigs.length} configurations
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(94px,1fr))] gap-2">
        {visibleConfigs.map((item) => {
          const on = item.slug === config.slug;
          return (
            <motion.button
              key={item.slug}
              type="button"
              title={item.name}
              aria-pressed={on}
              onClick={() => pickConfig(series.configs.indexOf(item))}
              animate={{ y: on ? -3 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={cn(
                "relative aspect-[4/3] overflow-hidden border p-0 transition-colors",
                on
                  ? "border-co-ink bg-white shadow-[0_10px_22px_-14px_rgba(31,35,40,0.45)]"
                  : "border-co-card-border bg-co-bg-alt hover:border-co-ink",
              )}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="140px"
                className={cn("object-contain p-1 mix-blend-multiply", on ? "opacity-100" : "opacity-70")}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 px-1 py-0.5 text-left text-[9px] font-semibold uppercase leading-tight tracking-[0.06em]",
                  on ? "bg-co-ink text-co-bg" : "bg-co-bg/80 text-co-faint",
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
