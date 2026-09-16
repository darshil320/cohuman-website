"use client";

import { AnimatePresence, motion } from "framer-motion";
import { SERIES_BAR_HEIGHT } from "@/lib/layout";
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
          style={{ height: SERIES_BAR_HEIGHT }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-co-panel-border bg-co-panel/95 backdrop-blur-md"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.9, 0.25, 1] }}
        >
          {/*
            Fixed height, matching `SERIES_BAR_HEIGHT`, because the assembly section
            reserves exactly that much room under its pinned stage. A bar that grows with
            its content would start clipping the 3D model again.
          */}
          <div className="mx-auto flex h-full max-w-[1320px] items-center gap-3 px-[18px] pr-[76px] sm:gap-4 sm:px-6 sm:pr-[86px] lg:px-11 lg:pr-[96px]">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-co-panel-faint">
                Specifying {series.wordmark}
              </p>
              <p className="mt-1 truncate text-[14px] font-medium text-co-panel-fg">
                {config.name} — {size}
              </p>
            </div>
            <span className="hidden font-mono text-[13px] text-co-panel-faint sm:block">
              {config.code}
            </span>
            <a
              href="#enquire"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#enquire')?.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, '', '#enquire');
              }}
              className="shrink-0 whitespace-nowrap bg-co-bg px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-co-ink transition-colors hover:bg-co-bg-alt"
            >
              Enquire
            </a>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
