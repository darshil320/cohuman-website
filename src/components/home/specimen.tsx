"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, useSyncExternalStore } from "react";
import { SpecLabel } from "@/components/ui/spec-label";

/**
 * The specimen — a desk drawn to size as you scroll.
 *
 * The one deliberately large move on the page. A studio render is pinned in the viewport
 * while its dimension lines draw themselves: length across the bottom with the size
 * stepping through the real selectable lengths, then height up the right edge, then the
 * part codes on leader lines. It is a technical drawing assembling itself, which is both
 * the most futuristic thing on the site and a literal description of what the company
 * sells — the size and the schedule are the product.
 *
 * Deliberately NOT WebGL. Every moving part here is a `transform` or an `opacity` on a
 * plain div, so it composites on the GPU, costs no new bundle, and server-renders.
 *
 * Desktop only. A 250vh pinned scene on a phone is a hostage situation, so below `lg`
 * the sticky wrapper is `static` and the drawing renders complete — and that is done with
 * a CSS class, never a JS branch, because branching on viewport in markup would render a
 * different tree on the server than in the browser.
 *
 * The resting state of every animated part is FINISHED, not blank: with scripting off or
 * reduced motion on, the drawing is simply already drawn.
 */

/** The store never emits — `live` flips once, when hydration replaces the server value. */
const subscribeNever = () => () => {};

/** The real selectable lengths for the STRETCHS single desk, in mm. */
const LENGTHS = [1200, 1400, 1500, 1600];

const CALLOUTS = [
  { code: "PRO-SB110-PC", label: "Beam", top: "38%", left: "6%" },
  { code: "CHSS-4FLEG072-PC", label: "Leg package", top: "72%", left: "12%" },
  { code: "CHSS-ST-SB110", label: "Configuration", top: "22%", left: "62%" },
];

export function Specimen() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  /*
    The drawing is finished until JavaScript says otherwise.

    Framer serializes a motion value's start state into the server HTML as an inline
    style, so animating straight off `scrollYProgress` would ship `opacity:0` on every
    dimension line and leave the plate at 35% — exactly the blank-page failure the rest of
    this page was rebuilt to avoid. Mounting first, then handing the scroll values over,
    means the static HTML carries the completed drawing and the scroll choreography is a
    progressive enhancement on top of it.
  */
  const live = useSyncExternalStore(
    subscribeNever,
    () => true, // client
    () => false, // server, and the first client render, so hydration matches
  );

  /** The scroll-driven value once mounted, otherwise the finished constant. */
  const when = <T,>(value: MotionValue<T>, rest: T) => (live ? value : rest);

  // The plate settles first, then the two dimension lines draw, then the callouts land.
  const plateOpacity = useTransform(scrollYProgress, [0, 0.16], [0.35, 1]);
  const plateScale = useTransform(scrollYProgress, [0, 0.16], [1.04, 1]);
  const widthScale = useTransform(scrollYProgress, [0.18, 0.44], [0, 1]);
  const widthLabel = useTransform(scrollYProgress, [0.18, 0.44], [0, 1]);
  const heightScale = useTransform(scrollYProgress, [0.46, 0.68], [0, 1]);
  const heightLabel = useTransform(scrollYProgress, [0.5, 0.68], [0, 1]);
  const calloutOpacity = useTransform(scrollYProgress, [0.72, 0.92], [0, 1]);

  // Steps through the real lengths rather than counting continuously — these are the
  // sizes you can actually choose, not a number animating for effect.
  const lengthText = useTransform(scrollYProgress, (p) => {
    const i = Math.min(LENGTHS.length - 1, Math.max(0, Math.floor(((p - 0.18) / 0.26) * LENGTHS.length)));
    return `${LENGTHS[i]} mm`;
  });

  return (
    <section className="border-y border-co-border bg-co-bg-alt">
      <div ref={ref} className="relative lg:h-[260vh]">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:items-center">
          <div className="co-shell grid w-full grid-cols-1 items-center gap-x-[clamp(28px,4vw,80px)] gap-y-[clamp(32px,4vw,56px)] py-[clamp(58px,7vw,0px)] lg:grid-cols-[1.15fr_0.85fr] lg:py-0">
            {/* The plate. Studio render on white, so it multiplies into the warm ground. */}
            <div className="relative order-2 lg:order-1">
              <motion.div
                style={{ opacity: when(plateOpacity, 1), scale: when(plateScale, 1) }}
                className="relative aspect-[4/3] w-full"
              >
                <Image
                  src="/pros/single-desk.jpg"
                  alt="STRETCHS single desk on an A-leg and beam chassis"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-contain mix-blend-multiply"
                />
              </motion.div>

              {/* Length dimension, drawn left to right under the plate. */}
              <div aria-hidden className="relative mt-4 h-8">
                <motion.div
                  style={{ scaleX: when(widthScale, 1) }}
                  className="absolute inset-x-0 top-3 h-px origin-left bg-co-ink"
                />
                <motion.span
                  style={{ scaleY: when(widthScale, 1) }}
                  className="absolute left-0 top-0 h-[26px] w-px origin-center bg-co-ink"
                />
                <motion.span
                  style={{ scaleY: when(widthScale, 1) }}
                  className="absolute right-0 top-0 h-[26px] w-px origin-center bg-co-ink"
                />
                <motion.span
                  style={{ opacity: when(widthLabel, 1) }}
                  className="absolute left-1/2 top-[18px] -translate-x-1/2 bg-co-bg-alt px-2 font-mono text-[11px] tracking-[0.14em] tabular-nums text-co-ink"
                >
                  <motion.span>{live ? lengthText : `${LENGTHS[LENGTHS.length - 1]} mm`}</motion.span>
                </motion.span>
              </div>

              {/* Height dimension, drawn bottom to top at the right edge. */}
              {/*
                The height dimension hangs outside the plate, which there is no room for
                on a phone — it pushed the document 7px wider than the viewport. It is
                also the least useful of the three annotations at that size, so it appears
                from `sm` up where the gutter can hold it.
              */}
              <div aria-hidden className="absolute bottom-12 right-0 top-0 hidden w-8 sm:block sm:-right-2 lg:-right-6">
                <motion.div
                  style={{ scaleY: when(heightScale, 1) }}
                  className="absolute inset-y-0 left-3 w-px origin-bottom bg-co-ink"
                />
                <motion.span
                  style={{ opacity: when(heightLabel, 1) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 bg-co-bg-alt px-2 font-mono text-[11px] tracking-[0.14em] tabular-nums text-co-ink"
                >
                  720 mm
                </motion.span>
              </div>

              {/* Part-code callouts on leader lines. */}
              {CALLOUTS.map((c) => (
                <motion.span
                  key={c.code}
                  aria-hidden
                  style={{ opacity: when(calloutOpacity, 1), top: c.top, left: c.left }}
                  className="absolute hidden items-center gap-2 lg:flex"
                >
                  <span className="block h-px w-8 bg-co-border-strong" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-co-muted">
                    {c.code}
                  </span>
                </motion.span>
              ))}
            </div>

            {/* Copy column. Static — never inside the animated area, so tab order and
                readability do not depend on scroll position. */}
            <div className="order-1 lg:order-2">
              <SpecLabel rule className="mb-6">
                02 / Specimen
              </SpecLabel>
              <h2 className="co-h2 mb-6 max-w-[15ch]">
                Specified to the millimetre, not to the nearest size.
              </h2>
              <p className="co-lead mb-9 max-w-[40ch]">
                Choose the configuration, the length and the depth. The drawing follows every
                choice, and the schedule arrives with the part numbers already on it.
              </p>
              <Link
                href="/configure"
                className="group inline-flex items-center gap-3 border-b-2 border-co-ink pb-2 text-[clamp(15px,1.4vw,19px)] font-semibold text-co-ink transition-colors hover:border-co-placeholder hover:text-co-muted"
              >
                Configure a desk
                <svg
                  aria-hidden
                  width="15"
                  height="10"
                  viewBox="0 0 13 9"
                  fill="none"
                  className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1.5"
                >
                  <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
