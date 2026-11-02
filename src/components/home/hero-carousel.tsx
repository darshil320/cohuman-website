"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import type { HeroFilm } from "@/lib/hero-films";
import { resetHeroChrome, setHeroChrome } from "@/lib/hero-chrome";
import { HEADER_HEIGHT } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Horizontal travel, in px, that counts as a swipe on touch screens. */
const SWIPE_PX = 48;

const pad = (n: number) => String(n).padStart(2, "0");

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * The homepage hero: a full-screen carousel that runs under a transparent header.
 *
 * Panel 1 is the measured "Engineered for two" panel (`intro`, server-rendered and passed
 * in, so its headline stays the LCP element). Every panel after it is a film — full
 * bleed, no text — from `HERO_FILMS`. With no films configured this is simply the intro
 * panel, with no pagination.
 *
 * Every panel shares one grid cell, so the hero is as tall as its tallest panel: a full
 * screen on desktop, and never a clipped intro on a phone. Changing panel wipes the new
 * one in left to right over the old ("images wipe, never fade"); reduced motion swaps
 * instantly. Pagination sits in a solid ink corner block — the same device as the
 * collection page's name hero — so it reads on any footage without a scrim.
 *
 * While the hero is under the header it publishes `overHero` and the active panel's tone
 * (`setHeroChrome`), which is what turns the header transparent.
 */
export function HeroCarousel({
  intro,
  introLabel = "Index",
  films,
}: {
  intro: ReactNode;
  introLabel?: string;
  films: HeroFilm[];
}) {
  const total = 1 + films.length;
  const [index, setIndex] = useState(0);
  // The panel being wiped over, kept painted underneath until the wipe lands.
  const [previous, setPrevious] = useState<number | null>(null);
  // Panels opened at least once. A film's video mounts only then, so footage costs the
  // homepage nothing until someone asks for it.
  const [opened, setOpened] = useState<ReadonlySet<number>>(() => new Set([0]));
  const sectionRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<number | null>(null);

  const tone = index === 0 ? "light" : (films[index - 1]?.tone ?? "light");

  const go = useCallback(
    (next: number) => {
      const target = (next + total) % total;
      if (target === index) return;
      setPrevious(prefersReducedMotion() ? null : index);
      setIndex(target);
      setOpened((seen) => (seen.has(target) ? seen : new Set([...seen, target])));
    },
    [index, total],
  );

  // Tell the header whether it is sitting on the hero, and on what.
  useEffect(() => {
    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      setHeroChrome({ overHero: node.getBoundingClientRect().bottom > HEADER_HEIGHT, tone });
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [tone]);

  // Leaving the homepage hands the header back its solid bar.
  useEffect(() => resetHeroChrome, []);

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "touch") swipeStart.current = event.clientX;
  };
  const onPointerUp = (event: PointerEvent) => {
    if (swipeStart.current === null || total < 2) return;
    const travel = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (Math.abs(travel) >= SWIPE_PX) go(index + (travel < 0 ? 1 : -1));
  };

  const panelClass = (i: number) =>
    cn(
      "min-w-0 [grid-area:1/1]",
      i === index ? "relative z-10" : i === previous ? "relative z-0" : "invisible",
      i === index && previous !== null && "co-wipe-in",
    );

  const labels = [introLabel, ...films.map((film) => film.label)];

  return (
    <section
      ref={sectionRef}
      aria-roledescription={total > 1 ? "carousel" : undefined}
      aria-label="Cohuman"
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") go(index + 1);
        if (event.key === "ArrowLeft") go(index - 1);
      }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      className="relative grid overflow-hidden border-b border-co-ink bg-co-ink"
      style={{ marginTop: -HEADER_HEIGHT }}
    >
      <div
        role={total > 1 ? "group" : undefined}
        aria-roledescription={total > 1 ? "slide" : undefined}
        aria-label={total > 1 ? `1 of ${total}: ${introLabel}` : undefined}
        inert={index !== 0}
        className={panelClass(0)}
        onAnimationEnd={(event) => {
          if (event.target === event.currentTarget) setPrevious(null);
        }}
      >
        {intro}
      </div>

      {films.map((film, k) => {
        const i = k + 1;
        return (
          <div
            key={film.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${total}: ${film.label}`}
            inert={index !== i}
            className={panelClass(i)}
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget) setPrevious(null);
            }}
          >
            <FilmPanel film={film} active={index === i} mounted={opened.has(i)} />
          </div>
        );
      })}

      {total > 1 ? (
        <div className="absolute bottom-0 left-0 z-20 flex items-stretch bg-co-panel text-co-panel-fg">
          <button
            type="button"
            aria-label="Previous panel"
            onClick={() => go(index - 1)}
            className="flex w-12 items-center justify-center border-r border-co-panel-border transition-colors hover:bg-co-panel-border"
          >
            ←
          </button>
          <div role="group" aria-label="Hero panels" className="flex items-center gap-1 px-3 sm:px-4">
            {labels.map((label, i) => (
              <button
                key={label}
                type="button"
                aria-label={`Show panel ${i + 1}: ${label}`}
                aria-current={i === index}
                onClick={() => go(i)}
                className="group flex flex-col items-start gap-1.5 px-1.5 py-3 sm:px-2"
              >
                <span className={cn("co-data", i === index ? "text-co-panel-fg" : "text-co-panel-faint group-hover:text-co-panel-fg")}>
                  {pad(i + 1)}
                  <span className="ml-1.5 hidden sm:inline">{label}</span>
                </span>
                <span className={cn("block h-[3px] w-8 sm:w-10", i === index ? "bg-co-green" : "bg-co-panel-border")} />
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Next panel"
            onClick={() => go(index + 1)}
            className="flex w-12 items-center justify-center border-l border-co-panel-border transition-colors hover:bg-co-panel-border"
          >
            →
          </button>
        </div>
      ) : null}
    </section>
  );
}

/**
 * One full-bleed film. The poster is always there (and is all a reduced-motion reader or
 * a panel without footage ever sees); the video element mounts on first open and plays
 * only while its panel is the active one.
 */
function FilmPanel({ film, active, mounted }: { film: HeroFilm; active: boolean; mounted: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!active || prefersReducedMotion()) {
      video.pause();
      return;
    }
    // Autoplay can be refused (data saver, low-power mode). That is not an error worth
    // surfacing: the poster underneath is the designed fallback and stays on screen.
    video.play().catch(() => video.pause());
  }, [active, mounted]);

  return (
    <div className="relative h-full min-h-[100svh] bg-co-ink">
      <Image src={film.poster} alt={film.alt} fill sizes="100vw" className="object-cover" />
      {film.video && mounted ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        >
          {film.video.webm ? <source src={film.video.webm} type="video/webm" /> : null}
          <source src={film.video.mp4} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}
