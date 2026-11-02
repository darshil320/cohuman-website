@AGENTS.md

# Cohuman marketing + lead-gen website

Next.js (App Router) site for **Cohuman**, a Surat-based office-furniture brand
(legal entity: Cohuman Modularr LLP, founder Tushar Shah). Built from an earlier
e-commerce demo and converted from cart/checkout into a **lead-generation** site:
every page ends in a quote/enquiry CTA, not a purchase flow.

**Cohuman is presented as a NEW brand.** No founding year, no years-in-business, no
"since", no previous trading name, no counted stats anywhere on the site — see
"No heritage claims" under Conventions. `siteConfig` deliberately has no
`foundedYear`. The one exception, on the client's decision: a founder's *personal*
career history on /about (Tushar Shah's bio names a year, a duration and the brands he
introduced to India).

Full requirements live in `prospects/cohuman-quotation.md` (outside this repo) — this
file is the implementation-facing summary.

## Design system — Signal

The site is built to moodboard direction **01 — Signal** (`moodboards/01-signal.html`):
an engineering brand, a spec sheet you can walk into. **`design.md` is the full
reference** — palette with contrast ratios, type scale, logo rules, components, motion.
The short version:

- **Palette "Ivory paper"** (values in `src/app/globals.css`; token *names* are
  historical, *values* are the Signal roles): canvas `#FBF8EE` (never pure white), fog
  `#F3EFE1`, brand ink `#231F20`, steel `#6B665D` for meta, hair `#DCD6C4`, and the
  logo green `#5EB646` (`co-green`) as a **status light only** — selected, active,
  progress, sent. One green thing per screen; the header's quote dots already are one.
- **Type:** Archivo Expanded (Archivo at `wdth` 125, 600, caps, −0.02em, 0.9) for
  claims; Archivo for reading; Martian Mono (`wdth` 87.5, 11px caps) for anything you
  could measure. Utilities `co-display`/`co-h1`–`co-h3`, `co-data`, `co-eyebrow`; tokens
  `--font-display`, `--font-body`, `--font-mono`.
- **Logo:** the client's vector masters in `public/brand/` (`logo-primary.svg`,
  `logo-reverse.svg`, mono variants, and the compact `mark-*.svg`), placed only via
  `<Logo>` (`src/components/common/logo.tsx`) — never retyped or redrawn. Min 140px
  wide. Icons are the official compact mark reversed on ink (`src/app/icon.svg` plus
  raster fallbacks rendered from it).
- **Drawing set:** square corners (the two dots are the only round thing), 1px rules,
  a 12-column hairline grid on heroes, registration crosses, "Fig. 0X" captions, and a
  `DimensionLine` on **every product render** with sizes read from `src/lib/series`
  (`rangeLabel`/`configLengthLabel`/`configSizeRange`/`spanLabel` in `derive.ts`) —
  never typed. No gradients, glass, blur, shadows, glows or hover zooms.
- **Cut-outs:** product renders take `co-cutout` (multiply + feathered edge). Never wrap
  one in an element with `clip-path`/`filter`/`opacity`/an isolating transform — the
  white box comes back. Interiors take `co-highkey`.

## Stack

- Next.js (App Router) + TypeScript, React 19
- Tailwind CSS v4 (tokens in `src/app/globals.css` via `@theme inline`, no
  `tailwind.config.*` needed)
- Hand-rolled shadcn-style primitives in `src/components/ui/` (button, input,
  textarea, select, label) — cva + `cn()` (`src/lib/utils.ts`), Radix primitives
  for Dialog/Label/Slot
- Zod for all form/API validation (`src/lib/leads/schema.ts`)
- Resend for lead emails, `@vercel/analytics` + `@vercel/speed-insights` for
  metrics
- Content: local JSON files (`src/data/*.json`) behind a repository interface —
  see "Data layer" below
- Fonts: Archivo + Martian Mono via `next/font/google` with `axes: ["wdth"]`
- Vitest for the pure data helpers (`npm test`)

## Data layer (CMS-swap seam)

`src/lib/catalog/`:
- `types.ts` — `Category`, `Collection`, `Product`, `Project`, `Space`, `Service`,
  `Founder` (the last is inferred from `founder-schema.ts`)
- `repository.ts` — the `CatalogRepository` interface every page depends on
- `local-repository.ts` — reads `src/data/*.json`; the only implementation today.
  `founders.json` is **parsed** with `foundersSchema`, not cast, so a bad entry fails
  the build with a readable message
- `index.ts` — exports a single `catalog` instance. **To move to a headless CMS
  later** (open item — client hasn't confirmed they want self-serve editing),
  write a new class implementing `CatalogRepository` against the CMS and swap the
  instantiation in this one file. No page or component should ever import
  `src/data/*.json` directly except the local repository and, for form option
  lists, `enquiry-form.tsx`/`b2b-form.tsx`.

## Founders (`/about`)

`src/data/founders.json` → `catalog.getFounders()` → one `FounderCard` per entry in the
Founders section of `/about`. Fields: `slug`, `name`, `role`, `bio` (2–4 sentences),
`focus[]`, optional `photo { src, alt }` (file in `public/founders/`), `linkedin` (https
linkedin.com), `quote`. Two founders today — Tushar Shah (Co-founder & CEO) and Jigar
Rathod (Co-founder & COO), bios verbatim from the client; the section's closing line is
`FOUNDERS_CLOSE` in `src/app/about/page.tsx`. **Photos and LinkedIn are pending** — a
founder without a photo gets a labelled empty frame (never a stock face). Focus areas
were taken from the bios, not supplied separately. `src/lib/catalog/founders.test.ts`
allows personal career history (the exception above) but rejects the old trading name,
counted track records and photo paths that don't exist — run `npm test` after editing.

## Collections are desking series, not SKU lists

Every collection is a configurable desking system, so `/collections/[slug]` renders a
configurator rather than a product grid: the customer picks a configuration plus a
length and depth before enquiring, and the quote depends on all three. Two series ship
today, both ported from the manufacturer's own specification PDFs (`PROS.pdf` via the
Claude Design source `PROS Series PDP.dc.html`, and `VARIDEX.pdf`).

The four demo collections (Meridian, Origin, Loom, Parlour) were invented for the
original e-commerce demo and are **gone**, along with the `col` field that pointed at
them from `src/data/products.json`. Products belong to a category and a price band; a
collection is a desking series with a configurator, not a bucket for SKUs.

- **Data** — `src/lib/series/`: `types.ts` (`SeriesDefinition`), `derive.ts` (every
  size/label derivation), then one folder per series (`pros/`, `varidex/`) holding
  configs, elements, anatomy parts and finishes. `index.ts` exports `ALL_SERIES` and
  `findSeries`. This is spec data quoted to customers — treat edits as data changes,
  not copy tweaks.
- **Adding a series** — write a `SeriesDefinition`, add it to `ALL_SERIES`, and add a
  matching entry to `src/data/collections.json` (which drives /collections, the
  sitemap and llms.txt). No component changes.
- **Optional sections** — a definition can omit `swatches` (finish board), `accessory`
  (VARIDEX's wire-channel SKU table) or `gallery` (photographed-but-unquoted
  products); those components return `null`. VARIDEX has no finish filter because its
  PDF specifies materials, not colours.
- **One client boundary** — `src/components/series/series-pdp.tsx` shares configurator
  state, so the viewer, size chart, sticky bar and enquiry payload cannot disagree.
- **Page order is officemate's**, beat for beat: A name hero (`series-name-hero`) → B ink
  spec block with the viewer, square size selectors and the green progress rail
  (`series-spec-block`, `series-config-rail` at `#configurations`) → C per-configuration
  gallery (`series-config-gallery`) → the drawing-set sections (assembly, elements,
  anatomy, finishes, accessory, products — numbered as they render, see
  `src/lib/series/sections.ts`) → D prev / Get a quote · all / next (`series-pager`, in
  the page flow, never fixed) → enquiry. The sticky quote bar shows between the spec
  block and the pager, then hands off to the pager's own quote button. **There is no
  size chart** — the client removed it; the per-configuration sizes live in the spec
  block's selectors (and `chartLengths`/`chartDepths` still feed llms.txt).
- **Configuration picker** (`series-config-rail.tsx` + `series-config-flight.tsx`): a
  horizontal filmstrip. The chosen card grows (name, size range, seats, code) while the
  others shrink, then a copy of its render flies into the viewer (`[data-viewer-frame]`
  in `series-stage.tsx`) as the page scrolls up to it, and the strip re-centres on it.
  Reduced motion: instant select and jump.
  The enquiry posts to the existing `POST /api/enquiry` with configuration, size and
  bill of components folded into `interest`/`message`.
- **Viewer** — WebGL stage (`three` + `@react-three/fiber`, demand-driven frame loop:
  frames are requested by the animations, so an idle viewer costs nothing). A
  `next/image` poster sits under the canvas as both first paint and the no-WebGL
  fallback; `WebglBoundary` catches a lost context. Product shots are on white, so
  every one of them composites with `co-cutout` (CSS multiply + feather) or the plate
  shader (WebGL: a flat canvas-coloured backdrop and `texel × canvas`, which is multiply
  done exactly) — do not swap either for luminance keying, it eats the white frame legs.
  If `--color-co-bg` ever changes, change `CANVAS` in `stage-shaders.ts` with it.
- **Motion** — `framer-motion` under `MotionConfig reducedMotion="user"`. Do not branch
  on `useReducedMotion` in markup; it produces different server and client trees and
  trips hydration.

### Photography

`public/pros/` and `public/varidex/` hold the manufacturer's studio renders, extracted
from the two PDFs (page layers → auto-cropped to content → 1400px JPEG). Several
configurations legitimately share one shot where the PDF photographs a family once.
There are no image placeholders left on these pages.

**Open items:**

- **Four inferred PROS part numbers** (straight connector, side cabinet, credenza,
  wire box) are pattern-matched, not confirmed. They render with a `°` marker plus a
  footnote; the list is `inferredCodes` on the PROS definition. Every VARIDEX code is
  printed in its PDF.
- **PROS finish swatches** are CSS gradients, not photographed swatches, and the finish
  names/codes (`PROS-TOP-NOK`…) came from the design source rather than the PDF.
- **VARIDEX sizes are ranges.** The PDF quotes each top between two limits; only the
  endpoints are offered, and no intermediate size is invented. Seat counts show `—`
  where the PDF does not state one.

## Demo catalog

`src/data/products.json` (16 products) and `projects.json` are still the illustrative
data carried over from the original demo, and `/catalog` still serves them. They are
not real Cohuman products — replace them as real product data arrives. The catalog
filters by category and price band only.

## Homepage hero

`src/components/home/hero-carousel.tsx`: a full-screen carousel that runs under the
header. Panel 1 is `SignalHeroPanel` (`signal-hero.tsx` — the measured bench on the
hairline grid, drawn in green on this panel only, with the render layered above the
lines). Further panels are full-bleed films with no text, configured in
**`src/lib/hero-films.ts`**: drop an MP4 (and optional WebM) in `public/video/` and set
`video`; until then each panel shows its poster still. Set each film's `tone`
(`light`/`dark` — how bright the top of the frame is) so the header picks readable type.
While the hero is under it the header is transparent (`src/lib/hero-chrome.ts`, a tiny
store the carousel publishes to). The header must never get `backdrop-filter`, `filter`
or `transform` — see the comment in `site-header.tsx` for the mobile-menu bug that
caused.

## Lead capture

Three separately-tracked lead sources (analytics `source` field), each with its
own API route and Zod schema:

| Source | Form component | API route | Where it appears |
|---|---|---|---|
| `product_enquiry` | `EnquiryForm` | `POST /api/enquiry` | Quote dialog (site-wide), catalog/product/collection "Enquire" buttons, contact page |
| `b2b_bulk_order` | `B2bForm` | `POST /api/b2b` | `/b2b` page (first-class, not a footer link) |
| `showroom_visit` | `ShowroomVisitForm` | `POST /api/showroom-visit` | Contact page, second tab |

`src/lib/leads/store.ts` (`recordLead`) does two things per submission: sends a
Resend email to `siteConfig.email` (**tushar@cohuman.in**), and best-effort appends a JSONL line under
`.leads/` (gitignored). **Known limitation:** the JSONL log only persists on an
always-on server or in local dev — Vercel Functions have an ephemeral
filesystem, so in production the Resend email is the durable record for v1. If
lead volume grows enough to need a real log, replace `appendLocalLog` with a
proper store (Vercel KV/Postgres) — do not build a CRM here, that's a separate
engagement.

`RESEND_API_KEY` and `RESEND_FROM_EMAIL` are read from env; without
`RESEND_API_KEY` set, submissions still succeed (validated + logged) but no
email sends — set it before launch. Setting `RESEND_API_KEY` **without**
`RESEND_FROM_EMAIL` now throws rather than falling back to a placeholder sender:
an unverified from-address makes Resend reject the send, which would drop the lead
silently. Use a verified sender on the real domain (e.g. `leads@cohuman.in`).

## Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production: no. Previews: yes | Canonical origin for `metadataBase`, every `canonical`/`og:url`, sitemap, robots.txt and llms.txt. Defaults to `https://cohuman.in`. Set it to the deployment's own origin on preview environments so previews don't advertise production URLs to crawlers and scrapers. |
| `RESEND_API_KEY` | Before launch | Sends the lead email. Absent → leads validate and log, no email. |
| `RESEND_FROM_EMAIL` | Whenever `RESEND_API_KEY` is set | Verified sender address. |

The quote dialog (`src/components/providers/quote-dialog-provider.tsx`) is a
global context (`useQuoteDialog().openQuote(subject?)`) — any component can pop
it with a prefilled "interest" subject (a product name, collection, service, or
space type).

## Placeholder content — do not ship as-is

- **`siteConfig.coordinates`** (hero, footer, showroom) are Surat city-centre, marked
  `TODO: confirm` — replace with the showroom's own.
- **`src/data/founders.json`** is empty until the client sends names, roles, bios,
  focus areas and photos.
- **`siteConfig.suratPhotos` is empty on purpose.** The only showroom photo on file,
  `public/site/surat-storefront.jpg`, shows the shop sign "FURNITURE CONCEPTS-2.0" (the
  previous trading name). It is kept on disk but not listed; the showroom sections on
  `/`, `/about` and `/contact` render text-only until a photo without the old signage is
  added. Check any new photography for old signage before listing it.

- **`src/lib/site-config.ts`** — anything still marked `TODO: confirm` (phone,
  WhatsApp number, hours, map embed URL, coordinates) is a placeholder. The email addresses
  (tushar@ — the lead inbox — jigar@, devan@ and accounts@cohuman.in; devan@ forwards to
  devan@officeideas.in at the mail server), founders, office contacts and `url` are
  confirmed; `url` resolves to `https://cohuman.in`
  and is no longer the old `cohuman.example.com`, which used to poison every
  canonical, `og:url` and sitemap entry.
- **`src/components/common/image-placeholder.tsx`** — every product/project/hero
  image renders a labelled fog frame until a real `src` is passed. Grep for
  `<ImagePlaceholder` usages without `src` before launch.
- **`src/data/products.json`, `projects.json`** — SKUs, specs and case studies
  are illustrative, carried over from the original demo. Real product data,
  photography, and project case studies (with permission to publish) are open
  items with the client. **No product has been photographed:** `Product.images`
  is optional and absent on all 16, so each PDP shows one photograph of its
  category and no thumbnail strip. Do not re-add filler frames — the page
  previously rendered the same category file four times under the labels
  "Detail"/"Angle"/"In situ", so all 16 PDPs shared four images between them.
  Populate `images` per product as real shots arrive and the strip appears.
- **Represented-brand claims are gone.** `brandsRepresented`, the brand marquee
  (`brand-marquee.tsx`) and `brand-logos.ts` were removed: whether the
  MERRYFAIR/SPACEWOOD/Humanscale partnerships apply to the Cohuman entity is
  unconfirmed. Do not re-add them until Tushar/Vaibhav confirm. `public/brands/`
  is still on disk pending that decision.
- Pricing is shown only as a qualitative band (`budget`/`value`/`premium` →
  "Value"/"Mid"/"Premium") plus "Price on request" — whether real prices should
  ever be public is an open decision, not yet made.

## Explicit non-goals (do not add)

No cart/checkout/payment gateway, no user accounts/login, no AI room visualizer,
no CRM/pipeline dashboard, no i18n. All were in the original demo or requested
elsewhere and were deliberately cut to keep this a lead-gen site, not an
e-commerce or SaaS product.

## Commands

```bash
npm run dev          # local dev
npm run build        # production build (runs check:links first via prebuild)
npm run lint         # eslint
npm run check:links  # every literal internal href resolves to a real route
npm test             # vitest — series size labels, founders data
```

`check:links` (`scripts/check-links.mjs`) walks the App Router for real routes,
expands dynamic segments against `src/data/*.json` slugs, and fails the build on any
hard-coded `href`/`*Href` string that resolves to nothing. It exists because
`/collections/stretchs` shipped as the homepage's primary hero CTA and 404'd — the
series **wordmarks** became STRETCH/STRETCHS in the rebrand while the route **slugs**
stayed `varidex`/`pros`. Slugs are the URL contract; renaming a wordmark never renames
a route. Template-literal and variable hrefs are out of the checker's reach.

## Conventions

- Tailwind: use only the default spacing scale (halves up to 3.5, then whole
  numbers) or explicit `[18px]`-style arbitrary values — fractional utilities
  like `p-4.5` or `gap-5.5` silently produce no CSS.
- Server components fetch via `catalog.*` and resolve display labels with
  `src/lib/catalog/resolve.ts` (`resolveCatLabel`, `resolveColName`); only
  components that open the quote dialog or manage local state (buttons, forms,
  filters) are client components.
- No `console.log` in committed code; surface errors via thrown errors / API
  error responses instead.
- Animated figures use `useCountUp` (`src/lib/use-count-up.ts`) via `CountUp` or
  `AnimatedStat`. The hook's state **starts at the finished value** and only resets to
  zero in a browser-only layout effect, so the served HTML carries the real number.
  Initialising a counter at zero puts `0 yrs` in the static HTML — which is what a
  crawler reads and what stays on screen if JS is blocked or hydration fails.
- **No heritage claims.** Cohuman is a new brand: never add a founding year, a
  years-in-business count, "since <year>", "Furniture Concepts", or any counted
  proof stat (clients served, projects delivered, brands represented). Exception: a
  founder's personal career history in `founders.json`, which the client approved. The plain word
  "founded" is fine. `siteConfig` has no `foundedYear` on purpose — if you find
  yourself wanting to add one back, that is the rule firing, not a gap.
- **Reveals are CSS, not framer — "plotter, not fade".** `Reveal`/`StaggerItem`
  (`ui/scroll-reveal.tsx`), `ClipReveal` and `KineticHeading` are server components:
  blocks and images **wipe left → right** (`co-reveal`, `co-clip`), rules **draw** at
  400ms linear (`co-rule`), headline words lift (`co-word-rise`); sizes **tick** on change
  (`useTick`/`TickNumber`). All gated on `html.co-js` — a class set by a blocking inline
  script in `layout.tsx` — so no script means nothing is ever hidden, and all disabled
  under `prefers-reduced-motion`. Do not reintroduce framer `initial={{ opacity: 0 }}`
  on static content: it serializes as an inline `opacity:0`, so the page is blank when
  JS fails.
- **Share images.** `src/app/opengraph-image.tsx` is the site-wide card. A page that sets
  its own `openGraph` *replaces* the parent's, image included — so spread
  `images: [SHARE_IMAGE]` (`src/lib/seo/share-image.ts`) into it unless the page has a
  better image of its own.
- **Green is state.** Never use `co-green` as text (2.35:1 on canvas), decoration, a
  heading colour or a hover fill; the selected control must also say so with ink and
  `aria-pressed`/`aria-selected`/`aria-current`.
- The drawing-sheet primitives (`DimensionLine`, `RegistrationCross`, `FigureCaption`,
  `HairlineGrid`, `MeasureRule`, `SpecRows`, `IndexRow`, `SegmentedControl`,
  `FinishChip` (`dot={false}` where the progress rail is already lit), `ProgressRail`,
  `SignalDots`) live in `src/components/ui/`. Secondary routes open with `PageHero`
  (`src/components/common/page-hero.tsx`); sections open
  with `SectionHeading`; labels read `01 / Systems` on most routes and `§01 — Definition`
  on /about. The `Button` `dots` prop (the green pair) belongs to the header's quote
  button — other quote buttons stay plain ink.
