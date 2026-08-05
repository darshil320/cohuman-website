"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSeriesConfigurator } from "./series-context";

/**
 * Bottom bar echoing the live selection. Sits at z-40 with right padding so it passes
 * behind the WhatsApp button (z-50, bottom-right) rather than fighting it, and is
 * hidden once the enquiry form is on screen — at that point it is redundant and would
 * overlap the footer.
 */
export function SeriesStickyBar({ visible }: { visible: boolean }) {
  const { series, config, size } = useSeriesConfigurator();

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-40 bg-co-panel/95 backdrop-blur-md"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.9, 0.25, 1] }}
        >
          <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-[18px] py-3 pr-[86px] sm:px-6 lg:px-11 lg:pr-[96px]">
            <div className="min-w-0 flex-1">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-co-panel-faint">
                Specifying {series.wordmark}
              </p>
              <p className="truncate text-[14.5px] font-medium text-co-panel-fg">
                {config.name} — {size}
              </p>
            </div>
            <span className="hidden font-mono text-[13px] text-co-panel-faint sm:block">
              {config.code}
            </span>
            <a
              href="#enquire"
              className="shrink-0 whitespace-nowrap bg-co-green px-5 py-3 text-[14.5px] font-semibold text-co-cta-green-ink transition-colors hover:bg-co-bg hover:text-co-ink"
            >
              Enquire
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
