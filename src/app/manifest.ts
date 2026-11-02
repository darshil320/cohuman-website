import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/*
  Web app manifest.

  Not a PWA — there is no service worker and nothing here works offline. It exists so
  that a visitor who adds the site to a phone home screen gets the compact mark and the
  company name rather than a screenshot and a URL, and so Android's "install" prompt
  has a name and a theme colour to use. `display: "browser"` says so plainly: this is a
  website, and tapping the icon should open it as one.
*/
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description:
      "Office furniture designed around the people who use it — desking, ergonomic seating, conference tables, storage and reception furniture, designed and manufactured in Surat.",
    start_url: "/",
    display: "browser",
    // Canvas and ink from globals.css (`--color-co-bg` / `--color-co-ink`). The icons are
    // the compact mark reversed on ink, so the ink theme colour frames them without a seam.
    background_color: "#fbf8ee",
    theme_color: "#231f20",
    lang: "en-IN",
    categories: ["business", "shopping"],
    /*
      These point at files in `public/`, not at the `app/` icon conventions. Next serves
      `app/apple-icon.png` from a hashed metadata route (`/apple-icon?<hash>`), so the
      literal `/apple-icon.png` this used to list resolved to nothing and Android fell
      back to a screenshot. `public/` paths are stable URLs, which is what a manifest
      needs.
    */
    icons: [
      { src: "/favicon.ico", sizes: "16x16 32x32 48x48 256x256", type: "image/x-icon" },
      { src: "/site/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/site/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
