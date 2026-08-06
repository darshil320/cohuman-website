"use client";

import { AnimatePresence, motion } from "framer-motion";
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
      <div
        className={cn(
          "absolute inset-0 flex cursor-grab active:cursor-grabbing",
          !dragging && "transition-transform duration-700 ease-out",
        )}
        style={{ transform: `translateX(calc(${-active * 100}% + ${dragOffset}px))` }}
      >
        {slides.map((slide, i) => (
          <div key={slide.src} className="relative h-full w-full shrink-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              draggable={false}
              sizes="100vw"
              quality={100}
              unoptimized
              className="object-cover"
              style={{ objectPosition: slide.objectPosition ?? "center" }}
            />
          </div>
        ))}
      </div>
      
      {/*
        Scrim weighted to the left, where the copy sits, and fading out well before the
        middle so it never dulls the furniture the photograph is there to sell.
      */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

      {/*
        Per-slide copy. Each photograph gets its own headline, so the words describe what
        is actually on screen rather than one caption sitting over three different rooms.
        The column is capped well short of half the frame, which is what keeps it clear of
        the subject in every crop.
      */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="mx-auto flex h-full max-w-[1320px] flex-col justify-center px-[18px] pb-[10vh] sm:px-6 lg:px-11">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="flex max-w-[min(46ch,52%)] flex-col gap-[clamp(16px,1.8vw,24px)]"
            >
              {slides[active]?.headline?.length ? (
                <h1 className="font-display text-[clamp(30px,3vw,46px)] font-semibold leading-[1.08] tracking-[-0.028em] text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.4)]">
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
                <p className="max-w-[38ch] text-[clamp(14px,1.15vw,16.5px)] font-normal leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.45)]">
                  {slides[active].sub}
                </p>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="relative z-10 h-full">{children}</div>
      
      {/* Bottom Nav: Dots (Left) and Link (Right) */}
      <div className="absolute bottom-12 left-0 right-0 z-20 mx-auto max-w-[1320px] px-[18px] sm:px-6 lg:px-11 flex justify-between items-end pointer-events-none">
        
        {slides.length > 1 ? (
          <div className="flex items-center gap-3 pointer-events-auto pb-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActive(i)}
                className="group p-1 focus:outline-none"
              >
                <span
                  className={cn(
                    "block h-2 w-2 rounded-full transition-colors duration-300",
                    i === active
                      ? "bg-red-600"
                      : "bg-white/70 group-hover:bg-white",
                  )}
                />
              </button>
            ))}
          </div>
        ) : <div />}

        {slides[active]?.linkLabel && slides[active]?.linkHref && (
          <Link 
            href={slides[active].linkHref!} 
            className="pointer-events-auto flex items-center gap-3 text-white font-medium hover:text-white/80 transition-colors group"
          >
            {slides[active].linkLabel}
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 group-hover:bg-black/80 transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </Link>
        )}
      </div>
    </div>
  );
}
