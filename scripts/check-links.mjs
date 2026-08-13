/**
 * Internal-link check.
 *
 * `/collections/stretchs` shipped as the homepage's primary hero CTA and 404'd: the
 * series wordmarks changed to STRETCH/STRETCHS in the rebrand while the route slugs
 * stayed `varidex`/`pros`, and nothing in the build objected. This walks the App Router
 * for the routes that actually exist, collects every hard-coded internal href in the
 * source, and exits non-zero on any href that resolves to nothing.
 *
 * Only literal hrefs are checked — a template literal or a variable is skipped, because
 * its value is not knowable without running the app. Dynamic segments are matched
 * against the data that generates them, so a wrong slug inside `/collections/[slug]`
 * is caught rather than waved through.
 *
 * Run: `node scripts/check-links.mjs` (wired into `npm run check:links` and `prebuild`).
 */

import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP_DIR = path.join(ROOT, "src", "app");
const SRC_DIR = path.join(ROOT, "src");

/** Route groups `(marketing)` and private folders `_lib` do not appear in the URL. */
const isRouteGroup = (segment) => segment.startsWith("(") && segment.endsWith(")");
const isPrivateFolder = (segment) => segment.startsWith("_");
const isDynamic = (segment) => segment.startsWith("[");

/** Files that define a rendered page or a route handler at their folder's path. */
const ROUTE_FILES = new Set([
  "page.tsx",
  "page.ts",
  "page.jsx",
  "page.js",
  "route.tsx",
  "route.ts",
  "route.js",
]);

const SOURCE_EXTENSIONS = new Set([".tsx", ".ts", ".jsx", ".js"]);

async function walk(dir, onFile) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      await walk(full, onFile);
      continue;
    }
    await onFile(full, entry.name);
  }
}

/**
 * Every route the App Router serves, as URL paths. Dynamic segments are kept in their
 * bracket form (`/collections/[slug]`) and expanded separately.
 */
async function collectRoutes() {
  const routes = new Set();

  await walk(APP_DIR, async (full, name) => {
    if (!ROUTE_FILES.has(name)) return;

    const segments = path
      .relative(APP_DIR, path.dirname(full))
      .split(path.sep)
      .filter((s) => s && !isRouteGroup(s) && !isPrivateFolder(s));

    routes.add(`/${segments.join("/")}`.replace(/\/+$/, "") || "/");
  });

  return routes;
}

/**
 * Concrete values for each dynamic route, read from the data that generates it.
 *
 * Kept as an explicit map rather than executing `generateStaticParams`: this script is
 * plain Node with no bundler, and the two data shapes below are the only dynamic routes
 * the site has. A new dynamic route without an entry here is reported, not ignored.
 */
async function collectDynamicParams() {
  const readSlugs = async (file) => {
    const raw = await readFile(path.join(ROOT, "src", "data", file), "utf8");
    return JSON.parse(raw).map((item) => item.slug);
  };

  const [collections, products, projects, sectors, spaces, services] = await Promise.all([
    readSlugs("collections.json"),
    readSlugs("products.json"),
    readSlugs("projects.json"),
    readSlugs("sectors.json"),
    readSlugs("spaces.json"),
    readSlugs("services.json"),
  ]);

  return new Map([
    ["/collections/[slug]", collections],
    ["/catalog/[slug]", products],
    ["/projects/[slug]", projects],
    ["/sectors/[slug]", sectors],
    ["/spaces/[slug]", spaces],
    ["/services/[slug]", services],
  ]);
}

/**
 * `href="/foo"`, `href: "/foo"`, and any prop or key whose name ends in `href` —
 * `linkHref`, `ctaHref`, `viewAllHref` and friends, which is how most of the site's
 * links are actually passed down into components. Matching bare `href` only is what let
 * the homepage's `linkHref: "/collections/stretchs"` through.
 *
 * String literals only, single or double quoted. Template literals and variables are out
 * of reach for a regex and are skipped deliberately.
 */
const HREF_PATTERN = /\b[A-Za-z]*[Hh]ref\s*(?:=|:)\s*["'](\/[^"'`{}\s]*)["']/g;

async function collectHrefs() {
  /** @type {Map<string, string[]>} href → the files it appears in. */
  const hrefs = new Map();

  await walk(SRC_DIR, async (full) => {
    if (!SOURCE_EXTENSIONS.has(path.extname(full))) return;

    const source = await readFile(full, "utf8");
    for (const match of source.matchAll(HREF_PATTERN)) {
      const href = match[1];
      const where = path.relative(ROOT, full);
      const seen = hrefs.get(href);
      if (seen) {
        if (!seen.includes(where)) seen.push(where);
      } else {
        hrefs.set(href, [where]);
      }
    }
  });

  return hrefs;
}

/** Strips the query string and hash, leaving the path to resolve. */
function toPathname(href) {
  return href.split("#")[0].split("?")[0].replace(/\/+$/, "") || "/";
}

function resolves(pathname, routes, dynamicParams) {
  if (routes.has(pathname)) return true;

  const segments = pathname.split("/").filter(Boolean);

  for (const route of routes) {
    const routeSegments = route.split("/").filter(Boolean);
    if (routeSegments.length !== segments.length) continue;

    const dynamicIndex = routeSegments.findIndex(isDynamic);
    if (dynamicIndex === -1) continue;

    const staticMatch = routeSegments.every(
      (segment, i) => isDynamic(segment) || segment === segments[i],
    );
    if (!staticMatch) continue;

    // A dynamic route with no known params cannot be validated; treat the shape match as
    // enough rather than reporting a link that may well be fine.
    const params = dynamicParams.get(route);
    if (!params) return true;
    if (params.includes(segments[dynamicIndex])) return true;
  }

  return false;
}

async function main() {
  const [routes, dynamicParams, hrefs] = await Promise.all([
    collectRoutes(),
    collectDynamicParams(),
    collectHrefs(),
  ]);

  const broken = [];
  for (const [href, files] of hrefs) {
    // `/api/...` handlers are routes too and are covered by collectRoutes. Anything
    // pointing at a file under public/ (it has an extension) is not a route.
    if (path.extname(href)) continue;
    if (!resolves(toPathname(href), routes, dynamicParams)) {
      broken.push({ href, files });
    }
  }

  // A dynamic route the param map does not know about would silently accept any slug.
  const unmapped = [...routes].filter(
    (route) => route.split("/").some(isDynamic) && !dynamicParams.has(route),
  );

  if (unmapped.length > 0) {
    process.stdout.write(
      `\nNote: ${unmapped.length} dynamic route(s) have no slug list in scripts/check-links.mjs, ` +
        `so their links are only shape-checked:\n${unmapped.map((r) => `  ${r}`).join("\n")}\n`,
    );
  }

  if (broken.length === 0) {
    process.stdout.write(
      `\nLinks OK — ${hrefs.size} internal href(s) checked against ${routes.size} route(s).\n`,
    );
    return;
  }

  process.stderr.write(`\n${broken.length} broken internal link(s):\n`);
  for (const { href, files } of broken) {
    process.stderr.write(`  ${href}\n${files.map((f) => `    ${f}`).join("\n")}\n`);
  }
  process.stderr.write("\n");
  process.exitCode = 1;
}

await main();
