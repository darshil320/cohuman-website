/**
 * Films for the homepage hero carousel.
 *
 * `LEAD_FILM` is the hero: full bleed under the transparent header, with the page's
 * claim on a title block over it. It is the only panel — the Nov 2026 review removed the
 * panel selector, the comparison film and the measured panel behind it.
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
 * Slide 2 (client, Nov 2026): a 28-second cut of the "Stretch System Video" explainer
 * (1920×1080, 30 fps, 1:59 — Drive, Workstation / Strech S / Source), in five parts joined
 * by 0.5 s dissolves: the Cohuman wordmark, centred (114.0–116.8 s) → "STRETCH", centred
 * (0.3–3.2) → the leg joint, the legs and the short beam (18.0–24.5) → "Two designs",
 * Stretch V and Stretch S side by side, the workstations and an office floor
 * (97.6–113.6) → "Make it work" (117.0–118.8). Full frame — the explainer's logo pill in
 * the top-right corner is painted out with `delogo`, not cropped, so the wordmark stays
 * centred. Recipe (one input, five `trim` → `delogo=x=1696:y=26:w=200:h=110` → `xfade`):
 * `/tmp/vid/build.sh` in the session that made it; H.264 CRF 23 + VP9 CRF 36; poster at 0.5 s.
 * Plays after the lead film, then hands back to it. Phones get a portrait version: the
 * whole frame scaled to the phone's width (720×1564), over a washed-out, colourless,
 * heavily softened copy of itself (`gblur=sigma=60,eq=contrast=0.3:brightness=0.28:
 * saturation=0`), so the wordmark and the Stretch V / S pair are never cropped.
 */
export const SYSTEM_FILM: HeroFilm = {
  id: "system",
  label: "Stretch",
  poster: "/video/hero-system-poster.jpg",
  alt: "Animated film of the Stretch system: a Stretch V and a Stretch S table side by side, then both set up as workstations across an office floor",
  video: { mp4: "/video/hero-system.mp4", webm: "/video/hero-system.webm" },
  tone: "light",
  mobile: {
    poster: "/video/hero-system-mobile-poster.jpg",
    video: { mp4: "/video/hero-system-mobile.mp4", webm: "/video/hero-system-mobile.webm" },
  },
};
