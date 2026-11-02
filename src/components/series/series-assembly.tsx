"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { optionsForSeries } from "@/lib/configurator";
import { selectedDepth, selectedLength } from "@/lib/series";
import { cn } from "@/lib/utils";
import { HEADER_HEIGHT, SERIES_BAR_HEIGHT } from "@/lib/layout";
import { SectionHeading } from "@/components/common/section-heading";
import { DimensionLine } from "@/components/ui/dimension-line";
import { FigureCaption } from "@/components/ui/figure-caption";
import { ProgressRail } from "@/components/ui/progress-rail";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow, seriesSectionNo } from "@/lib/series";
import { useWebglAvailable, WebglBoundary } from "./webgl-boundary";
import { ASSEMBLY_PARTS } from "./assembly-parts";

// WebGL only exists in the browser, and three must stay out of the server bundle.
const AssemblyScene = dynamic(() => import("./assembly-scene"), { ssr: false });

/** How many viewport heights the assembly is scrubbed over. Eight parts need room. */
const SCROLL_LENGTH = 5;

/**
 * Scroll-driven exploded assembly.
 *
 * The section is tall and its stage is sticky: scrolling through it scrubs the table
 * together from its parts rather than scrolling past a finished picture. Legs spiral in
 * first, the beam drops between them, the top descends onto the frame, then the screen
 * and the modesty panel.
 *
 * The geometry is sized from the configurator's live selection, so the table being
 * assembled is the one the viewer above is showing, at the millimetres the configuration
 * actually offers.
 */
export function SeriesAssembly() {
  const { series, config, selection } = useSeriesConfigurator();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const webglOk = useWebglAvailable();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let frame = 0;
    function update() {
      frame = 0;
      const element = sectionRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      // The stage is pinned for (SCROLL_LENGTH - 1) viewports; progress is how far
      // through that pinned run we are.
      const scrubbable = rect.height - window.innerHeight;
      if (scrubbable <= 0) return;
      const travelled = Math.min(Math.max(-rect.top, 0), scrubbable);
      setProgress(travelled / scrubbable);
    }

    function onScroll() {
      // Coalesce to one update per frame: scroll fires far more often than we can paint.
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  // The canvas renders only while the section is in view: a pinned WebGL stage that
  // keeps drawing after you have scrolled past it burns a core for nothing.
  const inView = progress > 0 && progress < 1;

  const options = optionsForSeries(series);
  const topFinish = options.finishes.find((finish) => finish.applies === "top");
  const frameFinish = options.finishes.find((finish) => finish.applies === "frame");

  /*
    Layout comes from the configuration, not from a fixed shape.

    A bench configuration is a back-to-back cluster: two rows of tops meeting on a shared
    spine, which is why the renders of "Bench · 4 Seaters" show four surfaces, screens
    crossing at the centre and straight legs down the middle. `lens`/`deps` describe one
    bay, so the cluster is that bay tiled — two rows deep by however many seats are in a
    row. Drawing every configuration as a single rectangle is what made the assembly look
    nothing like the product.
  */
  /*
    Which configuration is assembled.

    The specification leads with the 4-seater bench — it is the configuration the PDF
    photographs, details and gives a component schedule for, and the one the section's
    copy describes. So the assembly shows the bench the series defines rather than
    whatever single table the viewer above happens to be sitting on; the size selectors in
    the spec block still drive the size, which is what the customer is being quoted.
  */
  const benchConfig =
    series.configs.find((entry) => /bench|face to face/i.test(entry.name) && entry.seats === "4") ??
    series.configs.find((entry) => /bench|face to face/i.test(entry.name)) ??
    config;

  const isBench = /bench|face to face/i.test(benchConfig.name);
  const seatCount = Number.parseInt(benchConfig.seats, 10);
  const bays = isBench && Number.isFinite(seatCount) ? Math.max(1, Math.round(seatCount / 2)) : 1;

  /*
    Bench depth: per desk, not per cluster.

    The two specifications quote a face-to-face bench differently. PROS lists the depth of
    one desk (600/700/750), so the cluster is twice that. VARIDEX lists the depth across
    both rows (1200/1600) — the figure already spans the pair — so taking it as one row's
    depth doubled the cluster and made a long bench render nearly square.
  */
  const facesEachOther = /face to face/i.test(benchConfig.name);
  const rowDepth = isBench
    ? facesEachOther
      ? benchConfig.deps[0] / 2
      : benchConfig.deps[0]
    : (selectedDepth(selection) ?? selectedLength(selection));

  const widthMm = isBench ? benchConfig.lens[0] : selectedLength(selection);
  const depthMm = rowDepth;

  // The swatches carry CSS gradients, which three cannot read — the flat edge colour is
  // the honest single value for a material, and falls back to the spec's own tones.
  /*
    The two series are different products with different chassis, and the renders show it:
    PROS stands on tapered round tubes splayed outward in white, VARIDEX on straight
    rectangular posts in dark graphite tied by a perimeter rail. Drawing both the same way
    made the two collection pages show the same table.
  */
  const chassis = series.slug === "varidex" ? "straight-post" : "splayed-tube";

  const topColor = topFinish?.edge ?? "#DED5C1";
  // VARIDEX has no finish board, so its frame falls back to the graphite in its renders
  // rather than to PROS's white.
  const frameColor =
    frameFinish?.edge ?? (chassis === "straight-post" ? "#6E7175" : "#C9C6C0");

  const hasScreen =
    isBench ||
    options.accessories.some((entry) => /screen|felt/i.test(`${entry.name} ${entry.note}`));

  // Which part is landing right now, for the caption beside the stage.
  const activeIndex = ASSEMBLY_PARTS.reduce(
    (found, part, index) => (progress >= part.from ? index : found),
    0,
  );

  const parts = ASSEMBLY_PARTS.filter(
    (part) =>
      (part.key !== "screen" || hasScreen) && (part.key !== "mid" || isBench),
  );

  const sectionNo = seriesSectionNo(series, "assembly");
  // What the stage is showing decides what its caption names: the series' bench being
  // assembled, or — with no WebGL or with reduced motion — the studio render of the
  // configuration selected above.
  const showsScene = webglOk && !reduceMotion;
  const percent = Math.round(progress * 100);
  const fitted = parts.filter((part) => progress >= part.to).length;

  return (
    <section>
      <div className="co-shell pt-[clamp(64px,8vw,120px)]">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "assembly", "Assembly")}
          title={`${series.elements.length} components. ${isBench ? `${benchConfig.seats} desks.` : "One table."}`}
          blurb={`Scroll to build it. The legs, the bar, the tops and the screens are the numbered components on ${series.wordmark}'s own specification — drawn at the size you are being quoted, not a stand-in model.`}
          className="mb-0"
        />
      </div>

      <div ref={sectionRef} className="relative" style={{ height: `${SCROLL_LENGTH * 100}vh` }}>
        {/*
          The pinned stage stops short of the sticky enquiry bar. Without the reserved
          space the bar — which is `fixed`, so it is outside this flow — sat on top of the
          canvas and clipped the bottom of the model just as it assembled.

          `sticky` makes this an isolated group, so it carries the canvas colour itself:
          the fallback render multiplies its white into that rather than into nothing.
        */}
        <div
          className="sticky flex flex-col justify-center overflow-hidden bg-co-bg"
          style={{
            // Pinned below the fixed header and above the sticky bar, so neither covers the
            // stage or the part index.
            top: HEADER_HEIGHT,
            height: `calc(100svh - ${HEADER_HEIGHT + SERIES_BAR_HEIGHT}px)`,
          }}
        >
          <div className="co-shell grid w-full grid-cols-1 items-center gap-y-5 sm:gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.52fr)] lg:gap-x-[clamp(28px,4vw,72px)]">
            {/* Stage */}
            <figure className="order-1 min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 sm:gap-x-4">
                <div className="relative aspect-[16/10] w-full sm:aspect-[4/3] lg:aspect-[16/11]">
                  {showsScene ? (
                    <WebglBoundary
                      fallback={
                        <Image
                          src={config.image}
                          alt={config.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 62vw, 100vw"
                          className="co-cutout object-contain"
                        />
                      }
                    >
                      <AssemblyScene
                        active={inView}
                        progress={progress}
                        widthMm={widthMm}
                        depthMm={depthMm}
                        heightMm={series.workingHeightMm}
                        topColor={topColor}
                        frameColor={frameColor}
                        hasScreen={hasScreen}
                        chassis={chassis}
                        isBench={isBench}
                        bays={bays}
                      />
                    </WebglBoundary>
                  ) : (
                    /*
                      No WebGL, or the visitor asked for reduced motion: the studio render
                      says the same thing without a scrubbed animation or a canvas.
                    */
                    <Image
                      src={config.image}
                      alt={config.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 62vw, 100vw"
                      className="co-cutout object-contain"
                    />
                  )}
                </div>

                {/* Working height is fixed across the range — true of any table drawn here. */}
                <DimensionLine axis="y" label={`${series.workingHeightMm} H`} />
              </div>

              <FigureCaption n={sectionNo} className="mt-3">
                {showsScene ? `${benchConfig.name} · exploded` : config.name}
              </FigureCaption>
            </figure>

            {/* Part index */}
            <div className="order-2 min-w-0">
              <div
                aria-hidden
                className="co-eyebrow grid grid-cols-[28px_minmax(0,1fr)_auto_48px] gap-x-3 border-b border-co-ink px-2 pb-2.5"
              >
                <span>No.</span>
                <span>Part</span>
                <span>Ref.</span>
                <span />
              </div>

              <ol className="grid list-none gap-0 p-0">
                {parts.map((part, position) => {
                  const index = ASSEMBLY_PARTS.indexOf(part);
                  const done = progress >= part.to;
                  const active = index === activeIndex && !done;
                  return (
                    <li
                      key={part.key}
                      className={cn(
                        "grid grid-cols-[28px_minmax(0,1fr)_auto_48px] items-center gap-x-3 border-b border-co-border px-2 py-2 transition-colors duration-150 sm:py-3",
                        active && "bg-co-bg-alt",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "co-data transition-colors duration-150",
                          done || active ? "text-co-ink" : "text-co-muted-2",
                        )}
                      >
                        {String(position + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={cn(
                          "min-w-0 font-display text-[13px] font-semibold leading-[1.1] tracking-[-0.01em] transition-colors duration-150 sm:text-[15px]",
                          done || active ? "text-co-ink" : "text-co-muted-2",
                        )}
                      >
                        {part.label}
                      </span>
                      <span className="co-eyebrow">{part.ref !== "—" ? part.ref : ""}</span>
                      {/* Per-part rule, drawn in ink as the part lands — the list doubles as
                          the scrubber. The green is kept for the overall rail below. */}
                      <span aria-hidden className="block h-px w-12 bg-co-border">
                        <span
                          className="block h-px origin-left bg-co-ink transition-transform duration-200 motion-reduce:transition-none"
                          style={{
                            transform: `scaleX(${Math.min(
                              1,
                              Math.max(0, (progress - part.from) / (part.to - part.from)),
                            )})`,
                          }}
                        />
                      </span>
                    </li>
                  );
                })}
              </ol>

              {/* The one green thing in this view: how far the build has got. */}
              <ProgressRail
                step={percent}
                total={100}
                label={`${percent}% assembled · ${fitted} of ${parts.length} fitted`}
                className="mt-4 lg:mt-7"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
