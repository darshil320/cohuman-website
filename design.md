# Cohuman — Design Reference

> **Signal** — a spec sheet you can walk into. Everything measured, nothing decorated.

Direction 01 from the moodboards (`moodboards/01-signal.html`, research in
`moodboards/index.html`), built on the brand palette rather than the moodboard's pure white:
an ivory paper canvas, brand Ink, and the logo green held back to a status light. The site
reads like an architectural drawing set — hairline grid, registration crosses, figure
numbers, and a real dimension line on every product render.

`src/app/globals.css` is authoritative for every value below. If this file and the code
disagree, the code wins and this file is out of date.

## Palette — "Ivory paper"

The token **names** are historical (`bg-alt`, `panel`, `green`…) and were kept so call sites
did not have to move. The **values** are the Signal roles.

| Role | Hex | Token(s) | Use | Share of a screen |
|---|---|---|---|---|
| Canvas | `#FBF8EE` | `--color-co-bg`, `--color-co-surface` | Page ground. A tint of brand Ivory — never pure white. | ~62% |
| Fog | `#F3EFE1` | `--color-co-bg-alt`, `--color-co-hero-bg` | Panels, hover rows, sticky quote bar, placeholder frames | ~18% |
| Ink | `#231F20` | `--color-co-ink`, `--color-co-panel` | Type, primary buttons, the PDP spec block, the footer | ~14% |
| Ink soft | `#3D3A36` | `--color-co-ink-soft` | Body copy, leads | — |
| Muted | `#55514A` | `--color-co-muted` | Secondary body copy | — |
| Steel | `#6B665D` | `--color-co-muted-2`, `--color-co-faint`, `--color-co-placeholder` | Meta: eyebrows, labels, captions, placeholders | ~3% |
| Hair | `#DCD6C4` | `--color-co-border`, `--color-co-card-border` | 1px rules | ~2% |
| Rule strong | `#8F8874` | `--color-co-border-strong` | A rule that is the only edge of a control (3:1) | — |
| On ink | `#FBF8EE` / `#B4AEA4` / `#9E988D` | `--color-co-panel-fg` / `-muted` / `-faint` | Text on the ink block | — |
| Ink rule | `#3B3637` | `--color-co-panel-border` | Hairlines on the ink block | — |
| **Signal** | **`#5EB646`** | `--color-co-green`, `--color-co-green-light` | **State only** — see rules | **~1%** |

`#5EB646` is the green in the client's vector logo masters and the brand guidelines, so the
UI's signal and the mark's dots and bar are the same colour. The brand's Deep Tide,
Ocean and Sunlit are not used on the website.

### Contrast (WCAG 2.x)

Every text pair in use, checked:

| Text on ground | Ratio | Passes |
|---|---|---|
| Ink on canvas / fog | 15.3 / 14.2 | AAA |
| Ink soft on canvas / fog | 10.6 / 9.8 | AAA |
| Muted on canvas / fog | 7.4 / 6.9 | AAA / AA |
| Steel on canvas / fog | 5.4 / 4.95 | AA (all sizes) |
| Canvas on ink | 15.3 | AAA |
| Panel-muted on ink | 7.4 | AAA |
| Panel-faint on ink | 5.7 | AA |
| Ink on signal | 6.5 | AA |
| Signal on canvas | 2.35 | **non-text only, never alone** |
| Rule strong on canvas | 3.3 | UI component (3:1) |

The green is never text, and never the only carrier of a state: the selected control also
has its ink fill or outline and `aria-pressed`/`aria-selected`/`aria-current`.

## Logo

Master artwork only — the client's vector masters (SVG), copied into `public/brand/`
unchanged:

| File | Use |
|---|---|
| `logo-primary.svg` | Primary — ink letters, green dots and bar. Light surfaces. `<Logo tone="dark">` |
| `logo-reverse.svg` | Reversed — white letters, green dots and bar. On ink (the footer) and dark footage. `tone="light"` |
| `logo-ink.svg` / `logo-white.svg` | Single colour, for one-colour contexts only. `mono-dark` / `mono-light` |
| `mark-primary.svg` / `mark-reverse.svg` / `mark-white.svg` | The compact mark — the O with its bar |
| `logo-black.png` | Raster, for the JSON-LD `logo` only. Not used on screen. |

The brand pack also carries `logo-black.svg` and `logo-deeptide.svg`; neither is used on
the website, so they are not copied in.

- Always placed through `<Logo tone="dark|light|mono-dark|mono-light" />`
  (`src/components/common/logo.tsx`). Never retyped, redrawn or recoloured.
- Minimum 140px wide on screen. Clear space: half the cap height on every side.
- **Icons** use the official compact mark, reversed on ink: `src/app/icon.svg` (vector,
  built from `mark-reverse.svg`), with raster fallbacks rendered from it —
  `src/app/favicon.ico`, `src/app/apple-icon.png`, `public/site/icon-192.png` and
  `icon-512.png` for the manifest.
- The site-wide share card is generated: `src/app/opengraph-image.tsx` (vector logo,
  headline, dimension line, hairline grid). Its two static fonts live in `src/app/_og/`.

### The logo device, used as UI

| Device | Meaning on the site | Where |
|---|---|---|
| **Two dots** (above the M) | Status — something is switched on | "Get a quote" in the header; form sent states; selected finish chip |
| **One bar** (inside the O) | Active underline / progress | Configurator progress rail; active tab; selected size-chart / anatomy row; gallery pagination |
| Drawing marks | — | Registration crosses, dimension lines, figure numbers |

Green is never decoration, never a heading colour, never a hover fill.

## Typography

| Role | Face | Setting | Utility |
|---|---|---|---|
| Display / claims | **Archivo Expanded** — Archivo at `wdth` 125 | SemiBold 600, UPPERCASE, −0.02em, line-height 0.9 | `co-display`, `co-h1`, `co-h2`, `co-h3`, or `font-display` |
| Body | **Archivo** — `wdth` 100 | 400, 15px / 1.55 | default; `co-lead` for standfirsts |
| Data / labels | **Martian Mono** — `wdth` 87.5 | 400, 11px UPPERCASE, +0.02em | `co-data` (ink), `co-eyebrow` (steel) |

Both families load through `next/font/google` with `axes: ["wdth"]` (`src/app/layout.tsx`),
so Archivo Expanded is the *same file* as body Archivo at `font-stretch: 125%`. Tokens:
`--font-display`, `--font-body` (both Archivo), `--font-mono` (Martian Mono). The
`.font-display` and `.font-mono` classes set the width (and caps for display) in the base
layer, so a utility can still override them.

Rule of thumb: **data in mono, claims in caps, reading in Archivo.** Anything you could
measure — a size, a code, a quantity, a step — is mono.

### Scale (`--text-co-*`)

| Step | Value | Moodboard at 1440 |
|---|---|---|
| display | `clamp(44px, 8.9vw, 128px)` | 128 / 0.90 |
| h1 | `clamp(38px, 6vw, 88px)` | — |
| h2 | `clamp(30px, 3.9vw, 56px)` | 56 / 0.90 |
| h3 | `clamp(20px, 1.7vw, 24px)` | 24 |
| lead | `clamp(16px, 1.32vw, 19px)` | 19 / 1.55 |
| body | `15px` | 15 / 1.55 |
| data / eyebrow | `11px` | 11 / 1.50 |

## Visual system

- **Square corners everywhere.** The only round things on the site are the two dots.
- **1px hairlines** (`border-co-border`); an **ink rule** (`border-co-ink`) closes every
  section opener and frames strong controls.
- **Hairline 12-column grid** behind hero sections (`HairlineGrid`), on the same column
  edges as the content. On the homepage hero only it is drawn in green
  (`tone="signal"`, `--color-co-grid-signal` #9CD289 — the logo green mixed 60/40 with
  the canvas), and the render sits **above** it: an `isolate` group holding a feathered
  canvas plate (`co-cutout-plate`) and the multiplied image, so the lines pass behind the
  product instead of across it.
- **Drawing marks:** registration crosses (`RegistrationCross`), figure captions
  ("Fig. 01 — …", `FigureCaption`) numbered down each page, and a **dimension line on every
  product render** (`DimensionLine`). Sizes are always read from `src/lib/series` — the
  helpers in `derive.ts` (`rangeLabel`, `configLengthLabel`, `configSizeRange`,
  `spanLabel`) — never typed. Interior photographs carry figure captions but no dimension.
- **No** gradients, glass, blur, drop shadows, glows, hover zooms or opacity fades. (The one
  exception: finish swatch fills from the series data, which describe a material.)

### Imagery

- **Product renders** are studio cut-outs shot on white. They take `co-cutout`:
  `mix-blend-multiply` drops the white into the ivory canvas without keying out the white
  frame legs, and an edge feather mask (from `moodboards/base.css`) removes the photo's
  rectangle. Never put a cut-out inside an element with `clip-path`, `filter`, `opacity` or
  an isolating transform — that isolates the blend and the white box comes back. Wipe the
  image itself instead.
- The **WebGL viewer** does the same maths in its shader: a flat canvas-coloured backdrop
  and `texel × canvas`, so poster and canvas match to the pixel
  (`src/components/series/stage-shaders.ts`).
- **Interiors** run high-key and cool: `co-highkey` (partly desaturated, lifted).
- **People** (founders) are shown as supplied, ungraded. Never a stock face.

## Components (`src/components/ui`)

| Component | What it is |
|---|---|
| `Button` | `primary` (ink fill, mono label; `dots` adds the green pair — header only), `secondary` (1px outline), `link` (underline + `arrow`), and `onDark` / `secondaryOnDark` / `linkOnDark` |
| `SegmentedControl` | Square segmented size selector; selected = ink fill + `aria-pressed` |
| `FinishChip` | Square swatch chip with name and part code; selected = offset ink outline + dot |
| `ProgressRail` | 2px track, green fill, "Step n of m" caption |
| `SpecRows` | `<dl>` of mono key/value rows on hairlines; `tone="dark"` for the ink block |
| `IndexRow` / `IndexHeader` | The parts-list row: number, name in caps, type, mono range, arrow; hover = fog + cut-out thumbnail + dots |
| `DimensionLine` | 1px rule with end ticks and a mono value, `axis="x" \| "y"` |
| `RegistrationCross`, `FigureCaption`, `HairlineGrid`, `MeasureRule`, `SignalDots`, `TickNumber` | Drawing marks and state |
| `Input` / `Textarea` / `Select` / `Label` | Underline fields: no box, one ink rule, mono label |
| `Reveal`, `StaggerItem`, `ClipReveal`, `KineticHeading` | Server-safe CSS motion (below) |

Secondary routes open with `PageHero` (`src/components/common`: hairline grid, mono
label, extended-caps claim, lead, optional spec-rows aside). Section openers are
`SectionHeading`: mono label · display-caps title · standfirst, on one baseline, closed by
an ink rule. Every page ends on `CtaBand` (or, on /contact and /b2b, on the form).

## Motion — "plotter, not fade"

| What | How | Where |
|---|---|---|
| Lines draw in | 400ms **linear** (`--duration-plot`, `--ease-plot`) | `co-rule`: dimension lines, the hero grid, measure rules |
| Numbers tick | 400ms linear, only on change; first render is the real value | `useTick` / `TickNumber` (sizes in the spec block and viewer) |
| Images wipe | left → right behind a moving ink hairline | `co-clip` / `ClipReveal`; `co-wipe-in` for click-swapped frames |
| Blocks reveal | left → right wipe | `co-reveal` / `Reveal` / `StaggerItem` |
| Headlines | words lift from a mask, transform only | `KineticHeading` |
| Choosing a configuration | the card grows, its neighbours shrink (450ms), then its render flies into the viewer while the page scrolls up (750ms) | `series-config-rail.tsx`, `series-config-flight.tsx` |

Every scroll reveal rests in its **finished** state and is held back only while `html.co-js`
is present (set by a blocking script in `layout.tsx`) and the element is not yet
`data-shown`. No script → nothing hidden. Never put framer `initial={{ opacity: 0 }}` on
static content. `prefers-reduced-motion` turns every one of these off in CSS; framer runs
under `MotionConfig reducedMotion="user"`. Counters (`useCountUp`) start at their final
value.

## Rules

1. **One green thing per screen.** The header's quote dots are always on screen, so content
   uses green only for a genuinely selected state or the progress rail — and other quote
   buttons (sticky bar, enquiry bands) are plain ink. The homepage hero's green grid is
   the client's deliberate exception.
2. No rounded corners anywhere except the two dots.
3. Every product image carries a real dimension.
4. Data in mono, claims in caps, reading in Archivo.
5. No heritage claims for the brand — no founding year, no years in business, no "since",
   no counted proof stats. A founder's personal career history on /about is the one
   approved exception.

**Off-limits:** gradients, glass, drop shadows, glows · thin serifs and "elegant" luxury
cues · stock lifestyle people · bento grids of rounded cards.

## Homepage hero

Full screen, under a transparent header. Panel 1 is the measured bench on the green grid;
further panels are films (`src/lib/hero-films.ts`) — full bleed, no text, autoplaying
muted only while on screen, poster-only under reduced motion. Panels wipe left → right.
Pagination is a solid ink corner block (`01 Index · 02 Floor …`, the active one marked by
the green bar), so it reads on any footage without a scrim. The header goes transparent
while the hero is under it — ink type on light footage, canvas type and the reversed logo
on dark (`tone` per film) — and solid again once the hero has scrolled away.

## Founders

`/about` has a Founders section, one `FounderCard` (`src/components/about/founder-card.tsx`)
per entry in `src/data/founders.json`, read through `catalog.getFounders()` — never imported
directly. Each entry: `slug`, `name`, `role`, `bio` (2–4 sentences), `focus[]`, optional
`photo { src, alt }` (in `public/founders/`), `linkedin`, `quote`. The file is validated by
`founderSchema` (`src/lib/catalog/founder-schema.ts`); tests in `founders.test.ts` reject
the old trading name, counted track records and photos that do not exist (personal career
history is allowed). The section renders only when the file has entries; a missing photo
renders a labelled empty frame. The closing line under the cards is `FOUNDERS_CLOSE` in
`src/app/about/page.tsx`.
