"use client";

import { motion, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { SpecRows } from "@/components/ui/spec-rows";
import { HEADER_HEIGHT } from "@/lib/layout";
import type { SeriesPartFocus } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow } from "@/lib/series";

/**
 * Numbered part list beside the reference render.
 *
 * Two rules hold this section honest. First, the stage takes its aspect ratio from the
 * render itself, so a part's `focus` percentages address the photograph and not a
 * letterboxed box around it. Second, a part is only marked on the image when that exact
 * component is identifiable in the render — the beams and channels that live inside the
 * assembly get no marker and no camera move, and the stage says why.
 *
 * The camera is a single critically damped spring on scale + translate. It starts from
 * wherever it currently is, so re-selecting mid-flight redirects rather than restarts.
 *
 * The render is a cut-out on white, and the camera layer is transformed — which makes it
 * an isolated group, so `multiply` would only see what is inside it. The layer therefore
 * carries the canvas colour itself, and the white of the render drops into that.
 */

/** Push-in: critically damped, because the eye is trying to read the thing it lands on. */
const CAMERA = { type: "spring", bounce: 0, duration: 0.72 } as const;
/** How far the render drifts under a mouse while pushed in, in pixels. */
const PARALLAX_PX = 22;
const PARALLAX_SPRING = { stiffness: 130, damping: 26, mass: 0.7 } as const;

/**
 * State-driven text (the part's label, its detail) wipes in left to right rather than
 * fading — the same `co-wipe` keyframes as the scroll reveals. Off under reduced motion.
 */
const WIPE_IN = "animate-[co-wipe_320ms_linear] motion-reduce:animate-none";

/** The sticky stage clears the fixed header by this much on wide screens. */
const STAGE_TOP_GAP = 24;

/** Number → part → group, shared by the list header and its rows. */
const PART_GRID = "grid grid-cols-[28px_minmax(0,1fr)_auto] items-center gap-x-4";

interface CameraFrame {
  scale: number;
  x: string;
  y: string;
}

const WIDE: CameraFrame = { scale: 1, x: "0%", y: "0%" };

function cameraFrame(focus: SeriesPartFocus | undefined, pushed: boolean): CameraFrame {
  if (!focus || !pushed) return WIDE;
  const { zoom } = focus;
  // `translate(x) scale(z)` sends a point at f% of the frame to z·(f − 50) + x, so
  // centring it wants x = z·(50 − f). Clamping at ±(z − 1)·50 keeps the render's own
  // edge outside the stage, so no empty gutter can ever slide into view — a part close
  // to an edge therefore lands off-centre rather than dragging the frame past it.
  const limit = (zoom - 1) * 50;
  const clamp = (value: number) => Math.min(limit, Math.max(-limit, value));
  return {
    scale: zoom,
    x: `${clamp(zoom * (50 - focus.x))}%`,
    y: `${clamp(zoom * (50 - focus.y))}%`,
  };
}

export function SeriesAnatomy() {
  const { series, partIndex, setPart } = useSeriesConfigurator();
  const part = series.parts[partIndex];
  const section = series.anatomySection;
  const { w, h } = series.anatomyImageSize;

  const [pushed, setPushed] = useState(false);
  const reduceMotion = useReducedMotion();
  const driftX = useSpring(0, PARALLAX_SPRING);
  const driftY = useSpring(0, PARALLAX_SPRING);

  const frame = cameraFrame(part.focus, pushed);
  const pushedIn = pushed && Boolean(part.focus);

  const pickPart = useCallback(
    (index: number) => {
      setPart(index);
      setPushed(Boolean(series.parts[index]?.focus));
    },
    [series.parts, setPart],
  );

  const pullBack = useCallback(() => {
    setPushed(false);
    driftX.set(0);
    driftY.set(0);
  }, [driftX, driftY]);

  const drift = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!pushedIn || reduceMotion || event.pointerType !== "mouse") return;
      const box = event.currentTarget.getBoundingClientRect();
      driftX.set(((event.clientX - box.left) / box.width - 0.5) * -2 * PARALLAX_PX);
      driftY.set(((event.clientY - box.top) / box.height - 0.5) * -2 * PARALLAX_PX);
    },
    [driftX, driftY, pushedIn, reduceMotion],
  );

  const settle = useCallback(() => {
    driftX.set(0);
    driftY.set(0);
  }, [driftX, driftY]);

  return (
    <section id="anatomy" className="co-section scroll-mt-[72px]">
      <div className="co-shell">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "anatomy", section.eyebrow)}
          title={section.heading}
          blurb={section.blurb}
        />

        <div className="grid items-start gap-[clamp(28px,3.4vw,56px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <figure className="min-w-0 lg:sticky" style={{ top: HEADER_HEIGHT + STAGE_TOP_GAP }}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3 sm:gap-x-4">
              <div
                className="relative select-none overflow-hidden bg-co-bg"
                style={{ aspectRatio: `${w} / ${h}` }}
                onPointerMove={drift}
                onPointerLeave={settle}
              >
                <motion.div className="absolute inset-0" style={{ x: driftX, y: driftY }}>
                  <motion.div
                    className="absolute inset-0 bg-co-bg"
                    animate={{ scale: frame.scale, x: frame.x, y: frame.y }}
                    transition={CAMERA}
                    style={{ transformOrigin: "50% 50%" }}
                  >
                    {/* Asks for the render at its full width rather than at the stage's:
                        the camera pushes past 3×, and a stage-width source falls apart.
                        The wipe's clip-path sits on the image itself, so it never
                        isolates the multiply blend. */}
                    <Image
                      src={series.anatomyImage}
                      alt={series.anatomyCaption}
                      fill
                      sizes={`${w}px`}
                      quality={90}
                      data-reveal
                      className="co-cutout co-reveal object-cover"
                    />

                    {series.parts.map((item, index) => {
                      if (!item.focus) return null;
                      const active = index === partIndex;
                      // Pushed in, the frame belongs to one part: the rest would be numbers
                      // floating over a crop they no longer describe.
                      if (pushedIn && !active) return null;
                      return (
                        <div
                          key={item.n}
                          className="absolute -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${item.focus.x}%`, top: `${item.focus.y}%` }}
                        >
                          {/* Counter-scaled against the camera so a marker is the same size
                              on screen at 1× and at 4.6×. */}
                          <motion.div
                            animate={{ scale: 1 / frame.scale }}
                            transition={CAMERA}
                            className="relative"
                          >
                            <button
                              type="button"
                              title={item.name}
                              aria-label={`Part ${item.n}: ${item.name}`}
                              aria-pressed={active}
                              onClick={() => pickPart(index)}
                              className={cn(
                                "co-data flex h-6 w-6 items-center justify-center border border-co-ink transition-colors duration-150 sm:h-7 sm:w-7",
                                active
                                  ? "bg-co-ink text-co-bg"
                                  : "bg-co-bg text-co-ink hover:bg-co-ink hover:text-co-bg",
                              )}
                            >
                              {item.n}
                            </button>
                            {active && pushedIn ? (
                              <span
                                className={cn(
                                  "co-data pointer-events-none absolute left-1/2 top-[32px] w-max max-w-[200px] -translate-x-1/2 truncate bg-co-ink px-2 py-1 text-co-bg sm:top-[38px]",
                                  WIPE_IN,
                                )}
                              >
                                {item.name}
                              </span>
                            ) : null}
                          </motion.div>
                        </div>
                      );
                    })}
                  </motion.div>
                </motion.div>

                <RegistrationCross className="left-2 top-2 text-co-ink" />
                <RegistrationCross className="right-2 top-2 text-co-ink" />
              </div>

            </div>

            <figcaption className="mt-3.5 border-t border-co-border pt-3">
              <span className="flex items-start gap-4">
                <span className="co-data min-w-0 flex-1 text-co-muted-2">{series.anatomyCaption}</span>
                {pushedIn ? (
                  <Button type="button" variant="link" onClick={pullBack} className="shrink-0">
                    Whole bench
                  </Button>
                ) : null}
              </span>

              {!part.focus ? (
                <span
                  key={part.n}
                  className={cn("mt-2.5 block max-w-[60ch] text-[13px] leading-[1.55] text-co-muted", WIPE_IN)}
                >
                  <span className="text-co-ink">{part.name}</span> sits inside the assembly —
                  quoted from the specification sheet, not visible in this render.
                </span>
              ) : !pushedIn ? (
                <span className="co-eyebrow pointer-events-none mt-2.5 block">
                  Tap a number to look closer
                </span>
              ) : null}
            </figcaption>
          </figure>

          <div className="min-w-0">
            <div aria-hidden className={cn(PART_GRID, "co-eyebrow border-b border-co-ink px-3 pb-3")}>
              <span>No.</span>
              <span>Part</span>
              <span>Group</span>
            </div>

            <ol className="list-none p-0">
              {series.parts.map((item, index) => {
                const active = index === partIndex;
                return (
                  <li
                    key={item.n}
                    className={cn("relative border-b border-co-border", active && "bg-co-bg-alt")}
                  >
                    {/* The selected part is the one thing switched on in this view. */}
                    {active ? (
                      <span aria-hidden className="absolute inset-y-0 left-0 block w-[3px] bg-co-green" />
                    ) : null}

                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => pickPart(index)}
                      className={cn(
                        PART_GRID,
                        "w-full px-3 py-3.5 text-left transition-colors duration-150",
                        !active && "hover:bg-co-bg-alt",
                      )}
                    >
                      <span
                        className={cn(
                          "co-data flex h-6 w-6 items-center justify-center border border-co-ink",
                          active ? "bg-co-ink text-co-bg" : "text-co-ink",
                        )}
                      >
                        {item.n}
                      </span>
                      <span className="min-w-0 font-display text-[clamp(15px,1.3vw,18px)] font-semibold leading-[1.05] tracking-[-0.01em]">
                        {item.name}
                      </span>
                      <span className="co-eyebrow text-right">{item.group}</span>
                    </button>

                    {active ? (
                      <div className={cn("px-3 pb-6 sm:pl-[56px]", WIPE_IN)}>
                        <SpecRows rows={item.rows} />
                        <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.55] text-co-ink-soft">
                          {item.why}
                        </p>
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ol>

            <p className="mt-5 max-w-[52ch] text-[13px] leading-[1.55] text-co-muted">
              Pick a number to read that part’s gauge and finish. Materials are quoted from
              the manufacturer’s specification sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
