---
name: signal-design
description: "This skill should be used when the user explicitly says 'Signal style', 'Signal design', '/signal-design', or directly asks to use/apply the Signal design system (the Cohuman website's design language). NEVER trigger automatically for generic UI or design tasks."
version: 1.0.0
allowed-tools: [Read, Write, Edit, Glob, Grep]
---

# signal-design

You are a senior product designer working inside the Cohuman website. When this skill is active, every UI decision follows **Signal**, the design language the site is already built in. You are extending an existing system, not proposing one: reuse the `co-*` tokens, utilities and components that exist, and never introduce a parallel token set.

**Sources of truth, in order:** `src/app/globals.css` (every value) → `design.md` (palette, contrast, logo, motion) → `CLAUDE.md` (Design system + Conventions) → `src/components/ui/*` and `src/components/common/*`. If this skill and the code disagree, the code wins; flag the drift instead of copying it.

**Fonts are already loaded.** Archivo and Martian Mono come in through `next/font/google` with `axes: ["wdth"]` in `src/app/layout.tsx`. Never add a Google Fonts `<link>` to the app. Standalone HTML (mockups, this skill's `component-library.html`) loads them as shown in `references/platform-mapping.md`.

---

## 1. DESIGN PHILOSOPHY

A spec sheet you can walk into. Cohuman is presented as an engineering brand, so the site reads like an architectural drawing set laid on ivory paper: a hairline grid, registration crosses, figure numbers, and a real dimension line on every product. Everything measured, nothing decorated. The tension that gives Signal its character is **warm paper against cold precision**: an ivory canvas and a near-black brand ink carry 95% of every screen, and the logo green is held back until something is genuinely switched on, so one small green dot reads as loudly as a headline.

Lineage: Braun and Dieter Rams, Vitra specification sheets, Teenage Engineering, architectural drawing sets. Moodboard: `moodboards/01-signal.html` (built on the brand palette instead of its pure white).

### Principles

1. **Measured, never decorated.** Every product render carries a `DimensionLine` whose value is read from `src/lib/series`; an image without a real size is unfinished.
2. **Green is state.** `#5EB646` marks selected, active, progress or sent, about 1% of a screen; if it is decoration, text, a heading or a hover fill, it is wrong.
3. **Square.** Radius is 0 on every box, control, image and overlay; the only round things on the site are the two signal dots.
4. **Flat.** Depth comes from a 1px rule or a surface change (canvas → fog → ink), never from a shadow, glow, blur or gradient.
5. **Data in mono, claims in caps, reading in Archivo.** Anything you could measure (a size, a part code, a quantity, a step, a count) is Martian Mono; every claim is extended caps.
6. **Plotter, not fade.** Lines draw at a constant 400ms linear, images and blocks wipe left to right, numbers tick; nothing fades in, nothing bounces.
7. **Paper, not white.** The canvas is `#FBF8EE` and is never pure white; studio renders shot on white multiply into it.

---

## 2. CRAFT RULES: HOW TO COMPOSE

### 2.1 Surface budget

Squint at any screen: it must resolve to paper, one ink mass and (at most) one green point.

| Layer | Hex | Token / utility | Share of a screen | Carries |
|---|---|---|---|---|
| Canvas | `#FBF8EE` | `bg-co-bg` | ~62% | The page ground, forms, figures |
| Fog | `#F3EFE1` | `bg-co-bg-alt` | ~18% | Panels, hover rows, sticky quote bar, placeholder frames, active tab |
| Ink | `#231F20` | `bg-co-ink` / `bg-co-panel` | ~14% | Type, primary buttons, the PDP spec block, footer, dark CtaBand |
| Steel | `#6B665D` | `text-co-muted-2` | ~3% | Meta: eyebrows, labels, captions, placeholders |
| Hair | `#DCD6C4` | `border-co-border` | ~2% | 1px structural rules |
| Signal | `#5EB646` | `bg-co-green` | ~1% | State only |

One ink block per page (spec block, footer, or a dark band). Fog is a rhythm break, not a card colour: never stack fog panels edge to edge.

### 2.2 Type discipline

Three voices, two families, one variable axis (`wdth`):

| Voice | Setting | Utility | Never |
|---|---|---|---|
| Claim | Archivo at `wdth` 125, 600, UPPERCASE, −0.02em, line-height 0.9 | `co-display`, `co-h1`, `co-h2`, `co-h3`, `font-display` | Sentence case, weights other than 600, colour other than ink / steel / canvas |
| Reading | Archivo at `wdth` 100, 400, 15px / 1.55 (lead 16 to 19px) | body default, `co-lead` | Uppercase paragraphs, text below 12.5px |
| Data | Martian Mono at `wdth` 87.5, 400, 11px UPPERCASE, +0.02em, tabular | `co-data` (ink), `co-eyebrow` (steel) | Proportional figures, sizes typed in Archivo |

- Section labels are mono: `01 / Systems` on most routes, `§01` plus a spaced em dash plus the name on /about.
- Figure captions read `Fig. 01`, a spaced em dash, then the caption, numbered down each page (`FigureCaption`).
- A claim may drop its second line to steel (`text-co-muted-2`), as the homepage hero does. That is the only colour shift a heading ever takes.
- Buttons speak in the data voice: Martian Mono 12px caps.

### 2.3 Rules are the structure

| Rule | Where | Utility |
|---|---|---|
| 1px hair | Row dividers, spec rows, card image frames, header bottom | `border-co-border` |
| 1px ink | Closes every `SectionHeading`, tops every card body, frames strong controls (segmented, dialog, tabs, icon buttons), underline fields | `border-co-ink` |
| 2px ink | Active nav item, invalid field underline, `FormError` left rule, focus outline | `h-[2px] bg-co-ink`, `border-b-2`, `border-l-2` |
| 2px / 3px signal | Progress rail fill (2px); active tab, gallery and hero pagination bar (3px) | `bg-co-green` |
| 1px on ink | Hairlines inside the ink block | `border-co-panel-border` |

`--color-co-border-strong` (`#8F8874`, 3:1) exists for a rule that is the only edge of a control; prefer ink, which the components already use.

### 2.4 Composition: the drawing set

- **Shell:** `co-shell` everywhere (max 1440px, gutters 18 / 24 / 48px). Heroes draw the 12-column `HairlineGrid` inside the same shell so its lines land on the content columns.
- **Section rhythm:** `co-section` (`clamp(64px, 8vw, 120px)`), `co-section-lg` (`clamp(80px, 10vw, 160px)`) only for the sections that anchor a page.
- **Openers:** secondary routes open with `PageHero`; every section opens with `SectionHeading` (mono label, caps title, standfirst on one baseline, closed by an ink rule); every page ends on `CtaBand` (or the form on /contact and /b2b).
- **Lists are parts lists:** use `IndexRow` / `IndexHeader`, not a grid of cards, when the content is a set of systems or services.
- **Figures:** registration crosses pin the corners, a `DimensionLine` measures the render, a `FigureCaption` numbers it.

### 2.5 The green budget

The header's "Get a quote" dots are on every screen. Content may light **one more thing**, and only if it is genuinely selected or in progress: the progress rail, an active tab bar, a selected finish chip's dot, a pagination bar, a sent-form's dots. Before adding green, find what is already lit on that screen. Every green mark is paired with an ink fill or outline and `aria-pressed` / `aria-selected` / `aria-current` / `role="status"`, because 2.39:1 cannot carry state alone. The homepage hero's green grid is the client's single deliberate exception.

### 2.6 Imagery

- Studio renders: `co-cutout` (multiply + 5% feathered edge). Over grid lines, wrap the render and a `co-cutout-plate` in an `isolate` group so it multiplies with the plate, not the lines.
- Interiors: `co-highkey` (grayscale 0.55, contrast 1.06, brightness 1.06).
- People: as supplied, ungraded; never a stock face. A missing photo is a labelled `ImagePlaceholder`, never filler.

### 2.7 Validation

Squint test: blur the screen. You should see the claim in ink, one ink mass, hairlines, and at most one green point beside the header dots. If you can see a second green thing, a soft edge or a rounded corner, find it and remove it.

---

## 3. ANTI-PATTERNS: WHAT TO NEVER DO

- **No gradients.** The single exception is a finish swatch fill from `src/lib/series` (a material description, rendered by `FinishChip`).
- **No glass, blur or `backdrop-filter`.** On the header it is also a bug: `backdrop-filter`, `filter`, `transform` or `will-change` there makes it the containing block for the fixed mobile menu, which then collapses and vanishes.
- **No shadows or glows** of any kind, including on overlays and the floating WhatsApp button.
- **No rounded corners.** `border-radius` is 0 everywhere except the 7px (and 22px) signal dots. No pills, no rounded cards, no rounded inputs.
- **No green as text, decoration, heading colour, hover fill or brand tint.** No `text-co-green`, no `border-co-green`, no `co-green/xx` washes. `--color-co-green-dark`, `-pale` and `-paler` are defined but banned; `--color-co-cta-green` is ink despite its name.
- **No framer `initial` of `{ opacity: 0 }` on static content.** It serializes as inline `opacity:0` and blanks the page when JS fails. Use `Reveal` / `StaggerItem` / `ClipReveal` / `KineticHeading` (CSS, gated on `html.co-js`).
- **No fades, hover zooms or bounces.** Motion is draw, wipe, tick or a transform-only word rise.
- **No fractional Tailwind spacing** such as `p-4.5` or `gap-5.5`: it silently produces no CSS. Use the default scale or an arbitrary `[18px]` value.
- **No cut-out inside a `clip-path`, `filter`, `opacity` or isolating-`transform` wrapper.** That isolates the multiply blend and the render's white box comes back. Wipe the image itself (`co-wipe-in` on the `<img>`).
- **No invented sizes.** Every length, depth, height, seat count and part code comes from `src/lib/series` via `derive.ts` (`rangeLabel`, `configLengthLabel`, `configSizeRange`, `spanLabel`, `sizeLabel`). Never type a millimetre value into markup.
- **No heritage claims for the brand.** No founding year, no years in business, no "since", no previous trading name, no counted proof stats (clients served, projects delivered, brands represented). A founder's personal career history on /about is the one approved exception.
- **No retyped or redrawn logo.** Place the wordmark only through `<Logo tone=... />`, minimum 140px wide.
- **No `dots` on any button but the header's quote button.** Other quote buttons stay plain ink.
- **No badges, pills, toasts, tooltips, skeletons or spinners.** Status is a mono line, a sent form replaces itself in place, and content renders finished on the server.
- **No alarm colours.** There is no red or amber; an error is ink with a 2px ink left rule and the words "Not sent".
- **No thin serifs, "elegant" luxury cues, stock lifestyle people, or bento grids of rounded cards.**

---

## 4. WORKFLOW

1. **Read the tokens.** Open `src/app/globals.css` before writing a class; confirm the `co-*` value you need exists.
2. **Reuse a component first.** Check the "Use the existing components" table in `references/platform-mapping.md`. Compose from `Button`, `SegmentedControl`, `FinishChip`, `SpecRows`, `IndexRow`, `DimensionLine`, `SectionHeading`, `PageHero`, `CtaBand` before writing new markup.
3. **Write with utilities, not values.** `co-display` / `co-h1` to `co-h3` / `co-lead` / `co-data` / `co-eyebrow`, `bg-co-*`, `text-co-*`, `border-co-*`. Hex values in a component are a smell.
4. **Read every size from `src/lib/series`.** Labels come from `derive.ts`; part codes come from the series definition.
5. **Spend the green budget once.** Count the green marks on the screen including the header dots; pair each with ink and an ARIA state.
6. **Check motion with scripts off.** The page must be complete with JS blocked and with `prefers-reduced-motion: reduce`.
7. **Check both grounds.** Light (canvas) is primary; dark is the ink block, reached through each component's `tone="dark"` or the `*OnDark` button variants, never through a theme toggle.
8. **Test extremes.** A 40-character configuration name in an `IndexRow`, a wrapped `SegmentedControl` second row, an empty catalog filter, a phone at 360px.
9. **Run the gates.** `npm run lint`, `npm run check:links` (slugs are the URL contract: wordmarks STRETCH S / STRETCH V, slugs `pros` / `varidex`).

---

## 5. REFERENCE FILES

| File | Contains |
|------|----------|
| `design-model.yaml` | Single source of truth for this skill: primitives, semantic tokens, hero stage, component tear-downs, project mapping |
| `references/tokens.md` | Fonts, type scale, colour system (light + ink), spacing, radii, elevation, motion, iconography |
| `references/components.md` | Every Signal component with exact values and states, plus what Signal deliberately does not have |
| `references/platform-mapping.md` | hue semantic names → real `co-*` tokens and utilities, the "Use the existing components" table, standalone HTML font loading |
| `component-library.html` | The spec sheet: every component rendered with its exact values, canvas and ink grounds |

**Not generated, on purpose:** no `preview.html`, `landing-page.html` or `app-screen.html`. The live site is the landing page (`/`, `src/app/page.tsx`), and the configurator at `/configure` plus the series PDP at `/collections/[slug]` are the product screens. A mock of either would be a second copy that drifts from the real one.
