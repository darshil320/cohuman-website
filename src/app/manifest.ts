import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/*
  Web app manifest.

  Not a PWA — there is no service worker and nothing here works offline. It exists so
  that a visitor who adds the site to a phone home screen gets the leaf mark and the
  company name rather than a screenshot and a URL, and so Android's "install" prompt
  has a name and a theme colour to use. `display: "browser"` says so plainly: this is a
  website, and tapping the icon should open it as one.
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description:
      "Office furniture designed around the people who use it — desking, ergonomic seating, conference tables, storage and reception furniture, manufactured in Surat since 1989.",
    start_url: "/",
    display: "browser",
    // Matches `--color-co-bg` / `--color-co-green` in globals.css.
    background_color: "#ffffff",
    theme_color: "#16181b",
    lang: "en-IN",
    categories: ["business", "shopping"],
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48 256x256", type: "image/x-icon" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
