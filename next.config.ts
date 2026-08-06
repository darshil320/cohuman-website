import type { NextConfig } from "next";

// All imagery is served from `public/` now — the Unsplash remote pattern this used to
// carry is gone along with the stock photography it allowed.
const nextConfig: NextConfig = {
  images: {
    // Next only optimises to qualities listed here. 75 is the default; 90 is what the
    // series renders and the full-screen viewer ask for, since both get magnified past
    // 1:1; 100 is the hero, which is the first thing anyone sees.
    qualities: [75, 90, 100],
  },
};

export default nextConfig;
