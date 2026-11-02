"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { HeroFilm } from "@/lib/hero-films";
import { resetHeroChrome, setHeroChrome } from "@/lib/hero-chrome";
import { HEADER_HEIGHT } from "@/lib/layout";
import { cn } from "@/lib/utils";

/** Cover the frame; on portrait screens hold the film's chosen focus, centred from md up. */
const FRAME = "object-cover object-[var(--film-x)_50%] md:object-center";

/** Horizontal travel, in px, that counts as a swipe on touch screens. */
const SWIPE_PX = 48;

export type HeroPanel =
  | {
      kind: "film";
      film: HeroFilm;
      /** Content set over the film (the lead film carries the page's claim). */
      overlay?: ReactNode;
    }
  | { kind: "content"; label: string; node: ReactNode; tone?: "light" | "dark" };

const pad = (n: number) => String(n).padStart(2, "0");

function timecode(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

const panelLabel = (panel: HeroPanel) => (panel.kind === "film" ? panel.film.label : panel.label);
const panelTone = (panel: HeroPanel) => (panel.kind === "film" ? (panel.film.tone ?? "light") : (panel.tone ?? "light"));

/**
 * The homepage hero: a full-screen carousel that runs under a transparent header.
 *
 * Panels are films (`HeroFilm`, optionally with content set over them) or content panels
 * (the measured "Engineered for two" panel). All share one grid cell, so the hero is as
 * tall as its tallest panel — a full screen on desktop, never a clipped panel on a phone.
 * Changing panel wipes the new one in left to right over the old ("images wipe, never
 * fade"); reduced motion swaps instantly.
 *
 * The ink corner block holds every control: pause / play for a running film (a looping
 * video must be stoppable — WCAG 2.2.2), the arrows, and one bar per panel. The active
 * bar is the logo's green bar used as a progress line: on a film it fills with playback,
 * on a still panel it is full. A mono timecode closes the block while a film plays. Progress and timecode are written straight to the DOM from the video's frame
 * loop, so a playing film never re-renders React.
 *
 * While the hero is under the header it publishes `overHero` and the active panel's tone
 * (`setHeroChrome`), which is what turns the header transparent.
 */
export function HeroCarousel({ panels }: { panels: HeroPanel[] }) {
  const total = panels.length;
  const [index, setIndex] = useState(0);
  // The panel being wiped over, kept painted underneath until the wipe lands.
  const [previous, setPrevious] = useState<number | null>(null);
  // Panels opened at least once. A film's video mounts only then (the lead film is open
  // from the start), so other footage costs the homepage nothing until it is asked for.
  const [opened, setOpened] = useState<ReadonlySet<number>>(() => new Set([0]));
  // null = follow the reader's motion preference; true / false = they pressed the button.
  const [userPaused, setUserPaused] = useState<boolean | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const swipeStart = useRef<number | null>(null);
  const progressRefs = useRef(new Map<number, HTMLSpanElement>());
  const clockRef = useRef<HTMLSpanElement>(null);

  const active = panels[index];
  const activeFilm = active?.kind === "film" && active.film.video ? active.film : null;
  const paused = userPaused ?? reducedMotion;
  const tone = active ? panelTone(active) : "light";

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

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

  // A film reports its playhead every frame; paint the bar and the clock directly.
  const onTick = useCallback((panelIndex: number, current: number, duration: number) => {
    const bar = progressRefs.current.get(panelIndex);
    const fraction = duration > 0 ? Math.min(current / duration, 1) : 0;
    if (bar) bar.style.transform = `scaleX(${fraction})`;
    if (clockRef.current) clockRef.current.textContent = `${timecode(current)} / ${timecode(duration)}`;
  }, []);

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
      className="relative grid overflow-hidden border-b border-co-ink bg-co-bg"
      style={{ marginTop: -HEADER_HEIGHT }}
    >
      {panels.map((panel, i) => (
        <div
          key={panel.kind === "film" ? panel.film.id : panel.label}
          role={total > 1 ? "group" : undefined}
          aria-roledescription={total > 1 ? "slide" : undefined}
          aria-label={total > 1 ? `${i + 1} of ${total}: ${panelLabel(panel)}` : undefined}
          inert={index !== i}
          className={panelClass(i)}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) setPrevious(null);
          }}
        >
          {panel.kind === "film" ? (
            <FilmPanel
              film={panel.film}
              lead={i === 0}
              active={index === i}
              mounted={opened.has(i)}
              playing={index === i && !paused}
              onTick={(current, duration) => onTick(i, current, duration)}
            >
              {panel.overlay}
            </FilmPanel>
          ) : (
            panel.node
          )}
        </div>
      ))}

      {total > 1 || activeFilm ? (
        <div className="absolute bottom-0 left-0 z-20 flex items-stretch bg-co-panel text-co-panel-fg">
          {activeFilm ? (
            <button
              type="button"
              aria-label={paused ? "Play film" : "Pause film"}
              aria-pressed={paused}
              onClick={() => setUserPaused(!paused)}
              className="co-data flex min-h-12 w-12 items-center justify-center border-r border-co-panel-border transition-colors hover:bg-co-panel-border"
            >
              {paused ? <PlayIcon /> : <PauseIcon />}
            </button>
          ) : null}
          {total > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous panel"
                onClick={() => go(index - 1)}
                className="flex min-h-12 w-12 items-center justify-center border-r border-co-panel-border transition-colors hover:bg-co-panel-border"
              >
                <ArrowIcon direction="left" />
              </button>
              <div role="group" aria-label="Hero panels" className="flex items-center gap-1 px-3 sm:px-4">
                {panels.map((panel, i) => {
                  const on = i === index;
                  const isFilm = panel.kind === "film" && Boolean(panel.film.video);
                  return (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Show panel ${i + 1}: ${panelLabel(panel)}`}
                      aria-current={on}
                      onClick={() => go(i)}
                      className="group flex min-h-12 flex-col items-start justify-center gap-1.5 px-1.5 sm:px-2"
                    >
                      <span
                        className={cn(
                          "co-data",
                          on ? "text-co-panel-fg" : "text-co-panel-faint group-hover:text-co-panel-fg",
                        )}
                      >
                        {pad(i + 1)}
                        <span className="ml-1.5 hidden sm:inline">{panelLabel(panel)}</span>
                      </span>
                      <span className="relative block h-[3px] w-8 bg-co-panel-border sm:w-10">
                        {on ? (
                          <span
                            ref={(node) => {
                              if (node) progressRefs.current.set(i, node);
                              else progressRefs.current.delete(i);
                            }}
                            className="absolute inset-0 block origin-left bg-co-green"
                            style={{ transform: isFilm ? "scaleX(0)" : "scaleX(1)" }}
                          />
                        ) : null}
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                aria-label="Next panel"
                onClick={() => go(index + 1)}
                className="flex min-h-12 w-12 items-center justify-center border-l border-co-panel-border transition-colors hover:bg-co-panel-border"
              >
                <ArrowIcon direction="right" />
              </button>
            </>
          ) : null}
          {/* The film's timecode, inside the block: nothing else floats over the footage. */}
          {activeFilm ? (
            <span
              ref={clockRef}
              aria-hidden
              className="co-data hidden items-center border-l border-co-panel-border px-4 tabular-nums text-co-panel-muted sm:flex"
            >
              00:00 / 00:00
            </span>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

/**
 * One full-bleed film. The poster is always there — it is the first paint, what a
 * reduced-motion reader sees, and what shows with scripting off. The video element mounts
 * on first open and plays only while its panel is active and not paused, reporting its
 * playhead each frame through `onTick`.
 *
 * A canvas wash multiplies over the footage, so a studio's grey sweep lands on Signal's
 * ivory paper instead of reading as a cold grey rectangle between two warm sections.
 */
function FilmPanel({
  film,
  lead,
  active,
  mounted,
  playing,
  onTick,
  children,
}: {
  film: HeroFilm;
  lead: boolean;
  active: boolean;
  mounted: boolean;
  playing: boolean;
  onTick: (current: number, duration: number) => void;
  children?: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (!playing) {
      video.pause();
      return;
    }
    // Autoplay can be refused (data saver, low-power mode). That is not an error worth
    // surfacing: the poster underneath is the designed fallback and stays on screen.
    video.play().catch(() => video.pause());
  }, [playing, mounted]);

  // Report the playhead while this panel is on screen, so the bar and clock follow it.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active) return;
    let raf = 0;
    const loop = () => {
      onTick(video.currentTime, Number.isFinite(video.duration) ? video.duration : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [active, mounted, onTick]);

  return (
    <div
      className="relative h-full min-h-[100svh] overflow-hidden bg-co-bg"
      style={{ "--film-x": film.mobileFocus ?? "50%" } as CSSProperties}
    >
      <Image
        src={film.poster}
        alt={film.alt}
        fill
        sizes="100vw"
        preload={lead}
        loading={lead ? "eager" : "lazy"}
        className={FRAME}
      />
      {film.video && mounted ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop
          playsInline
          poster={film.poster}
          preload={lead ? "auto" : "metadata"}
          className={cn("absolute inset-0 h-full w-full", FRAME)}
        >
          {film.video.webm ? <source src={film.video.webm} type="video/webm" /> : null}
          <source src={film.video.mp4} type="video/mp4" />
        </video>
      ) : null}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-co-bg mix-blend-multiply" />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}

/*
  The control glyphs, drawn rather than typed: neither Archivo nor Martian Mono carries
  arrows or media symbols, so typed ones fell back to a system font, and ▶ can render as
  an emoji. 1.25px strokes and square fills on `currentColor`, sized to the 11px mono.
*/
function PlayIcon() {
  return (
    <svg aria-hidden width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <path d="M0 0l10 6-10 6z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg aria-hidden width="10" height="12" viewBox="0 0 10 12" fill="currentColor">
      <rect x="0" y="0" width="3.5" height="12" />
      <rect x="6.5" y="0" width="3.5" height="12" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      aria-hidden
      width="14"
      height="10"
      viewBox="0 0 14 10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      className={direction === "left" ? "-scale-x-100" : undefined}
    >
      <path d="M0 5h12.5M8.5 1l4 4-4 4" />
    </svg>
  );
}
