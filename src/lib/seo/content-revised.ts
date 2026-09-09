/**
 * When each part of the site's content last actually changed.
 *
 * The sitemap's `lastModified` needs a date a crawler can trust. Two tempting sources
 * are both wrong:
 *
 * - `new Date()` claims every URL changed the moment the sitemap was fetched, which
 *   teaches a crawler to ignore the field on this domain.
 * - `statSync` on the source files reads the truth, but a `process.cwd()` join inside a
 *   route makes Turbopack trace the whole project into the build ("Encountered
 *   unexpected file in NFT list"), because it cannot see where the path leads.
 *
 * So the dates are declared. **Bump the matching entry whenever you change that
 * content** — a new product in `products.json`, a new series in `src/lib/series/`, a
 * rewrite of a page. A stale date is not a build error; it only means crawlers refetch
 * a changed page later than they could have.
 */
export const CONTENT_REVISED = {
  /** Page copy, navigation and static routes. */
  site: new Date("2026-09-09"),
  /** `src/data/products.json`. */
  products: new Date("2026-09-09"),
  /** `src/data/collections.json` and the series definitions behind them. */
  collections: new Date("2026-09-09"),
  /** `src/data/sectors.json`. */
  sectors: new Date("2026-09-09"),
} as const;
