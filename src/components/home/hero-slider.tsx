"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { SpecLabel } from "@/components/ui/spec-label";
import { cn } from "@/lib/utils";

export interface HeroSlide {
  src: string;
  alt: string;
  blurDataURL?: string;
  objectPosition?: string;
  /** Mono index label, e.g. "01 / Bench". */
  tag: string;
  headline: string;
  sub: string;
  linkLabel: string;
  linkHref: string;
}

/** Movement past which a press is a drag rather than a tap. */
const DRAG_THRESHOLD_PX = 10;
/** Horizontal travel that commits to the next or previous slide. */
const COMMIT_PX = 70;
const INTERVAL_MS = 6500;

/**
 * The homepage hero — a draggable slide deck.
 *
 * Every slide is rendered into the server HTML and stacked; only opacity and a small
 * translate change between them. That is what keeps the first photograph the LCP element
 * (it is a plain `next/image` with `fetchPriority="high"`, not something a client effect
 * mounts) while still giving the deck drag, arrow keys, dots and an autoplay that yields
 * to the visitor.
 *
 * Autoplay stops permanently the moment someone drags, clicks a dot or uses the keyboard:
 * a carousel that keeps moving after you have taken hold of it is the single most
 * irritating thing a hero can do. It also pauses on hover and whenever the tab is hidden.
 */
export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [taken, setTaken] = useState(false);

  const hoverRef = useRef(false);
  const pointerId = useRef<number | null>(null);
  const startX = useRef(0);
  const dragging = useRef(false);

  const current = slides[active];

  const go = useCallback(
    (next: number) => setActive((next + slides.length) % slides.length),
    [slides.length],
  );

  /** Any deliberate interaction ends autoplay for the rest of the session. */
  const take = useCallback(() => setTaken(true), []);

  useEffect(() => {
    if (taken) return;
    const id = window.setInterval(() => {
      if (hoverRef.current || document.hidden) return;
      setActive((i) => (i + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [taken, slides.length]);

  const onPointerDown = (e: React.PointerEvent) => {
    // Let links and buttons inside the slide behave normally.
    if ((e.target as HTMLElement).closest("a,button")) return;
    pointerId.current = e.pointerId;
    startX.current = e.clientX;
    dragging.current = false;
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    const dx = e.clientX - startX.current;
    if (!dragging.current && Math.abs(dx) < DRAG_THRESHOLD_PX) return;
    dragging.current = true;
    setDragX(dx);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (pointerId.current !== e.pointerId) return;
    const dx = e.clientX - startX.current;
    if (dragging.current) {
      take();
      if (dx <= -COMMIT_PX) go(active + 1);
      else if (dx >= COMMIT_PX) go(active - 1);
    }
    pointerId.current = null;
    dragging.current = false;
    setDragX(0);
  };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Cohuman workspaces"
      className="relative isolate flex min-h-[86svh] touch-pan-y flex-col justify-end overflow-hidden bg-co-panel select-none"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") {
          take();
          go(active + 1);
        }
        if (e.key === "ArrowLeft") {
          take();
          go(active - 1);
        }
      }}
      tabIndex={0}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          className={cn(
            "absolute inset-0 transition-opacity duration-[900ms] ease-[var(--ease-co)]",
            i === active ? "opacity-100" : "opacity-0",
          )}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            // Only the first frame is eager: it is the LCP element. The rest load lazily,
            // so a three-slide deck still costs one image on first paint.
            fetchPriority={i === 0 ? "high" : "auto"}
            loading={i === 0 ? "eager" : "lazy"}
            quality={72}
            sizes="100vw"
            placeholder={slide.blurDataURL ? "blur" : undefined}
            blurDataURL={slide.blurDataURL}
            className="object-cover"
            style={{
              objectPosition: slide.objectPosition,
              // A touch of drag parallax: the picture trails the finger.
              transform: dragX ? `translateX(${dragX * 0.06}px) scale(1.03)` : undefined,
            }}
            draggable={false}
          />
        </div>
      ))}

      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-[clamp(14px,2vw,26px)] border border-white/20" />

      {/* Copy. Translated with the drag so the whole slide feels like one object. */}
      <div
        className="co-shell relative pb-[clamp(30px,4vw,56px)] pt-[clamp(120px,18vh,200px)]"
        style={{ transform: dragX ? `translateX(${dragX * 0.22}px)` : undefined }}
      >
        {/*
          Only the active slide is in the tree. Rendering all three and hiding two put
          three `<h1>` elements in the document, which is a document-outline error no
          matter which one is visible — and it left the inactive slides' links in the tab
          order behind an invisible panel. `key` restarts the kinetic reveal on change.
        */}
        <div key={current.src}>
          <SpecLabel tone="dark" rule className="mb-[clamp(18px,2.6vw,30px)] text-white/70">
            {current.tag}
          </SpecLabel>

          <h1 className="co-display max-w-[14ch] text-white">
            <KineticHeading>{current.headline}</KineticHeading>
          </h1>

          <p className="co-lead mt-[clamp(18px,2.4vw,30px)] max-w-[46ch] text-white/75">
            {current.sub}
          </p>

          <div className="mt-[clamp(24px,3.2vw,44px)] flex flex-wrap items-center gap-x-9 gap-y-4">
            <Link
              href={current.linkHref}
              className="group inline-flex items-center gap-3 border-b-2 border-white pb-2 text-[clamp(15px,1.4vw,19px)] font-semibold text-white transition-colors hover:border-white/50 hover:text-white/75"
            >
              {current.linkLabel}
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
            <Link
              href="/configure"
              className="text-[clamp(14px,1.3vw,17px)] font-medium text-white/70 underline-offset-[6px] transition-colors hover:text-white hover:underline"
            >
              Configure a desk
            </Link>
          </div>
        </div>

        {/* Index rail: a drawn scale rather than dots. */}
        <div className="mt-[clamp(30px,4vw,54px)] flex items-center gap-4">
          <span aria-hidden className="font-mono text-[10.5px] tabular-nums text-white/60">
            {String(active + 1).padStart(2, "0")}
          </span>
          <div className="flex items-center gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                onClick={() => {
                  take();
                  go(i);
                }}
                aria-label={`Slide ${i + 1}: ${slide.tag}`}
                aria-current={i === active}
                className="group py-2"
              >
                <span
                  className={cn(
                    "block h-px transition-all duration-500 ease-[var(--ease-co)]",
                    i === active ? "w-12 bg-white" : "w-6 bg-white/35 group-hover:bg-white/70",
                  )}
                />
              </button>
            ))}
          </div>
          <span aria-hidden className="font-mono text-[10.5px] tabular-nums text-white/40">
            {String(slides.length).padStart(2, "0")}
          </span>
          <span aria-hidden className="ml-3 hidden font-mono text-[10px] uppercase tracking-[0.2em] text-white/35 sm:inline">
            Drag
          </span>
        </div>
      </div>
    </section>
  );
}
