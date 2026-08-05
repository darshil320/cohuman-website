"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useMemo, useState } from "react";
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
  const { series, config, selection, dimensionsOn, toggleDimensions } = useSeriesConfigurator();
  const reduceMotion = useReducedMotion();
  const [pointerActive, setPointerActive] = useState(false);
  const webglOk = useWebglAvailable();

  // Every render in the series stays resident on the GPU, so switching configuration is
  // a dissolve rather than a fetch. Several configurations legitimately share one render.
  const sources = useMemo(
    () => Array.from(new Set(series.configs.map((c) => c.image))),
    [series],
  );

  const length = selectedLength(selection);
  const widthLabel = config.dia ? `Ø ${length}` : `W ${length}`;


  return (
    <div
      className={cn(
        "relative aspect-[16/10] overflow-hidden border border-co-card-border",
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

      {CORNERS.map((position) => (
        <span
          key={position}
          className={`pointer-events-none absolute h-[22px] w-[22px] border-co-border-strong ${position}`}
        />
      ))}

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

      <p className="absolute bottom-0 left-0 m-0 border-r border-t border-co-card-border bg-co-bg/85 px-4 py-2.5 font-mono text-[11.5px] font-semibold uppercase tracking-[0.1em] text-co-faint backdrop-blur-sm">
        {config.code}
      </p>

      <button
        type="button"
        onClick={toggleDimensions}
        aria-pressed={dimensionsOn}
        className={cn(
          "absolute bottom-0 right-0 border-l border-t border-co-card-border bg-co-bg/85 px-4 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm transition-colors hover:text-co-ink",
          dimensionsOn ? "text-co-green" : "text-co-faint",
        )}
      >
        Dimensions
      </button>
    </div>
  );
}
