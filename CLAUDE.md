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
  progress, sent. The header's quote dots are on every screen, so content adds at most
  one genuine state in green (the progress rail, an active tab, a selected row). One
  deliberate exception, a client request: the green grid lines of the measured hero panel
  (`SignalHeroPanel`, now only the fallback when the lead film's poster is missing).
- **Type:** Sequel Sans, self-hosted in its three optical cuts — Disp (Semi Bold, natural
  case — titles are never uppercased — −0.02em, 1.1) for display/h1 claims, Head (Semi Bold) for h2/h3/index names, Body
  (Roman 400; 500/600 for emphasis) for reading and, with tabular figures at 12px caps
  +0.06em, for anything you could measure. Utilities `co-display`/`co-h1`–`co-h3`,
  `co-index`, `co-data`, `co-eyebrow`; tokens `--font-display`, `--font-heading`,
  `--font-body`, `--font-mono` (the last now resolves to Body, not a monospace face).
  Static files in `src/app/fonts/sequel-sans/` — only the weights in use ship. Commercial
  OGJ family: confirm the webfont licence covers the site.
- **Logo:** the client's vector masters in `public/brand/` (`logo-primary.svg`,
  `logo-reverse.svg`, mono variants, and the compact `mark-*.svg`), placed only via
  `<Logo>` (`src/components/common/logo.tsx`) — never retyped or redrawn. Min 140px
  wide. Icons are the official compact mark reversed on ink (`src/app/icon.svg` plus
  raster fallbacks rendered from it).
- **Drawing set:** square corners (the two dots are the only round thing), 1px rules,
  a 12-column hairline grid on heroes, registration crosses and "Fig. 0X" captions.
  **No dimension lines on product pages** (client, Nov 2026): the series PDP's viewer
  overlay, its Dimensions toggle, the heading rule, the gallery and anatomy lines are all
  gone — sizes live in the spec panel's selectors, read from `src/lib/series`, never
  typed. `DimensionLine` survives only on the fallback hero panel, the 404 page and the
  hidden assembly section. No gradients, glass, blur, shadows, glows or hover zooms.
- **Cut-outs:** product renders take `co-cutout` (multiply + feathered edge). Never wrap
  one in an element with `clip-path`/`filter`/`opacity`/an isolating transform — the
  white box comes back. Interiors *used to* take `co-highkey`; the client found it washed
  out, so no route uses it any more — every photo renders in its own colour. The utility
  is still defined in `globals.css`; do not reintroduce it.

## Design workflow — which skill, when

Four design skills are wired to this repo. Signal is approved and fixed: every skill
below works *inside* it — none of them may change the palette, the type families, the
square-corner rule, the green-as-state rule or the "plotter, not fade" motion. Load the
skill by name with the Skill tool (or `/name`), then give it the prompt in the table.

| Task | Skill | Scope |
|---|---|---|
| Any new UI, section or page on this site | **`signal-design`** (project skill, `.claude/skills/signal-design/`) | Always first. It is Signal captured as a design-language skill: tokens, components, craft rules, anti-patterns, mapped onto the real `co-*` utilities and `src/components/ui` primitives. |
| Changing text styles, the type scale, long-form copy, labels | **`better-typography`** | Site-wide type craft: scale, measure, wrapping, numerals, punctuation. |
| The configurators (`/configure`, the collection-page spec block and picker) | **`interface-design`** | Product UI only — states, density, focus, keyboard, 390px. Never marketing pages. |
| A design review / "does this look designed?" | **`hallmark`** | Critique only on this site. Never `/hallmark redesign`. |
| Signal's tokens or rules change | **`hue`** | Remix `.claude/skills/signal-design` so the skill matches the code again. |

**Prompts** (copy, adjust the bracketed part):

- *New UI* — "Use `signal-design`. Build [section/page] for Cohuman. Read `design.md`
  and reuse `src/components/ui` primitives and `co-*` utilities; no new tokens. Sizes come
  from `src/lib/series`; every product render gets a `DimensionLine` and a `FigureCaption`;
  the page ends on `CtaBand`. Check 1440 and 390 before finishing."
- *Typography* — "Use `better-typography` on [files/route]. Signal is fixed: Sequel Sans
  Disp/Head 600 natural-case titles, Body for reading, Body 12px tabular caps for data. Fix
  craft only — scale steps, measure, wrapping, tabular figures, punctuation, unit spacing —
  and keep `npm test` green (range labels are tested)."
- *Configurator* — "Use `interface-design` on [`src/components/configurator/**` |
  `series-spec-block.tsx` / `series-config-rail.tsx`]. Keep data, options, the enquiry
  payload and `series-context.tsx` unchanged. The progress rail is the one green thing;
  selected = ink fill + `aria-pressed`. Check every state and 390px; targets ≥ 44px."
- *Review* — "Run a hallmark audit of the Cohuman site. Load `hallmark` (critique only:
  its redesign audit path and gates — never a redesign) and `signal-design`. Read
  `design.md`, CLAUDE.md and `moodboards/01-signal.html` first. Signal is locked and
  overrides hallmark wherever the moodboard itself uses mono caps labels, 'Fig.' captions
  and figure numbers. Don't build; capture [https://www.cohuman.in or a local `next
  start`] at 1440×900 and 390×844 with `[data-reveal]` forced shown. Check: dimension
  lines measure what they span, empty grids/frames, repeated openers, product above the
  fold, green leaks, mono on non-data, client-facing placeholder copy. Report
  severity-ranked findings with file paths; edit nothing."
- *System change* — "Use `hue` to remix `.claude/skills/signal-design`: [the change].
  Edit `design-model.yaml` first, regenerate only the affected files, run
  `node ~/.claude/skills/hue/scripts/validate.mjs .claude/skills/signal-design` to exit 0.
  Then make the same change in `src/app/globals.css` and `design.md`."

**Order of authority when they disagree:** the code (`src/app/globals.css`,
`src/components/ui`) → `design.md` → `.claude/skills/signal-design` → the moodboard. If a
skill and the code disagree, fix whichever is wrong in the same change — never leave them
drifting.

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
- Fonts: Sequel Sans (Disp/Head/Body cuts) via `next/font/local`; `ImageResponse` reads the TTFs in `src/app/_og/`
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

## Collections menu, PM x Cohuman and single products

Everything a visitor can browse is grouped like the 2026 catalogue — **PM x Cohuman**
(designer pieces), **Workstations** (the desking systems), **Seating** — by one builder,
`buildCollectionMenu` (`src/lib/catalog/collection-menu.ts`). It feeds three places that
must never disagree: the header's **Collections panel** (`collections-panel.tsx` — a
click, not a hover, opens a full-page menu under the bar: groups in display type with
counts on the left, the active group's products as pictures on the right; on phones the
menu row expands in place to a picture rail per group), the **/collections** page (one
picture grid per group, anchored `#pm-x-cohuman` / `#workstations` / `#seating`) and the
homepage. Every list of products uses `CollectionCard` — picture, name, one line.

**Single products** (the eight PM x Cohuman pieces and Ergohuman) live in
`src/data/pieces.json`, parsed with `piecesSchema` (`piece-schema.ts`), served by
`catalog.getPieces()` and rendered at **`/products/[slug]`**, after amardeepdesign.com's
product page: name and one size line beside a large gallery (`PieceGallery`), then the
catalogue's one sentence beside folded `<details>` rows (`PieceDetails`), versions where
the catalogue draws them, more from the group, `CtaBand`. Text is the catalogue's,
verbatim; sizes only where it prints them (ARQ, MELLOW, MODO have none). These pages carry
no `DimensionLine` — the gallery opens on a room shot, and a line drawn under it would
measure nothing. `pieces.test.ts` checks every image exists. Images are in
`public/pieces/<slug>/`: `scene.jpg` plus the catalogue's views, extracted from
`Cohuman_Catalogue_2026_v18.pdf`. The catalogue bakes a flat cream backdrop
(255, 245, 209) into every render; it was lifted to white by dividing it out only where
a pixel's colour ratio matches cream (backdrop and shadow), so the product keeps its own
colour and `co-cutout` multiplies cleanly onto the fog panel. Stretch E and Stretch R
are photographed ranges in `collections.json` with one small catalogue photo each
(≈770px wide — replace when larger shots arrive). **Type A** is a piece in the
`workstations` group, **drawings only**: the catalogue's line drawings (pp. 58–61),
inverted from light-on-black to ink on white, with no room shot (`scene` is optional for
exactly this — a drawing is never presented as a photograph). Its sizes are `parts`
(workstation, main table, side storage). The Stretch S / V spec panel no longer has Model
or Code rows; the code is still in the bill of components and the enquiry.

## Tops & finishes, the factory, the spec template

- **/finishes** (`src/app/finishes/page.tsx`, data in `src/lib/finishes.ts`) is the
  catalogue's shared reference (pp. 68–69): seven board shades with codes, veneer, frame
  shades by system, top cores, edges, screen positions and the Stretch S / V technical
  rows. Warranty is "to be confirmed" in the catalogue, so it is not shown. Swatches are
  the catalogue's own crops in `public/finishes/`, rendered `unoptimized` (tiny files;
  the image optimiser hung on several). The catalogue's core and edge photos are stock —
  one carries a third-party watermark — so cores and edges are text only.
  `finishes.test.ts` checks every swatch file exists. Linked from the Collections panel,
  the footer and steps 02–03 of the homepage's build section.
- **/about** opens on the catalogue's "Humans make offices." and shows its "Made in our
  own factory." spread as six photographs (`public/factory/`), in place of the old
  capability list (which claimed European machinery the catalogue does not mention).
- **`docs/cohuman-spec-template.xlsx`** — the spec-entry workbook for the client team:
  Workstations (one row per system / table type, a column per configuration step),
  Legs (main vs middle), Pieces, New products (HAT, modesty panels, accessories, Eco),
  Lists (dropdown values). Grey cells are pre-filled from the catalogue and the site.

## Collections are desking series, not SKU lists

A collection is one of two kinds, and `/collections/[slug]` renders whichever it is:

1. **A specified series** — a configurator rather than a product grid: the customer picks
   a configuration plus a length and depth before enquiring, and the quote depends on all
   three. Two ship today, both ported from the manufacturer's own specification PDFs
   (`PROS.pdf` via the Claude Design source `PROS Series PDP.dc.html`, and `VARIDEX.pdf`).
2. **A photographed range** — STRETCH F (slug `fulcrum`), APEX (`apex`), ELEMENT
   (`element`). The client supplied photographs only (`~/Downloads/Workstation/`), no
   specification, so these quote **no sizes, no part codes and no dimension lines**: the
   page (`src/components/collections/collection-gallery.tsx`) shows the range in situ, the
   pieces on white, the leg finishes as photographed, and ends on the enquiry ("sized to
   plan"). Everything lives in the `src/data/collections.json` entry (`wordmark`, `lead`,
   `pieces`, `photos`, `legFinishes`), validated by `collection-schema.ts`;
   `collections.test.ts` checks every photo file exists and that no millimetre size or
   seat count creeps into the copy. Photos are in `public/fulcrum|apex|element/`, converted
   to sRGB (the STRETCH F originals are CMYK) and cut-outs cropped to content. Captions and
   alt text describe only what is visible. **Open item:** when the manufacturer's spec
   sheets arrive, write a `SeriesDefinition` for each and the configurator takes over
   (`findSeries` wins over the gallery). The `Stech V` / `Strech S` folders next to them
   also hold newer catalogues and renders for the two specified series — not yet compared
   with `src/lib/series`.

The four demo collections (Meridian, Origin, Loom, Parlour) were invented for the
original e-commerce demo and are **gone**, along with the `col` field that pointed at
them from `src/data/products.json`. Products belong to a category and a price band; a
collection is a desking series with a configurator, not a bucket for SKUs.

- **Data** — `src/lib/series/`: `types.ts` (`SeriesDefinition`), `derive.ts` (every
  size/label derivation), then one folder per series (`pros/`, `varidex/`) holding
  configs, elements, anatomy parts and finishes. `index.ts` exports `ALL_SERIES` and
  `findSeries`. Configurations mirror the 2026 catalogue's table types with plain names
  ("Single table", "Bench", "Face-to-face bench" — no beam or seat qualifiers): Stretch S
  has six, Stretch V six. Where a type spans several beam lengths, the configuration
  carries `variants` and `configParts`/`selectedParts` (`derive.ts`) pick the lead code
  and bill of components for the selected length. This is spec data quoted to customers — treat edits as data changes,
  not copy tweaks.
- **Adding a series** — write a `SeriesDefinition`, add it to `ALL_SERIES`, and add a
  matching entry to `src/data/collections.json` (which drives /collections, the
  sitemap and llms.txt). No component changes. **Adding a photographed range** — the
  collections.json entry alone, with its photos; it appears on /collections, the homepage
  systems grid, the header's Collections panel (Workstations), the sitemap
  and llms.txt.
- **Optional sections** — a definition can omit `gallery` (photographed-but-unquoted
  products); that component returns `null`. `swatches` and `accessory` are still data
  (the finish filter and the enquiry use them), but their PDP sections — the finish
  board and VARIDEX's wire-channel table — were cut in the Nov 2026 review along with
  the element set: the 2026 catalogue keeps finishes on one shared page and has neither
  table. VARIDEX has no finish filter because its PDF specifies materials, not colours.
- **One client boundary** — `src/components/series/series-pdp.tsx` shares configurator
  state, so the viewer, size chart, sticky bar and enquiry payload cannot disagree.
- **Page order is officemate's**, beat for beat: A name hero (`series-name-hero`: the breadcrumb full width,
  then `SeriesNameHeading` opening the spec block's left column above the viewer, the ink
  panel rising level with it as one solid rectangle (the stepped top was cut in the Nov
  2026 review) — the client's "suggestion 1", so name, render and spec share the first
  screen; no "Config 01 / 14" counter, no figure numbers on the PDP) → B spec
  block — viewer on the left, ink spec panel on the right (client request; on phones the
  viewer comes first), square size selectors and the green progress rail
  (`series-spec-block`, `series-config-rail` at `#configurations`) → C per-configuration
  gallery (`series-config-gallery`) → the drawing-set sections (assembly — hidden for now, commented out in
  `series-pdp.tsx` and `sections.ts` — anatomy, products — numbered as they render, see
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

- **Two inferred PROS part numbers** (the wire box, and the single table's long-beam
  code at 1800/2000 mm, a length the catalogue offers and `PROS.pdf` gives no code for)
  are pattern-matched, not confirmed. They render with a `°` marker plus a
  footnote; the list is `inferredCodes` on the PROS definition. Every VARIDEX code is
  printed in its PDF.
- **PROS finish swatches** are CSS gradients, not photographed swatches, and the finish
  names/codes (`PROS-TOP-NOK`…) came from the design source rather than the PDF.
- **VARIDEX sizes are ranges.** The PDF quotes each top between two limits; only the
  endpoints are offered, and no intermediate size is invented. Seat counts show `—`
  where the PDF does not state one.

## Demo catalog

`src/data/products.json` (16 products) is still the illustrative data carried over from
the original demo, and `/catalog` still serves it. These are not real Cohuman products —
replace them as real product data arrives. The catalog filters by category and price
band only. **It is hidden from search** (Nov 2026): `/catalog` and `/catalog/[slug]`
are `noindex`, and neither they nor the 16 products appear in the sitemap or llms.txt —
the real products are the pieces at `/products/[slug]`. Nothing in the navigation links
to it.

## Projects

`src/data/projects.json` is real: completed installs from the client's "completed
projects" Drive folder — named national clients first (Google BKC, Rojo Integrations,
IndianOil, ICICI Prudential Life, IDFC FIRST Bank, L&T, LIC Housing Finance, DMart, Raj
Shamani's Figuring Out, CarTrade, Reliance Nashik, NTT DATA, TaskUs, Indiabulls), then KP
Group and the Surat jobs. An entry with `"hidden": true` stays in the
file but is filtered out by the repository — JSON's way of commenting it out. Hidden
today: Devshree, and — because Cohuman does not do acoustic work (Nov 2026 review) —
Reliance Nashik, TaskUs and ICICI Prudential Life, whose photographs show acoustic
panelling. Array order is display order; the first three are the homepage's
featured projects. Photos live in `public/projects/<slug>/`, cropped to 3:2, sRGB, 1920px
(Next's top `deviceSize`), JPEG q90 4:4:4 with a light unsharp mask, re-exported from the
Drive originals. **Project photos do not take `co-highkey`** and render at `quality={90}`
(homepage, /projects, sector cards): the client found the filtered, q75 versions washed
out and soft. The older Surat shots (Narola, PNR, Montessa) are still the 1600px files on
hand — no originals. Cities appear only where the folder named one. `delivered` describes
only what the photographs show. `projects.test.ts` checks every image exists and keeps
counted claims out of the copy. **Open item:** confirm with the client that each named
client has cleared publication — several folders came from the Office Ideas portfolio.

## Homepage hero

`src/components/home/hero-carousel.tsx` takes an ordered list of panels (`HeroPanel`:
`film` or `content`) built in `src/app/page.tsx` (`heroPanels`). Since the Nov 2026
review there is **one panel** — the 1-2-3 selector and the comparison film are gone:

- **The lead film** — `LEAD_FILM` in **`src/lib/hero-films.ts`**: full screen under the
  transparent header, with the page's **H1** set over it by `FilmIntro`
  (`src/components/home/film-intro.tsx`): a mono line, the tagline, one sentence and
  one action, on a canvas title block (1px ink frame) high in the top left: from `lg` a
  short, wide strip (headline on one line, then label | sentence | action) that stays in
  the band of sweep above the orbiting desk; on phones a 360px stacked block. The desk
  is **ARQ** (designer collab, PM x Cohuman); the film is to link to ARQ's page once it
  exists.
- **Fallback** — `SignalHeroPanel` (`signal-hero.tsx`), the bench on the green grid,
  takes the hero and the H1 only if the lead film's poster is missing.

The film files live in `public/video/` (MP4 + WebM + a poster). The current lead film is
the client's `VIDEO 2 .mp4`: 1344×768, 10 seconds, one continuous orbit of the
marble-topped desk, no cuts, no watermark — encoded full frame with the audio stripped.
The claim sits on its own title block, not on the footage. Set each film's `tone` (header type colour
over it) and `mobileFocus` (the part of the frame a phone keeps). A film may also carry a
`mobile` portrait cut (poster + video) that replaces it below 768px — the lead film does:
the client's `ARQ Phone view.mp4`, re-cut to a phone's 9:19.5 (720×1564, the empty top sweep stretched and the floor
trimmed so the desk sits whole in the lower half, clear of the title block — recipe in
`hero-films.ts`). The poster swaps through a `<picture>`, the video through
`<source media>`, and the video's own poster is set in an effect (the lead video is
server-rendered, where the viewport is unknown).

The ink corner block holds every hero control: pause / play (required for looping video,
WCAG 2.2.2), the arrows, one bar per panel — the active bar fills with the film's
playback — and a mono timecode. Reduced motion never autoplays (the poster stays, Play is
offered). While the hero is under it the header is transparent (`src/lib/hero-chrome.ts`).
The header must never get `backdrop-filter`, `filter` or `transform` — see the comment in
`site-header.tsx` for the mobile-menu bug that caused.

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
| `NEXT_PUBLIC_SITE_URL` | Production: no. Previews: yes | Canonical origin for `metadataBase`, every `canonical`/`og:url`, sitemap, robots.txt and llms.txt. Defaults to `https://www.cohuman.in` — the primary host; Vercel redirects the bare domain to it. Set it to the deployment's own origin on preview environments so previews don't advertise production URLs to crawlers and scrapers. |
| `RESEND_API_KEY` | Before launch | Sends the lead email. Absent → leads validate and log, no email. |
| `RESEND_FROM_EMAIL` | Whenever `RESEND_API_KEY` is set | Verified sender address. |

The quote dialog (`src/components/providers/quote-dialog-provider.tsx`) is a
global context (`useQuoteDialog().openQuote(subject?)`) — any component can pop
it with a prefilled "interest" subject (a product name, collection, service, or
space type).

## Placeholder content — do not ship as-is

- **`siteConfig.coordinates`** (hero, footer, showroom) are Surat city-centre, marked
  `TODO: confirm` — replace with the showroom's own.
- **The map is off on purpose** (`siteConfig.mapEmbedUrl` is empty). Google's listing at
  the catalogue address is still named "FURNITURE CONCEPTS 2.0", and a keyless embed
  shows it. Once the Google Business Profile is renamed to Cohuman, paste the URL kept in
  the comment there; the homepage's visit section and /contact pick it up.
- **Founder photos and LinkedIn** are still to come — `src/data/founders.json` has both
  founders' text; the cards show a labelled empty frame until photos are added.
- **`siteConfig.suratPhotos` is empty on purpose.** The only showroom photo on file,
  `public/site/surat-storefront.jpg`, shows the shop sign "FURNITURE CONCEPTS-2.0" (the
  previous trading name). It is kept on disk but not listed; the showroom sections on
  `/`, `/about` and `/contact` render text-only until a photo without the old signage is
  added. Check any new photography for old signage before listing it.

- **`src/lib/site-config.ts`** — address, phone, Instagram (`@cohuman.india`) and cities
  (Surat, Mumbai, Ahmedabad) come from the 2026 catalogue's back page, which the client
  confirmed replaces the earlier Hazira Road address and number. Anything still marked
  `TODO: confirm` (WhatsApp line, hours, coordinates) is a placeholder. The email addresses
  (tushar@ — the lead inbox — jigar@, devan@ and accounts@cohuman.in; devan@ forwards to
  devan@officeideas.in at the mail server), founders, office contacts and `url` are
  confirmed; `url` resolves to `https://www.cohuman.in` (the bare domain 308s to www)
  and is no longer the old `cohuman.example.com`, which used to poison every
  canonical, `og:url` and sitemap entry.
- **`src/components/common/image-placeholder.tsx`** — every product/project/hero
  image renders a labelled fog frame until a real `src` is passed. Grep for
  `<ImagePlaceholder` usages without `src` before launch.
- **`src/data/products.json`** — SKUs and specs
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
  is still on disk pending that decision. **Exception:** the seating the 2026 catalogue
  itself lists — Ergohuman (live), Spectrum mbm and Zita (to come) — the client cleared
  to show as products. That clears the products, not a partnership or logo claim.
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
series **wordmarks** became STRETCH/STRETCHS in the rebrand (since renamed again, to
STRETCH V/STRETCH S) while the route **slugs** stayed `varidex`/`pros`. Slugs are the URL contract; renaming a wordmark never renames
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
  under `prefers-reduced-motion`. **Under 768px the wipes run top → bottom** (blocks lift
  16px as they open) and fire without a stagger — a left-to-right wipe across a phone's
  full-width column showed half-words mid-scroll. Figure sets (Spaces, the homepage's
  projects) are swipe rails on phones (`co-rail`). On /projects every project is a plate
  rail at all widths (`co-plate-rail` + `ProjectRail`, `src/components/projects/`): each
  photo one large frame, bleeding to the screen's right edge, with an ink segmented rule,
  mono counter and square arrows — no green, the page has many of them. Do not reintroduce framer `initial={{ opacity: 0 }}`
  on static content: it serializes as an inline `opacity:0`, so the page is blank when
  JS fails.
- **The homepage is pictures first**: 01 PM x Cohuman (each piece in its room), 02
  systems and seating (from `buildCollectionMenu`), then spaces, projects, build, visit.
  The lead film links to ARQ's page (`HERO_PRODUCT` in `src/app/page.tsx`). The old
  systems index and its line-drawing previews are gone; `public/lines/` and
  `scripts/trace-line-drawing.py` are still on disk, unused.
- **Homepage section openers are stacked** (`SectionHeading layout="stacked"`): label,
  title, a short description under it, the link on the right. Other routes keep the
  three-column opener.
- **ORGATEC popup** (`src/components/common/orgatec-popup.tsx`, data in
  `src/lib/events/orgatec.ts`): booth H18, 19–21 Nov 2026, Jio World Convention Centre,
  Mumbai — no sign-up (client decision). Once per session, and it stops rendering by
  itself after `endsAt`; delete both files after the show.
- **Share images.** `src/app/opengraph-image.tsx` is the site-wide card. A page that sets
  its own `openGraph` *replaces* the parent's, image included — so spread
  `images: [SHARE_IMAGE]` (`src/lib/seo/share-image.ts`) into it unless the page has a
  better image of its own.
- **Green is state.** Never use `co-green` as text (2.35:1 on canvas), decoration, a
  heading colour or a hover fill; the selected control must also say so with ink and
  `aria-pressed`/`aria-selected`/`aria-current`.
- The drawing-sheet primitives (`DimensionLine`, `RegistrationCross`, `FigureCaption`,
  `HairlineGrid`, `SpecRows`, `IndexRow`, `SegmentedControl`,
  `FinishChip` (`dot={false}` where the progress rail is already lit), `ProgressRail`,
  `SignalDots`) live in `src/components/ui/`. Secondary routes open with `PageHero`
  (`src/components/common/page-hero.tsx`); sections open
  with `SectionHeading`; labels read `01 / Systems` on most routes and `§01 — Definition`
  on /about. The `Button` `dots` prop (the green pair) belongs to the header's quote
  button — other quote buttons stay plain ink.
