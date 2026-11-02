"use client";

import { useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ImageLightbox, type LightboxItem } from "@/components/common/image-lightbox";
import { DimensionLine } from "@/components/ui/dimension-line";
import { TickNumber } from "@/components/ui/tick-number";
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

  return (
    <div className="group">
      {/* `data-viewer-frame`: where the configuration picker flies a chosen render to. */}
      <div
        data-viewer-frame
        className={cn(
          "relative aspect-[16/10] overflow-hidden bg-co-bg",
          webglOk && "cursor-crosshair",
        )}
        onPointerEnter={() => setPointerActive(true)}
        onPointerLeave={() => setPointerActive(false)}
      >
        {/*
          Poster. Paints on the first frame and stays under the canvas: the scene suspends
          until every render in the series is on the GPU, and a machine without WebGL never
          gets a canvas at all. `co-cutout` multiplies the white of the render into the
          ivory canvas and feathers its edge — the same result the WebGL plate shader
          computes, so the hand-off from poster to canvas does not shift a pixel of colour.
        */}
        <Image
          src={config.image}
          alt={config.imageAlt}
          fill
          sizes="(min-width: 1024px) 58vw, 100vw"
          preload
          quality={90}
          className="co-cutout object-contain p-[6%]"
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

        {/*
          The dimension lines. Mounted, not faded: when they are switched on the rules are
          new `data-reveal` nodes, so the reveal observer draws them in at plotter speed.
          The length ticks when a new size is picked.
        */}
        {dimensionsOn ? (
          <div className="pointer-events-none absolute inset-0 z-[2] text-co-ink">
            <DimensionLine
              label={
                <>
                  {config.dia ? "Ø " : "W "}
                  <TickNumber value={length} />
                </>
              }
              className="absolute bottom-[9%] left-[8%] right-[12%]"
            />
            <DimensionLine
              axis="y"
              label={`H ${series.workingHeightMm}`}
              className="absolute bottom-[24%] right-[4%] top-[18%]"
            />
          </div>
        ) : null}

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
        Chrome under the render, not over it: a figure caption line in mono, with the two
        viewer controls at its end.
      */}
      <div className="mt-3 flex items-center gap-4 border-t border-co-border pt-3">
        <p className="co-data m-0 min-w-0 flex-1 truncate text-co-muted-2">
          Fig. 02 — {config.code}
        </p>
        <span
          aria-hidden
          className={cn(
            "co-data hidden shrink-0 items-center gap-1.5 sm:flex",
            pointerActive ? "text-co-ink" : "text-co-muted-2",
          )}
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
            <path d="M4.5 1H1v3.5M7.5 1H11v3.5M4.5 11H1V7.5M7.5 11H11V7.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          Expand
        </span>
        <button
          type="button"
          onClick={toggleDimensions}
          aria-pressed={dimensionsOn}
          className={cn(
            "co-data shrink-0 border px-2.5 py-1 transition-colors",
            dimensionsOn ? "border-co-ink bg-co-ink text-co-bg" : "border-co-ink text-co-ink hover:bg-co-bg-alt",
          )}
        >
          Dimensions
        </button>
      </div>
    </div>
  );
}
