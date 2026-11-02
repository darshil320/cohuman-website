/**
 * The site-wide share card, as a value a page can put in its own `openGraph`.
 *
 * Next replaces — it does not merge — a parent's `openGraph` when a page declares its
 * own. So every route that sets `openGraph: { title, description, url }` silently loses
 * the card `src/app/opengraph-image.tsx` provides at the root, and a shared link renders
 * as a bare text row. Pages that set their own `openGraph` spread this in unless they
 * have a better image of their own (a collection's render, a sector's photograph).
 *
 * The URL is the un-hashed route; Next serves the same prerendered PNG at it.
 */
export const SHARE_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Cohuman — Engineered for two. Scaled for the floor.",
} as const;
