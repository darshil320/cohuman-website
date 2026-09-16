@AGENTS.md

# Cohuman marketing + lead-gen website

Next.js (App Router) site for **Cohuman**, a Surat-based office-furniture brand
(legal entity: Cohuman Modularr LLP, founder Tushar Shah). Built from an earlier
e-commerce demo and converted from cart/checkout into a **lead-generation** site:
every page ends in a quote/enquiry CTA, not a purchase flow.

**Cohuman is presented as a NEW brand.** No founding year, no years-in-business, no
"since", no previous trading name, no counted stats anywhere on the site — see
"No heritage claims" under Conventions. `siteConfig` deliberately has no
`foundedYear`.

Full requirements live in `prospects/cohuman-quotation.md` (outside this repo) — this
file is the implementation-facing summary.

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

## Data layer (CMS-swap seam)

`src/lib/catalog/`:
- `types.ts` — `Category`, `Collection`, `Product`, `Project`, `Space`, `Service`
- `repository.ts` — the `CatalogRepository` interface every page depends on
- `local-repository.ts` — reads `src/data/*.json`; the only implementation today
- `index.ts` — exports a single `catalog` instance. **To move to a headless CMS
  later** (open item — client hasn't confirmed they want self-serve editing),
  write a new class implementing `CatalogRepository` against the CMS and swap the
  instantiation in this one file. No page or component should ever import
  `src/data/*.json` directly except the local repository and, for form option
  lists, `enquiry-form.tsx`/`b2b-form.tsx`.

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
  The enquiry posts to the existing `POST /api/enquiry` with configuration, size and
  bill of components folded into `interest`/`message`.
- **Viewer** — WebGL stage (`three` + `@react-three/fiber`, demand-driven frame loop:
  frames are requested by the animations, so an idle viewer costs nothing). A
  `next/image` poster sits under the canvas as both first paint and the no-WebGL
  fallback; `WebglBoundary` catches a lost context. Product shots are on white, so
  every one of them composites with `mix-blend-multiply` (CSS) or the feathered plate
  shader (WebGL) — do not swap either for luminance keying, it eats the white frame legs.
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

## Lead capture

Three separately-tracked lead sources (analytics `source` field), each with its
own API route and Zod schema:

| Source | Form component | API route | Where it appears |
|---|---|---|---|
| `product_enquiry` | `EnquiryForm` | `POST /api/enquiry` | Quote dialog (site-wide), catalog/product/collection "Enquire" buttons, contact page |
| `b2b_bulk_order` | `B2bForm` | `POST /api/b2b` | `/b2b` page (first-class, not a footer link) |
| `showroom_visit` | `ShowroomVisitForm` | `POST /api/showroom-visit` | Contact page, second tab |

`src/lib/leads/store.ts` (`recordLead`) does two things per submission: sends a
Resend email to `siteConfig.email`, and best-effort appends a JSONL line under
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

- **`src/lib/site-config.ts`** — anything still marked `TODO: confirm` (phone,
  WhatsApp number, hours, map embed URL) is a placeholder. The email addresses,
  office contacts and `url` are confirmed; `url` resolves to `https://cohuman.in`
  and is no longer the old `cohuman.example.com`, which used to poison every
  canonical, `og:url` and sitemap entry.
- **`src/components/common/image-placeholder.tsx`** — every product/project/hero
  image renders a labelled gradient card until a real `src` is passed. Grep for
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
  proof stat (clients served, projects delivered, brands represented). The plain word
  "founded" is fine. `siteConfig` has no `foundedYear` on purpose — if you find
  yourself wanting to add one back, that is the rule firing, not a gap.
- **Reveals are CSS, not framer.** `Reveal`/`StaggerItem` (`ui/scroll-reveal.tsx`) and
  `KineticHeading` (`ui/kinetic-heading.tsx`) are server components that animate via
  the `co-reveal`/`co-word-rise` keyframes, gated on `html.co-js` — a class set by a
  blocking inline script in `layout.tsx`. No script means nothing is ever hidden. Do
  not reintroduce framer `initial={{ opacity: 0 }}` on static content: it serializes
  as an inline `opacity:0`, so the page is blank when JS fails. `TextReveal` is the
  old framer version, still used on secondary routes; prefer `KineticHeading`.
- The drawing-sheet primitives (`SpecLabel`, `TickRail`, `MeasureRule`, `ClipReveal`)
  live in `src/components/ui/` and are shared by `/` and `/about`. Section labels read
  `01 / Systems` on the homepage and `§01 — Definition` on /about.
