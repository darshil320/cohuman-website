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

const CORNERS = [
  "left-[18px] top-[18px] border-l border-t",
  "right-[18px] top-[18px] border-r border-t",
  "left-[18px] bottom-[18px] border-l border-b",
  "right-[18px] bottom-[18px] border-r border-b",
];

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
    <div
      className={cn(
        "group relative aspect-[16/10] overflow-hidden border border-co-card-border",
        "bg-white",
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
        priority
        // The renders are shot on white, so multiply drops their background into the
        // studio sweep instead of laying a white panel over it.
        className="object-contain p-[4%] mix-blend-multiply"
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

      {CORNERS.map((position) => (
        <span
          key={position}
          className={`pointer-events-none absolute z-[2] h-[22px] w-[22px] border-co-border-strong ${position}`}
        />
      ))}

      <span
        aria-hidden
        className={cn(
          // Always offered on touch, where there is no hover to discover it with; on a
          // pointer device it stays out of the frame until you go looking.
          "pointer-events-none absolute right-0 top-0 z-[2] flex items-center gap-1.5 border-b border-l border-co-card-border bg-co-bg/85 px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100",
          pointerActive ? "text-co-ink" : "text-co-faint",
        )}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
          <path
            d="M4.5 1H1v3.5M7.5 1H11v3.5M4.5 11H1V7.5M7.5 11H11V7.5"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        Expand
      </span>

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
            <span className="absolute bottom-[13%] left-[8%] right-[8%] h-px bg-co-green" />
            <span className="absolute bottom-[13%] left-[8%] h-4 w-px -translate-y-2 bg-co-green" />
            <span className="absolute bottom-[13%] right-[8%] h-4 w-px -translate-y-2 bg-co-green" />
            <span className="absolute bottom-[13%] left-1/2 -translate-x-1/2 translate-y-[13px] whitespace-nowrap bg-co-green px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.06em] text-co-cta-green-ink">
              {widthLabel}
            </span>
            <span className="absolute bottom-[32%] right-[5.5%] top-[20%] w-px bg-co-green" />
            <span className="absolute right-[5.5%] top-[20%] h-px w-3.5 -translate-x-[6.5px] bg-co-green" />
            <span className="absolute bottom-[32%] right-[5.5%] h-px w-3.5 -translate-x-[6.5px] bg-co-green" />
            <span className="absolute right-[5.5%] top-1/2 -translate-x-[calc(100%+9px)] -translate-y-1/2 whitespace-nowrap bg-co-ink px-2.5 py-1 text-[11.5px] font-semibold tracking-[0.06em] text-co-bg">
              H {series.workingHeightMm}
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <p className="absolute bottom-0 left-0 z-[2] m-0 border-r border-t border-co-card-border bg-co-bg/85 px-4 py-2.5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.1em] text-co-faint backdrop-blur-sm">
        {config.code}
      </p>

      <button
        type="button"
        onClick={toggleDimensions}
        aria-pressed={dimensionsOn}
        className={cn(
          "absolute bottom-0 right-0 z-[2] border-l border-t border-co-card-border bg-co-bg/85 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition-colors hover:text-co-ink",
          dimensionsOn ? "text-co-green" : "text-co-faint",
        )}
      >
        Dimensions
      </button>

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
  );
}
