/**
 * Films for the homepage hero carousel.
 *
 * `LEAD_FILM` opens the hero: full bleed under the transparent header, with the page's
 * claim on a title block over it. `COMPARE_FILM` follows it, with the previous design.
 * `HERO_FILMS` are further text-free film panels placed after the measured "Engineered
 * for two" panel — none today.
 *
 * Footage lives in `public/video/`. Ship an MP4 (H.264, no audio track, `+faststart`) and,
 * ideally, a WebM alongside it, plus a `poster` still taken from the film's first frame —
 * the poster is what paints first (the LCP image), what a reduced-motion reader sees, and
 * what shows with scripting off. Panels whose poster is missing are dropped entirely; a
 * missing video leaves the poster as a still.
 *
 * The current lead film is a web encode of a client-supplied studio clip
 * (`gemini_generated_video_c7a02e58.mp4`, 1280×720, 10s, four shots: wide, marble
 * close-up, lift-column close-up, wide), prepared with ffmpeg: audio stripped, and cropped
 * 12% from the right edge to frame out a corner watermark, at the client's instruction.
 * The edit is the client's own and plays in full; it ends on a wide shot and loops to a
 * wide shot. Because the close-ups fill the frame, the claim sits on its own title block
 * (`film-intro.tsx`), not on the footage. To swap in another export:
 *
 *   ffmpeg -i <src> -vf "crop=<0.88×width>:<height>:0:0" -an -c:v libx264 -profile:v high
 *     -pix_fmt yuv420p -preset slow -crf 21 -movflags +faststart hero-desk.mp4
 *
 * (the same filter to VP9 for the WebM; the poster is a frame from the first wide shot).
 */
export interface HeroFilm {
  id: string;
  /** Short mono label for the pagination, e.g. "Film". */
  label: string;
  /** Still shown before the video plays, and instead of it if there is no video. */
  poster: string;
  /** Describes the scene, for the poster's alt text. */
  alt: string;
  video?: { mp4: string; webm?: string };
  /**
   * How bright the frame is where the header and the claim sit: `light` footage keeps ink
   * type and the black logo; `dark` footage switches to canvas type and the reversed logo.
   * Signal has no gradient scrims, so pick per film.
   */
  tone?: "light" | "dark";
  /**
   * Horizontal focus of the frame on narrow (portrait) screens, as a CSS percentage —
   * a phone shows about a third of a landscape film's width, so choose the part worth
   * keeping. Desktop always centres.
   */
  mobileFocus?: string;
}

export const LEAD_FILM: HeroFilm = {
  id: "desk",
  label: "Film",
  poster: "/video/hero-desk-poster.jpg",
  alt: "An executive desk with a marble top on a dark timber pedestal and slab legs, filmed in a pale studio: wide shots and close-ups of the marble and the lift column",
  video: { mp4: "/video/hero-desk.mp4", webm: "/video/hero-desk.webm" },
  tone: "light",
  // On a phone: left of centre, where the lift column stands in the close-up and the
  // pedestal meets the top in the wide shots.
  mobileFocus: "40%",
};

/**
 * The previous hero, kept as panel 02 so the client can compare the two before choosing:
 * a 1280×720 studio clip (`Video 1.MOV`, the same 12% crop, no audio) trimmed to its
 * opening wide shot and played forward then back, so it loops without a cut and the
 * desk never rises into the top of the frame — the claim sits directly on that empty
 * sweep (`FilmBand`). Remove it, its overlay and `public/video/hero-desk-loop*` once the
 * client has picked one.
 */
export const COMPARE_FILM: HeroFilm = {
  id: "desk-loop",
  label: "Film",
  poster: "/video/hero-desk-loop-poster.jpg",
  alt: "An executive desk with a marble top on a dark pedestal and slab legs, in a pale grey studio",
  video: { mp4: "/video/hero-desk-loop.mp4", webm: "/video/hero-desk-loop.webm" },
  tone: "light",
  // On a phone: the slab legs and the end of the marble, not the dark pedestal mass.
  mobileFocus: "88%",
};

export const HERO_FILMS: HeroFilm[] = [];
