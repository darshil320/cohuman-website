"use client";

import { MotionConfig } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { SeriesDefinition } from "@/lib/series";
import { SeriesAnatomy } from "./series-anatomy";
// Assembly section hidden on client request — uncomment this import, the <SeriesAssembly />
// line below and "assembly" in SECTION_ORDER (src/lib/series/sections.ts) to bring it back.
// import { SeriesAssembly } from "./series-assembly";
import { SeriesConfigGallery } from "./series-config-gallery";
import { SeriesEnquire } from "./series-enquire";
import { SeriesGalleryStrip } from "./series-gallery";
import { SeriesNameHero } from "./series-name-hero";
import { SeriesPager } from "./series-pager";
import { SeriesProvider } from "./series-context";
import { SeriesSpecBlock } from "./series-spec-block";
import { SeriesStickyBar } from "./series-sticky-bar";

/**
 * The page, in officemate's order — the moodboard's "kept beat for beat":
 *
 *   A  name hero          SeriesNameHero (breadcrumb) + SeriesNameHeading, which opens
 *                         the spec block's left column, beside the panel
 *   B  ink spec block     SeriesSpecBlock (+ the viewer and the configuration picker)
 *   C  gallery            SeriesConfigGallery
 *      the drawing set    anatomy, products — the series' own spec data. The element
 *                         set, the finish board and the wire-channel table were cut in
 *                         the Nov 2026 review: the catalogue carries finishes on one
 *                         shared page, and has no element or accessory tables.
 *   D  prev / all / next  SeriesPager
 *      enquiry            SeriesEnquire
 *      sticky quote bar   SeriesStickyBar
 */
function SeriesPdpBody() {
  const enquireRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  // The bar appears once the spec block — which has its own quote action — has scrolled
  // away, and leaves as soon as the prev / all / next strip comes up: that strip carries
  // its own quote button, so the two never share the bottom of the screen.
  useEffect(() => {
    function update() {
      const spec = document.querySelector("#specification");
      const pastSpec = spec ? spec.getBoundingClientRect().bottom < 0 : window.scrollY > 640;
      const handoff = document.querySelector("#pager") ?? enquireRef.current;
      const reachedHandoff = handoff
        ? handoff.getBoundingClientRect().top < window.innerHeight - 24
        : false;
      setBarVisible(pastSpec && !reachedHandoff);
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div>
      <SeriesNameHero />
      <SeriesSpecBlock />
      <SeriesConfigGallery />

      {/* <SeriesAssembly /> — hidden, see the import note above. */}
      <SeriesAnatomy />
      <SeriesGalleryStrip />

      <SeriesPager />

      <div ref={enquireRef}>
        <SeriesEnquire />
      </div>

      <SeriesStickyBar visible={barVisible} />
    </div>
  );
}

/**
 * Product page for a desking series. One client boundary: every section reads the same
 * configurator state, so the viewer, the spec block, the sticky bar and the enquiry
 * payload can never disagree about what is being specified.
 *
 * Sections that a series does not define (finish board, accessory table, gallery strip)
 * return null rather than being wired per route.
 */
export function SeriesPdp({ series }: { series: SeriesDefinition }) {
  return (
    // reducedMotion="user" lets motion itself drop transform animations when the OS asks
    // for it, so no component has to branch on a media query and risk a hydration
    // mismatch. The WebGL tilt reads the preference directly — see series-stage.tsx.
    <MotionConfig reducedMotion="user">
      <SeriesProvider series={series}>
        <SeriesPdpBody />
      </SeriesProvider>
    </MotionConfig>
  );
}
