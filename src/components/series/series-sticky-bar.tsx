"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { finishLabel, selectedParts } from "@/lib/series";
import { SERIES_BAR_HEIGHT } from "@/lib/layout";
import { DURATION_S, EASE_ENTER, EASE_EXIT, scrollToId } from "@/lib/motion";
import { useSeriesConfigurator } from "./series-context";

/**
 * The sticky quote bar — the last beat of the officemate structure.
 *
 * A fog strip on a hairline carrying the live selection in mono — configuration, size,
 * finish — and the quote action. It slides up from the bottom edge (transform only, no
 * fade, no blur) once the visitor has scrolled past the spec block, and leaves again when
 * the enquiry form is on screen. Right padding clears the WhatsApp button (z-50).
 *
 * The quote button is plain primary: the header's quote button already carries the
 * signal dots, and this bar is on screen at the same time.
 */
export function SeriesStickyBar({ visible }: { visible: boolean }) {
  const { config, size, selection } = useSeriesConfigurator();
  const finish = finishLabel(selection);

  const toEnquire = () => {
    scrollToId("enquire");
    history.pushState(null, "", "#enquire");
  };

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          style={{ height: SERIES_BAR_HEIGHT }}
          className="fixed bottom-0 left-0 right-0 z-40 border-t border-co-ink bg-co-bg-alt"
          initial={{ y: "100%" }}
          animate={{ y: 0, transition: { duration: DURATION_S.drawerIn, ease: EASE_ENTER } }}
          exit={{ y: "100%", transition: { duration: DURATION_S.drawerOut, ease: EASE_EXIT } }}
        >
          {/*
            Fixed height, matching `SERIES_BAR_HEIGHT`, because the assembly section
            reserves exactly that much room under its pinned stage.
          */}
          <div className="co-shell flex h-full items-center gap-4 pr-[76px] sm:pr-[84px] lg:pr-[96px]">
            {/*
              Two lines, then clipped. On a phone one truncated line held ~24 characters,
              so every configuration name ate the size after it; the 68px bar fits two
              lines of 11px mono, which shows the full name and size for most
              configurations. The full selection is always in the spec block above.
            */}
            <p className="co-data line-clamp-2 min-w-0 flex-1">
              {config.name} · {size}
              {finish ? <span className="hidden text-co-muted-2 md:inline"> · {finish} top</span> : null}
            </p>
            <span className="co-data hidden text-co-muted-2 lg:block">{selectedParts(selection).code}</span>
            <Button type="button" size="sm" onClick={toEnquire}>
              Get a quote
            </Button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
