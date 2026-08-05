"use client";

import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import { useCallback, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { SeriesPartFocus } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

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
 */

/** Push-in: critically damped, because the eye is trying to read the thing it lands on. */
const CAMERA = { type: "spring", bounce: 0, duration: 0.72 } as const;
const FADE = { duration: 0.3, ease: [0.16, 1, 0.3, 1] } as const;
/** How far the render drifts under a mouse while pushed in, in pixels. */
const PARALLAX_PX = 22;
const PARALLAX_SPRING = { stiffness: 130, damping: 26, mass: 0.7 } as const;

interface CameraFrame {
  scale: number;
  x: string;
  y: string;
  /** Where the focused part ends up on the stage, in percent — the vignette's centre. */
  spotX: number;
  spotY: number;
}

const WIDE: CameraFrame = { scale: 1, x: "0%", y: "0%", spotX: 50, spotY: 50 };

function cameraFrame(focus: SeriesPartFocus | undefined, pushed: boolean): CameraFrame {
  if (!focus || !pushed) return WIDE;
  const { zoom } = focus;
  // `translate(x) scale(z)` sends a point at f% of the frame to z·(f − 50) + x, so
  // centring it wants x = z·(50 − f). Clamping at ±(z − 1)·50 keeps the render's own
  // edge outside the stage, so no empty gutter can ever slide into view — a part close
  // to an edge therefore lands off-centre, which is why the vignette tracks the part
  // rather than assuming it sits in the middle.
  const limit = (zoom - 1) * 50;
  const clamp = (value: number) => Math.min(limit, Math.max(-limit, value));
  const x = clamp(zoom * (50 - focus.x));
  const y = clamp(zoom * (50 - focus.y));
  return {
    scale: zoom,
    x: `${x}%`,
    y: `${y}%`,
    spotX: 50 + zoom * (focus.x - 50) + x,
    spotY: 50 + zoom * (focus.y - 50) + y,
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
    <section id="anatomy" className="scroll-mt-[82px] border-b border-co-border bg-[#F6F5F2]">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <Reveal>
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
            {section.eyebrow}
          </p>
          <h2 className="mb-[clamp(26px,3.2vw,40px)] max-w-[24ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em]">
            {section.heading}
          </h2>
        </Reveal>

        <div className="grid items-start gap-[clamp(22px,3vw,46px)] lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div
            className="relative select-none overflow-hidden border border-co-card-border bg-white"
            style={{ aspectRatio: `${w} / ${h}` }}
            onPointerMove={drift}
            onPointerLeave={settle}
          >
            <motion.div className="absolute inset-0" style={{ x: driftX, y: driftY }}>
              <motion.div
                className="absolute inset-0"
                animate={{ scale: frame.scale, x: frame.x, y: frame.y }}
                transition={CAMERA}
                style={{ transformOrigin: "50% 50%" }}
              >
                {/* Asks for the render at its full width rather than at the stage's:
                    the camera pushes past 3×, and a stage-width source falls apart. */}
                <Image
                  src={series.anatomyImage}
                  alt={series.anatomyCaption}
                  fill
                  sizes={`${w}px`}
                  quality={90}
                  className="object-cover mix-blend-multiply"
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
                        {active && (
                          <motion.span
                            aria-hidden
                            className="absolute left-1/2 top-1/2 -ml-[26px] -mt-[26px] h-[52px] w-[52px] rounded-full border border-co-ink/25"
                            animate={{ scale: [1, 1.28, 1], opacity: [0.55, 0, 0.55] }}
                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                          />
                        )}
                        <button
                          type="button"
                          title={item.name}
                          aria-pressed={active}
                          onClick={() => pickPart(index)}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full border text-[12.5px] font-semibold transition-colors",
                            active
                              ? "border-co-ink bg-co-ink text-co-bg shadow-lg"
                              : "border-co-border bg-co-bg/90 text-co-faint shadow-sm backdrop-blur-sm hover:border-co-ink hover:text-co-ink",
                          )}
                        >
                          {item.n}
                        </button>
                        {active && pushedIn && (
                          <motion.span
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={FADE}
                            className="pointer-events-none absolute left-1/2 top-[38px] w-max max-w-[220px] -translate-x-1/2 whitespace-nowrap bg-co-ink/92 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.11em] text-co-bg backdrop-blur-sm"
                          >
                            {item.name}
                          </motion.span>
                        )}
                      </motion.div>
                    </div>
                  );
                })}
              </motion.div>
            </motion.div>

            {/* Vignette centred on the part, dropping the rest of the frame back. */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${frame.spotX}% ${frame.spotY}%, rgba(31,35,40,0) 32%, rgba(31,35,40,0.17) 100%)`,
              }}
              animate={{ opacity: pushedIn ? 1 : 0 }}
              transition={FADE}
            />

            <p className="pointer-events-none absolute left-3.5 top-3.5 bg-co-bg/70 px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-co-placeholder backdrop-blur-sm">
              {series.anatomyCaption}
            </p>

            <AnimatePresence>
              {pushedIn && (
                <motion.button
                  key="pull-back"
                  type="button"
                  onClick={pullBack}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={FADE}
                  className="absolute right-3.5 top-3.5 border border-co-border bg-co-bg/85 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-co-ink-soft backdrop-blur-sm transition-colors hover:border-co-ink hover:text-co-ink"
                >
                  Whole bench
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!part.focus ? (
                <motion.p
                  key="not-visible"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={FADE}
                  className="absolute bottom-3.5 left-1/2 w-max max-w-[86%] -translate-x-1/2 border border-co-border bg-co-bg/90 px-3 py-1.5 text-center text-[11.5px] font-light text-co-muted backdrop-blur-sm"
                >
                  <span className="font-medium text-co-ink">{part.name}</span> sits inside the
                  assembly — quoted from the specification sheet, not visible in this render.
                </motion.p>
              ) : (
                !pushedIn && (
                  <motion.p
                    key="hint"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={FADE}
                    className="pointer-events-none absolute bottom-3.5 left-1/2 w-max -translate-x-1/2 bg-co-bg/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-co-placeholder backdrop-blur-sm"
                  >
                    Tap a number to look closer
                  </motion.p>
                )
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="mb-5 grid grid-cols-[repeat(auto-fill,minmax(34px,1fr))] gap-1">
              {series.parts.map((item, index) => {
                const active = index === partIndex;
                return (
                  <button
                    key={item.n}
                    type="button"
                    title={item.name}
                    aria-pressed={active}
                    onClick={() => pickPart(index)}
                    className={cn(
                      "aspect-square border p-0 text-[13px] font-semibold transition-colors",
                      active
                        ? "border-co-ink bg-co-ink text-co-bg"
                        : "border-co-border bg-co-bg text-co-faint hover:border-co-ink",
                    )}
                  >
                    {item.n}
                  </button>
                );
              })}
            </div>

            <div className="border border-co-border bg-white shadow-[0_1px_0_#EDEAE3,0_14px_34px_-22px_rgba(31,35,40,0.3)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={part.n}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="flex items-start gap-3.5 border-b border-co-card-border px-5 pb-4 pt-5">
                    <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center bg-co-green text-[13.5px] font-bold text-co-cta-green-ink">
                      {part.n}
                    </span>
                    <div>
                      <h3 className="mb-1 font-display text-[21px] font-medium leading-tight tracking-[-0.024em]">
                        {part.name}
                      </h3>
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-co-placeholder">
                        {part.group}
                      </p>
                    </div>
                  </div>
                  <dl className="grid">
                    {part.rows.map((row) => (
                      <div
                        key={row.k}
                        className="grid grid-cols-[minmax(88px,0.42fr)_1fr] gap-4 border-b border-co-card-border/60 px-5 py-3"
                      >
                        <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-co-placeholder">
                          {row.k}
                        </dt>
                        <dd className="text-[14.5px] leading-normal text-co-ink-soft">{row.v}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="px-5 pb-4 pt-3.5 text-[13.5px] font-light leading-snug text-co-muted">
                    {part.why}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="mt-3.5 text-[12.5px] font-light leading-snug text-co-placeholder">
              Pick a number to read that part&apos;s gauge and finish. Materials are quoted from
              the manufacturer&apos;s specification sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
