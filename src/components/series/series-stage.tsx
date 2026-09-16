"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageLightbox, type LightboxItem } from "@/components/common/image-lightbox";
import { selectedLength } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { useWebglAvailable, WebglBoundary } from "./webgl-boundary";

// WebGL only exists in the browser, and three should not be in the server bundle.
const SeriesStageScene = dynamic(() => import("./series-stage-scene"), { ssr: false });

export function SeriesStage() {
  const { series, config, selection, dimensionsOn, toggleDimensions, pickConfigBySlug } =
    useSeriesConfigurator();
  const reduceMotion = useReducedMotion();
  const [pointerActive, setPointerActive] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const webglOk = useWebglAvailable();

  // Every render in the series stays resident on the GPU, so switching configuration is
  // a dissolve rather than a fetch. Several configurations legitimately share one render.
  const sources = useMemo(
    () => Array.from(new Set(series.configs.map((c) => c.image))),
    [series],
  );

  // One entry per distinct render, so paging the viewer never shows the same photograph
  // twice for two configurations the manufacturer photographed once.
  const shots = useMemo(() => {
    const seen = new Map<string, { slug: string; item: LightboxItem }>();
    for (const item of series.configs) {
      if (seen.has(item.image)) continue;
      seen.set(item.image, {
        slug: item.slug,
        item: { src: item.image, alt: item.imageAlt, caption: `${item.name} · ${item.code}` },
      });
    }
    return [...seen.values()];
  }, [series]);

  const shotIndex = Math.max(
    0,
    shots.findIndex((shot) => shot.item.src === config.image),
  );

  const length = selectedLength(selection);
  const widthLabel = config.dia ? `Ø ${length}` : `W ${length}`;

  return (
    <div className="group">
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden bg-white",
        webglOk && "cursor-crosshair",
      )}
      onPointerEnter={() => setPointerActive(true)}
      onPointerLeave={() => setPointerActive(false)}
    >
      {/*
        Poster. Paints on the first frame and stays under the canvas: the scene suspends
        until every render in the series is on the GPU, and a machine without WebGL never
        gets a canvas at all. The canvas is opaque (`alpha: false`) so it covers this
        once it starts drawing.
      */}
      <Image
        src={config.image}
        alt={config.imageAlt}
        fill
        sizes="(min-width: 1024px) 62vw, 100vw"
        preload
        // The renders are shot on white, so multiply drops their background into the
        // studio sweep instead of laying a white panel over it.
        className="object-contain p-[6%] mix-blend-multiply"
      />

      {webglOk ? (
        <WebglBoundary fallback={null}>
          <SeriesStageScene
            sources={sources}
            activeSrc={config.image}
            tilt={!reduceMotion}
            pointerActive={pointerActive}
          />
        </WebglBoundary>
      ) : null}

      {/*
        Sits over the render and under the chrome below it, so the whole picture opens the
        viewer while the corner controls keep their own hit areas.
      */}
      <button
        type="button"
        aria-label={`Open ${config.name} at full size`}
        onClick={() => setLightboxOpen(true)}
        className="absolute inset-0 z-[1] cursor-zoom-in"
      />

      <AnimatePresence>
        {dimensionsOn ? (
          <motion.div
            key="dimensions"
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <span className="absolute bottom-[13%] left-[8%] right-[8%] h-px bg-co-ink/45" />
            <span className="absolute bottom-[13%] left-[8%] h-3.5 w-px -translate-y-[7px] bg-co-ink/45" />
            <span className="absolute bottom-[13%] right-[8%] h-3.5 w-px -translate-y-[7px] bg-co-ink/45" />
            <span className="absolute bottom-[13%] left-1/2 -translate-x-1/2 translate-y-[11px] whitespace-nowrap bg-white px-2 text-[11px] font-semibold tracking-[0.1em] text-co-ink">
              {widthLabel}
            </span>
            <span className="absolute bottom-[32%] right-[5.5%] top-[20%] w-px bg-co-ink/45" />
            <span className="absolute right-[5.5%] top-[20%] h-px w-3 -translate-x-[5.5px] bg-co-ink/45" />
            <span className="absolute bottom-[32%] right-[5.5%] h-px w-3 -translate-x-[5.5px] bg-co-ink/45" />
            <span className="absolute right-[5.5%] top-1/2 -translate-x-[calc(100%+7px)] -translate-y-1/2 whitespace-nowrap bg-white px-2 text-[11px] font-semibold tracking-[0.1em] text-co-ink">
              H {series.workingHeightMm}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ImageLightbox
        items={shots.map((shot) => shot.item)}
        index={shotIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        // Paging the viewer drives the configurator, so closing it leaves the page on
        // the configuration you were last looking at.
        onIndexChange={(next) => pickConfigBySlug(shots[next].slug)}
      />
    </div>

    {/*
      Chrome under the render, not over it. The renders are shot on white and composite
      with `mix-blend-multiply`, so any label laid on the frame either needs a plate
      behind it — which puts the card back — or disappears into the sweep.
    */}
    <div className="mt-3.5 flex items-center gap-3 border-t border-co-border pt-3 sm:gap-4">
      <p className="m-0 min-w-0 flex-1 truncate font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-co-placeholder">
        {config.code}
      </p>

      <span
        aria-hidden
        className={cn(
          // Always legible on touch, where there is no hover to discover it with; on a
          // pointer device it stays quiet until you go looking.
          "hidden shrink-0 items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.16em] transition-colors duration-200 sm:flex",
          pointerActive ? "text-co-ink" : "text-co-placeholder",
        )}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 1H1v3.5M7.5 1H11v3.5M4.5 11H1V7.5M7.5 11H11V7.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        Expand
      </span>

      <button
        type="button"
        onClick={toggleDimensions}
        aria-pressed={dimensionsOn}
        className={cn(
          "shrink-0 text-[10.5px] font-semibold uppercase tracking-[0.16em] underline-offset-[5px] transition-colors hover:text-co-ink",
          dimensionsOn ? "text-co-ink underline" : "text-co-placeholder",
        )}
      >
        Dimensions
      </button>
    </div>
    </div>
  );
}
