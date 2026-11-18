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
 *
 * Since Nov 2026 the desktop files are a sharper encode of the same clip (re-sent as
 * `001(4K).mp4` — byte-identical to `VIDEO 2 .mp4`, still 1344×768): Lanczos-scaled to
 * 1920 wide with a light unsharp, H.264 CRF 21 (3.4 MB) and VP9 CRF 30 (2.0 MB), as
 * `hero-arq.*` so browsers holding the old `hero-desk.*` files fetch the new ones:
 *
 *   -vf "scale=1920:-2:flags=lanczos,unsharp=5:5:0.6:5:5:0.0,setsar=1"
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
  poster: "/video/hero-arq-poster.jpg",
  alt: "An executive desk with a marble top on a dark timber pedestal and slab legs, filmed in a slow orbit in a pale studio",
  video: { mp4: "/video/hero-arq.mp4", webm: "/video/hero-arq.webm" },
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
 * Slide 2 (client, Nov 2026): the Stretch film — one film for both designs, replacing the
 * separate Stretch S / Stretch V films. Edited from the "Stretch System Video" explainer
 * to the brief in `docs/video-brief-stretch.md`: the Cohuman wordmark, "Stretch", the leg
 * joint, the short beam, "One set of parts", the bench and round table, "Two designs"
 * (Stretch V and Stretch S side by side), the office floor rising to the plan, the
 * wordmark again (its first frame, so it loops). Delivered as `stretch-desktop.mp4`
 * (1920×1080, 22.1 s) and `stretch-mobile.mp4` (1080×1920, 17.3 s — its own tighter
 * edit, V and S stacked) with an edit log. The editor put a small Cohuman wordmark in
 * the top-right corner of every frame — a second logo beside the header's — so it is
 * painted out with `delogo` (desktop `x=1516:y=138:w=226:h=52`, mobile
 * `x=784:y=222:w=246:h=56`, at the source sizes). Audio dropped; H.264 CRF 23
 * `+faststart` and VP9 CRF 36; the phone cut scaled to 720×1280; posters are frame 0.
 */
export const STRETCH_FILM: HeroFilm = {
  id: "stretch",
  label: "Stretch",
  poster: "/video/hero-stretch-poster.jpg",
  alt: "Animated film of the Stretch system: the splayed leg joint, tables built from one set of parts, Stretch V and Stretch S side by side, and an office floor furnished with them",
  video: { mp4: "/video/hero-stretch.mp4", webm: "/video/hero-stretch.webm" },
  tone: "light",
  mobile: {
    poster: "/video/hero-stretch-mobile-poster.jpg",
    video: { mp4: "/video/hero-stretch-mobile.mp4", webm: "/video/hero-stretch-mobile.webm" },
  },
};

/** The system films that play after the lead film, in order. */
export const SYSTEM_FILMS: readonly HeroFilm[] = [STRETCH_FILM];
