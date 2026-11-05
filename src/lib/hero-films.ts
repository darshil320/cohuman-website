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
 * (`VIDEO 2 .mp4`, 1344×768, 10s): one continuous orbit around the marble-topped
 * executive desk, no cuts and no watermark, so it plays full frame with only the audio
 * stripped. The claim sits on its own title block (`film-intro.tsx`) top left, the
 * calmest corner of the frame. To swap in another export:
 *
 *   ffmpeg -i <src> -an -c:v libx264 -profile:v high -pix_fmt yuv420p -preset slow
 *     -crf 21 -movflags +faststart hero-desk.mp4
 *
 * (VP9 `-crf 33` for the WebM; the poster is the first frame). Crop a watermark out with
 * `-vf "crop=…"` when a clip carries one.
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
  /**
   * A portrait cut for phones (below 768px), swapped in by media query for both the
   * poster and the video. With one, `mobileFocus` no longer applies — the portrait frame
   * is shown centred.
   */
  mobile?: { poster: string; video?: { mp4: string; webm?: string } };
}

export const LEAD_FILM: HeroFilm = {
  id: "desk",
  label: "Film",
  poster: "/video/hero-desk-poster.jpg",
  alt: "An executive desk with a marble top on a dark timber pedestal and slab legs, filmed in a slow orbit in a pale studio",
  video: { mp4: "/video/hero-desk.mp4", webm: "/video/hero-desk.webm" },
  tone: "light",
  // On a phone without the portrait cut: left of centre, where the pedestal meets the
  // marble top through the orbit.
  mobileFocus: "40%",
  /*
    The client's portrait export of the same desk (`ARQ Phone view.mp4`, 1440×2518, 5s).
    Re-cut to a phone's 9:19.5 so `object-cover` never crops the desk's ends: 8px off the
    top (a light line in the export), the empty sweep above the desk (rows 0–900) stretched
    to 1673, the floor below trimmed — the desk travels 57–79% down the frame, clear of
    the title block. 720×1564, no audio:

      ffmpeg -i "ARQ Phone view.mp4" -an -filter_complex "[0:v]crop=1440:2510:0:8,split[a][b];
        [a]crop=1440:900:0:0,scale=1440:1673,setsar=1[top];[b]crop=1440:1457:0:900,setsar=1[rest];
        [top][rest]vstack,scale=720:-2,setsar=1[v]" -map "[v]" … hero-desk-mobile.mp4

    `setsar=1` matters: without it the stretch leaves non-square pixels and browsers
    widen the video.
  */
  mobile: {
    poster: "/video/hero-desk-mobile-poster.jpg",
    video: { mp4: "/video/hero-desk-mobile.mp4", webm: "/video/hero-desk-mobile.webm" },
  },
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
