"use client";

import Image, { getImageProps } from "next/image";
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

/** Below this width a film's portrait cut, when it has one, replaces the landscape one. */
const MOBILE_MEDIA = "(max-width: 767px)";

/** Horizontal travel, in px, that counts as a swipe on touch screens. */
const SWIPE_PX = 48;

/** How long after a film starts the next film in the sequence is mounted. */
const NEXT_FILM_DELAY_MS = 4000;

export type HeroPanel =
  | {
      kind: "film";
      film: HeroFilm;
      /** Content set over the film (the lead film carries the page's claim). */
      overlay?: ReactNode;
    }
  | { kind: "content"; label: string; node: ReactNode; tone?: "light" | "dark" };


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
 * Controls are a row of dots, bottom centre (client, Nov 2026): one per slide, the
 * current one a short track filling with its film's playback; pressing it pauses or
 * resumes. Progress is written straight to the DOM from the video's frame loop, so a
 * playing film never re-renders React.
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

  // In a sequence, mount the next film a few seconds after this one starts, so it is
  // loaded by the time this one ends — but never on the critical path of first paint.
  useEffect(() => {
    if (total < 2 || paused) return;
    const next = (index + 1) % total;
    const timer = window.setTimeout(() => {
      setOpened((seen) => (seen.has(next) ? seen : new Set([...seen, next])));
    }, NEXT_FILM_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [index, total, paused]);

  // A film reports its playhead every frame; paint the bar and the clock directly.
  const onTick = useCallback((panelIndex: number, current: number, duration: number) => {
    const bar = progressRefs.current.get(panelIndex);
    const fraction = duration > 0 ? Math.min(current / duration, 1) : 0;
    if (bar) bar.style.transform = `scaleX(${fraction})`;
  }, []);

  // Tell the header whether it is sitting on the hero, and on what.
  useEffect(() => {
    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      // Solid once the ink control block reaches the header: a transparent header over
      // that block would put the ink logo on ink.
      const overHero = node.getBoundingClientRect().bottom > HEADER_HEIGHT;
      setHeroChrome({ overHero, tone });
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
              loop={total < 2}
              onEnded={total > 1 && index === i ? () => go(i + 1) : undefined}
              onTick={(current, duration) => onTick(i, current, duration)}
            >
              {panel.overlay}
            </FilmPanel>
          ) : (
            panel.node
          )}
        </div>
      ))}

      {/*
        Dot navigation (client, Nov 2026: the ink control block overlapped the hero's
        links). One dot per slide, bottom centre. The current slide's dot stretches into a
        short track that fills with its film's playback; pressing it pauses or resumes the
        film — moving video must stay stoppable (WCAG 2.2.2) without a visible button.
      */}
      {total > 1 || activeFilm ? (
        <div
          role="group"
          aria-label="Hero slides"
          className={cn(
            "absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1 md:bottom-5",
            tone === "dark" ? "text-co-bg" : "text-co-ink",
          )}
        >
          {panels.map((panel, i) => {
            const on = i === index;
            const isFilm = panel.kind === "film" && Boolean(panel.film.video);
            const label = on && isFilm
              ? `${paused ? "Play" : "Pause"} slide ${i + 1}: ${panelLabel(panel)}`
              : `Show slide ${i + 1}: ${panelLabel(panel)}`;
            return (
              <button
                key={i}
                type="button"
                aria-label={label}
                aria-current={on}
                onClick={() => (on && isFilm ? setUserPaused(!paused) : go(i))}
                className="group flex h-11 min-w-11 items-center justify-center px-1.5"
              >
                <span
                  className={cn(
                    "relative block h-[7px] overflow-hidden rounded-full border border-current transition-[width] duration-300 ease-(--ease-enter)",
                    on ? "w-7" : "w-[7px] opacity-60 group-hover:opacity-100",
                  )}
                >
                  {on ? (
                    <span
                      ref={(node) => {
                        if (node) progressRefs.current.set(i, node);
                        else progressRefs.current.delete(i);
                      }}
                      className="absolute inset-0 block origin-left bg-current"
                      style={{ transform: isFilm ? "scaleX(0)" : "scaleX(1)" }}
                    />
                  ) : null}
                </span>
              </button>
            );
          })}
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
  loop,
  onEnded,
  onTick,
  children,
}: {
  film: HeroFilm;
  lead: boolean;
  active: boolean;
  mounted: boolean;
  playing: boolean;
  /** One film loops; in a sequence each film plays once and hands on (`onEnded`). */
  loop: boolean;
  onEnded?: () => void;
  onTick: (current: number, duration: number) => void;
  children?: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // In a sequence a film that comes round again starts from its first frame.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !active || loop) return;
    if (video.ended || video.currentTime > 0) video.currentTime = 0;
  }, [active, loop]);

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

  /*
    A film with a portrait cut gets its video poster here, not in markup: the lead video is
    server-rendered, where the viewport is unknown, so a poster attribute would always be
    the landscape still.
  */
  const mobilePoster = film.mobile?.poster;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mobilePoster) return;
    video.poster = window.matchMedia(MOBILE_MEDIA).matches ? mobilePoster : film.poster;
  }, [mounted, mobilePoster, film.poster]);

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
      style={{ "--film-x": film.mobile ? "50%" : (film.mobileFocus ?? "50%") } as CSSProperties}
    >
      {film.mobile ? (
        <FilmPoster film={film} mobilePoster={film.mobile.poster} lead={lead} />
      ) : (
        <Image
          src={film.poster}
          alt={film.alt}
          fill
          sizes="100vw"
          preload={lead}
          loading={lead ? "eager" : "lazy"}
          className={FRAME}
        />
      )}
      {(film.video || film.mobile?.video) && mounted ? (
        <video
          ref={videoRef}
          aria-hidden
          muted
          loop={loop}
          onEnded={onEnded}
          playsInline
          poster={film.mobile ? undefined : film.poster}
          // Mounting is the gate (the next film mounts a few seconds after the page
          // settles), so a mounted film loads fully and hands over without a stall.
          preload="auto"
          className={cn("absolute inset-0 h-full w-full", FRAME)}
        >
          {/* Phones take the portrait cut; `media` on <source> picks it, first match wins. */}
          {film.mobile?.video?.webm ? (
            <source src={film.mobile.video.webm} type="video/webm" media={MOBILE_MEDIA} />
          ) : null}
          {film.mobile?.video ? (
            <source src={film.mobile.video.mp4} type="video/mp4" media={MOBILE_MEDIA} />
          ) : null}
          {film.video?.webm ? <source src={film.video.webm} type="video/webm" /> : null}
          {film.video ? <source src={film.video.mp4} type="video/mp4" /> : null}
        </video>
      ) : null}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-co-bg mix-blend-multiply" />
      {children ? <div className="relative z-10 h-full">{children}</div> : null}
    </div>
  );
}

/**
 * The poster for a film with a portrait cut: one <picture>, so a phone downloads only the
 * portrait still and a desktop only the landscape one. `getImageProps` cannot emit a
 * preload link, so the lead poster asks for high fetch priority instead.
 */
function FilmPoster({ film, mobilePoster, lead }: { film: HeroFilm; mobilePoster: string; lead: boolean }) {
  const common = { alt: film.alt, fill: true, sizes: "100vw" } as const;
  const {
    props: { srcSet: mobile },
  } = getImageProps({ ...common, src: mobilePoster });
  const {
    props: { srcSet: desktop, ...rest },
  } = getImageProps({
    ...common,
    src: film.poster,
    loading: lead ? "eager" : "lazy",
    fetchPriority: lead ? "high" : "auto",
  });
  return (
    <picture>
      <source media={MOBILE_MEDIA} srcSet={mobile} />
      <source srcSet={desktop} />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in `rest` */}
      <img {...rest} className={FRAME} />
    </picture>
  );
}

/*
  The control glyphs, drawn rather than typed: Sequel Sans does not carry
  arrows or media symbols, so typed ones fell back to a system font, and ▶ can render as
  an emoji. 1.25px strokes and square fills on `currentColor`, sized to the 12px data label.
*/


