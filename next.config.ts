import type { NextConfig } from "next";

// All imagery is served from `public/` now — the Unsplash remote pattern this used to
// carry is gone along with the stock photography it allowed.
const nextConfig: NextConfig = {
  images: {
    /*
      Next only encodes at qualities listed here — a `quality=` a component asks for that
      is absent from this list is refused, so this array and the components must agree.

      72 is the hero: it is the LCP image, full-bleed behind a scrim and a headline, so
      the extra bytes between 72 and 75 buy nothing a visitor can see. 75 is the default
      everything else inherits. 90 is the series renders and the full-screen viewer, both
      of which get magnified past 1:1.
    */
    qualities: [72, 75, 90],
    // AVIF first, WebP for the browsers without it. Next's default order is the reverse,
    // which means Chrome and Safari both take the larger file.
    formats: ["image/avif", "image/webp"],
    // A year: the filenames under `public/` are content, not hashes, but every URL the
    // optimiser serves carries `w` and `q`, so a re-encode is a different URL anyway.
    minimumCacheTTL: 31536000,
    /*
      Next's default tops out at 3840. Nothing under `public/` is wider than 1920 (the
      three heroes; series renders are 1400, everything else 1600), and the optimiser
      never enlarges — a request for w=3840 returns the source width and burns its own
      cache entry for a byte-identical file. Capping at 1920 removes two of those per
      image per format.

      The widest fractional consumer is `64vw` (src/app/projects/page.tsx:48), then
      `62vw` (src/components/series/series-stage.tsx:80). Trade-off, stated plainly: on a
      3840px viewport that 62vw slot wants ~2380px and now gets 1920, so it can render
      marginally soft — but the 1400px source holds no extra detail to serve anyway.

      Fixed-pixel `sizes` ("140px" in series-config-rail, `${w}px` in series-anatomy)
      draw from `imageSizes`, not this list, and are unaffected.
    */
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

export default nextConfig;
