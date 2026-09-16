"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { TextReveal } from "@/components/ui/text-reveal";
import { ArrowRight } from "lucide-react";

/** Movement before a press becomes a drag rather than a tap. */
const DRAG_THRESHOLD_PX = 10;

export interface HeroSlide {
  src: string;
  alt: string;
  /**
   * `object-position` for this photograph. Each shot puts its subject somewhere
   * different, and the crop is what keeps the furniture out from under the words.
   */
  objectPosition?: string;
  /**
   * Inline LQIP for `placeholder="blur"` — a base64 JPEG a couple of dozen pixels
   * wide, so a colour-correct blur is in the first HTML byte rather than an empty
   * stage waiting on the network. Regenerate with `sharp` when the photograph
   * changes: resize to 24px wide, encode JPEG, inline as a data URL.
   */
  blurDataURL?: string;
  /** Headline, one array entry per line — no `<br />` to parse. */
  headline?: string[];
  sub?: string;
  linkLabel?: string;
  linkHref?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
  intervalMs?: number;
  children?: React.ReactNode;
  className?: string;
}

export function HeroCarousel({
  slides,
  intervalMs = 4000,
  children,
  className,
}: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const pausedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const draggingRef = useRef(false);
  /** The pointer currently down on the carousel, so a second touch cannot hijack it. */
  const pointerIdRef = useRef<number | null>(null);
  /** Whether a mouse is resting over the carousel — the other reason to hold the timer. */
  const hoverRef = useRef(false);

  /*
    Scroll-linked parallax. The photograph leaves at roughly two thirds of the scroll
    speed and dims as it goes, so the first section slides over a hero that is still
    moving rather than a static block — the cue that there is more below. Reduced motion
    gets the plain version, via the app-level `MotionConfig reducedMotion="user"` —
    branching on `useReducedMotion()` here would render a different tree on the server
    than in the browser and break hydration.
  */
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const parallaxFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.35]);

  /*
    The timer restarts whenever `active` changes, so choosing a slide by hand gives you a
    full interval to look at it. Without this the running timer kept its own schedule and
    could advance a fraction of a second after a tap — the slide you asked for would flick
    past to the next one. Hover-pausing never covered that: `mouseenter` does not fire on
    a touch device, which is exactly where the dots get tapped.
  */
  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [slides.length, intervalMs, active]);

  /*
    Capture is deferred until the pointer has actually travelled. Taking it on
    `pointerdown` retargets the following `pointerup` to this container, so the dots and
    the slide link never completed a click — every tap on a dot was swallowed and the
    carousel just carried on auto-advancing. Waiting for ~10px of movement also means a
    press that turns out to be a tap stays a tap.
  */
  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (slides.length <= 1) return;
    startXRef.current = event.clientX;
    pointerIdRef.current = event.pointerId;
    pausedRef.current = true;
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (pointerIdRef.current !== event.pointerId) return;
    const delta = event.clientX - startXRef.current;

    if (!draggingRef.current) {
      if (Math.abs(delta) < DRAG_THRESHOLD_PX) return;
      draggingRef.current = true;
      setDragging(true);
      event.currentTarget.setPointerCapture(event.pointerId);
    }

    setDragOffset(delta);
  }

  function endDrag() {
    pointerIdRef.current = null;
    // Hand the pause back to hover rather than clearing it outright: a click with the
    // cursor still resting on the carousel should not start it moving again.
    if (!draggingRef.current) {
      // A tap, not a drag: leave the click to reach whatever it was aimed at.
      pausedRef.current = hoverRef.current;
      return;
    }
    draggingRef.current = false;
    setDragging(false);
    pausedRef.current = hoverRef.current;

    const width = containerRef.current?.offsetWidth ?? 1;
    const threshold = width * 0.12;
    if (dragOffset <= -threshold) {
      setActive((i) => (i + 1) % slides.length);
    } else if (dragOffset >= threshold) {
      setActive((i) => (i - 1 + slides.length) % slides.length);
    }
    setDragOffset(0);
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative touch-pan-y overflow-hidden select-none", className)}
      onMouseEnter={() => {
        hoverRef.current = true;
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        pausedRef.current = false;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
      onPointerCancel={endDrag}
    >
      <motion.div className="absolute inset-0" style={{ y: parallaxY, opacity: parallaxFade }}>
      <div
        className={cn(
          "absolute inset-0 flex cursor-grab active:cursor-grabbing",
          !dragging && "transition-transform duration-700 ease-out",
        )}
        style={{ transform: `translateX(calc(${-active * 100}% + ${dragOffset}px))` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
            {/*
              Every slide is mounted in one flex track, so without `loading` the browser
              would fetch all three on first paint and the LCP image would queue behind
              two photographs nobody has asked to see yet.

              Slide 0 is the LCP element, so it gets `preload` — a `<link rel="preload">`
              in the `<head>`, which the browser acts on before it has parsed the body,
              let alone hydrated this client component. `preload` is deliberately alone
              on it: Next 16 documents `loading` and `fetchPriority` as the props not to
              combine with it, and `priority` is deprecated in favour of it. Slides 1-2
              stay lazy and low so they arrive while the first slide is on screen.
            */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              {...(i === 0
                ? { preload: true }
                : { loading: "lazy" as const, fetchPriority: "low" as const })}
              draggable={false}
              sizes="100vw"
              quality={72}
              placeholder={slide.blurDataURL ? "blur" : "empty"}
              blurDataURL={slide.blurDataURL}
              className="object-cover"
              style={{ objectPosition: slide.objectPosition ?? "center" }}
            />
          </div>
        ))}
      </div>
      </motion.div>

      {/*
        Scrim weighted to the left, where the copy sits, and fading out well before the
        middle so it never dulls the furniture the photograph is there to sell.
      */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10 md:via-black/25 md:to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent md:from-black/45 md:via-transparent" />

      {/*
        Per-slide copy. Each photograph gets its own headline, so the words describe what
        is actually on screen rather than one caption sitting over three different rooms.
        The column is capped well short of half the frame, which is what keeps it clear of
        the subject in every crop.
      */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-[1320px] flex-col justify-center px-[18px] pb-[10vh] sm:px-6 lg:px-11">
          {/*
            Keyed on the slide, not on `active`: re-keying every tick remounted the
            headline and replayed `TextReveal`'s word-by-word rise on a four-second
            loop, which read as flicker rather than motion. Keying on `src` still
            crossfades between slides, but a returning slide keeps the text it had.
          */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[active]?.src ?? active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              /*
                The percentage cap keeps the copy clear of the furniture, but only once
                there are two columns to divide: on a phone the frame is barely wider
                than the text itself, and 54% left the headline in a 190px gutter.
              */
              className="flex max-w-[34ch] flex-col gap-[clamp(18px,2vw,28px)] md:max-w-[min(46ch,54%)]"
            >
              {slides[active]?.headline?.length ? (
                <h1 className="font-display text-[clamp(34px,4.6vw,70px)] font-medium leading-[0.98] tracking-[-0.042em] text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.38)]">
                  <TextReveal>
                    {slides[active].headline.map((line, index) => (
                      <span key={line}>
                        {index > 0 ? <br /> : null}
                        {line}
                      </span>
                    ))}
                  </TextReveal>
                </h1>
              ) : null}
              {slides[active]?.sub ? (
                <p className="max-w-[40ch] text-[clamp(14px,1.2vw,17px)] font-light leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
                  {slides[active].sub}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 h-full">{children}</div>
      
      {/*
        Slide index rather than dots. A numeral plus a rule per slide says which frame you
        are on and how many there are, which a row of dots only implies — and it drops the
        one filled red circle, the only non-brand colour that was on the page.
      */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[clamp(28px,4vw,56px)] z-20 mx-auto flex max-w-[1320px] items-end justify-between gap-6 px-[18px] sm:px-6 lg:px-11">
        {slides.length > 1 ? (
          <div className="pointer-events-auto flex items-center gap-4">
            <span className="font-mono text-[11px] tabular-nums text-white/90">
              {String(active + 1).padStart(2, "0")}
            </span>
            <div className="flex items-center gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.src}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  onClick={() => setActive(i)}
                  className="group py-2"
                >
                  <span
                    className={cn(
                      "block h-px transition-all duration-500 ease-[var(--ease-co)]",
                      i === active ? "w-10 bg-white" : "w-5 bg-white/45 group-hover:bg-white/80",
                    )}
                  />
                </button>
              ))}
            </div>
            <span className="font-mono text-[11px] tabular-nums text-white/55">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
        ) : (
          <div />
        )}

        {slides[active]?.linkLabel && slides[active]?.linkHref && (
          <Link
            href={slides[active].linkHref!}
            className="group pointer-events-auto inline-flex items-center gap-3 border-b border-white/50 pb-1.5 text-[13.5px] font-semibold text-white transition-colors hover:border-white"
          >
            {slides[active].linkLabel}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1" />
          </Link>
        )}
      </div>
    </div>
  );
}
