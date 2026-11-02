/**
 * The homepage hero's film panels — full-bleed, no text — that follow the measured
 * "Engineered for two" panel in the hero carousel.
 *
 * To add footage: drop the files in `public/video/` and set `video` below. Ship an MP4
 * (H.264, ~1920×1080, 8–15s loop, no audio track, under ~6 MB) and, ideally, a WebM
 * alongside it. Until a video file exists the panel shows its `poster` — a still from
 * Cohuman's own install photography — so a missing file never shows an empty frame.
 * Panels whose poster is missing are dropped entirely.
 *
 * Films autoplay muted and looped only while their panel is on screen, never before it
 * is first opened (so they cost the homepage nothing up front), and never under
 * `prefers-reduced-motion`, which gets the poster.
 */
export interface HeroFilm {
  id: string;
  /** Short mono label for the pagination, e.g. "Floor". */
  label: string;
  /** Still shown before the video plays, and instead of it if there is no video. */
  poster: string;
  /** Describes the scene, for the poster's alt text. */
  alt: string;
  video?: { mp4: string; webm?: string };
  /**
   * How bright the top of the frame is, which decides the transparent header over it:
   * `light` footage keeps ink type and the black logo; `dark` footage switches to canvas
   * type and the reversed logo. Signal has no gradient scrims, so pick per film.
   */
  tone?: "light" | "dark";
}

export const HERO_FILMS: HeroFilm[] = [
  {
    id: "floor",
    label: "Floor",
    poster: "/site/hero-benching.jpg",
    alt: "A long run of Cohuman bench desking with teal task chairs on a finished open-plan floor",
    tone: "light",
    // video: { mp4: "/video/hero-floor.mp4", webm: "/video/hero-floor.webm" },
  },
  {
    id: "studio",
    label: "Studio",
    poster: "/site/hero-open-plan.jpg",
    alt: "An open-plan studio floor with workstations, a breakout table and high stools",
    // The still's ceiling is pale; switch to "dark" if the footage that replaces it is.
    tone: "light",
    // video: { mp4: "/video/hero-studio.mp4", webm: "/video/hero-studio.webm" },
  },
];
