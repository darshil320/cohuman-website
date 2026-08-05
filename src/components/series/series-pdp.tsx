"use client";

import { MotionConfig } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SeriesDefinition } from "@/lib/series";
import { SeriesAccessory } from "./series-accessory";
import { SeriesAnatomy } from "./series-anatomy";
import { SeriesConfigRail } from "./series-config-rail";
import { SeriesElements } from "./series-elements";
import { SeriesEnquire } from "./series-enquire";
import { SeriesFinishes } from "./series-finishes";
import { SeriesGalleryStrip } from "./series-gallery";
import { SeriesProvider, useSeriesConfigurator } from "./series-context";
import { SeriesSizeChart } from "./series-size-chart";
import { SeriesSpecPanel } from "./series-spec-panel";
import { SeriesStage } from "./series-stage";
import { SeriesStickyBar } from "./series-sticky-bar";
import { Reveal } from "@/components/ui/scroll-reveal";

/** Scroll distance before the sticky bar is worth showing. */
const BAR_REVEAL_OFFSET = 320;

function SeriesPdpBody() {
  const { series } = useSeriesConfigurator();
  const enquireRef = useRef<HTMLDivElement>(null);
  const [barVisible, setBarVisible] = useState(false);

  useEffect(() => {
    function update() {
      const reachedEnquire = enquireRef.current
        ? window.scrollY + window.innerHeight > enquireRef.current.offsetTop + 120
        : false;
      setBarVisible(window.scrollY > BAR_REVEAL_OFFSET && !reachedEnquire);
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
      <section className="border-b border-co-border">
        <div className="mx-auto max-w-[1320px] px-[18px] pb-[clamp(34px,4vw,56px)] pt-[clamp(20px,3vw,40px)] sm:px-6 lg:px-11">
          <Reveal>
            <nav
              aria-label="Breadcrumb"
              className="mb-[clamp(18px,2.4vw,30px)] flex items-center gap-2 overflow-hidden whitespace-nowrap text-[12.5px] text-co-faint"
            >
              <Link href="/catalog" className="hover:text-co-ink">
                Catalog
              </Link>
              <span aria-hidden>/</span>
              <Link href="/collections" className="hover:text-co-ink">
                Collections
              </Link>
              <span aria-hidden>/</span>
              <span className="font-medium text-co-ink">{series.name}</span>
            </nav>
          </Reveal>

          <div className="grid items-start gap-[clamp(26px,3.4vw,54px)] lg:grid-cols-[minmax(0,1.32fr)_minmax(300px,0.68fr)]">
            <Reveal className="min-w-0" delay={0.1}>
              <SeriesStage />
              <SeriesConfigRail />
            </Reveal>
            <Reveal delay={0.2}>
              <SeriesSpecPanel />
            </Reveal>
          </div>
        </div>
      </section>

      <SeriesElements />
      <SeriesAnatomy />
      <SeriesFinishes />
      <SeriesAccessory />
      <SeriesGalleryStrip />
      <SeriesSizeChart />

      <div ref={enquireRef}>
        <SeriesEnquire />
      </div>

      <SeriesStickyBar visible={barVisible} />
    </div>
  );
}

/**
 * Product page for a desking series. One client boundary: every section reads the same
 * configurator state, so the viewer, the size chart, the sticky bar and the enquiry
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
