# signal-design: Components

Every component below exists in the repo unless marked **Derived** (a rule for something Signal does not have yet) or **Absent** (deliberately not part of the system). Values are the real Tailwind classes from source. Reuse the component; do not rebuild it from these specs. The file map is in `platform-mapping.md`.

**Roles and rules are stable; pixel internals are not.** The shared building blocks in `src/components/ui/` get small adjustments (touch-target heights, alignment). This file pins what each component is for, its states and the rules it must keep (square, ink selection, green only for state). Where a row below quotes a pixel value, treat it as "at time of writing" and read the component file before matching it by hand. Better still, render the component instead of copying its classes.

Literal brand formats in this file (ranges, captions, labels) contain the spaced em dash the site actually renders; they always come from a helper (`rangeLabel`, `figureNumber`, `lengthFieldLabel`), never from typed text.

---

## 1. BUTTONS: `Button` (`src/components/ui/button.tsx`)

Square, no shadow, mono labels: controls that belong on an instrument panel.

### Variants

| Variant | Background | Text | Border | Radius | Height |
|---------|-----------|------|--------|--------|--------|
| `primary` | `bg-co-ink` `#231F20` | `text-co-bg` `#FBF8EE` | none | 0 | 52px |
| `secondary` | transparent | `text-co-ink` | 1px `border-co-ink` | 0 | 52px |
| `link` | transparent | `text-co-ink` | 1px ink bottom only | 0 | auto (pb 4px) |
| `ghost` | transparent | `text-co-muted` | none | 0 | 52px |
| `onDark` | `bg-co-bg` | `text-co-ink` | none | 0 | 52px |
| `secondaryOnDark` | transparent | `text-co-panel-fg` | 1px `border-co-panel-fg` | 0 | 52px |
| `linkOnDark` | transparent | `text-co-panel-fg` | 1px canvas bottom only | 0 | auto |
| Destructive | **Absent.** No alarm colour. Use `secondary` with an explicit verb ("Clear filters"). | | | | |

`outline` / `outlineOnDark` are legacy aliases of `link` / `linkOnDark`; do not use them in new code.

### Specs

| Property | Value |
|----------|-------|
| Height | `sm` 42px · `default` 52px · `lg` 60px |
| Padding-x | `sm` 16px · `default` 22px · `lg` 28px |
| Label | Martian Mono 12px, 400, UPPERCASE, +0.02em, `font-stretch: 87.5%` |
| Gap (label to dots / arrow) | 14px (`gap-3.5`) |
| Link variant | No height, no side padding, `pb-1`, may wrap (`whitespace-normal`) |
| `arrow` prop | Trailing `→`, nudges 4px right on hover, 150ms |
| `dots` prop | Trailing `SignalDots` (7px pair). **Header quote button only** |
| Min touch target | 42px (sm) to 60px |

### States

| State | Change |
|-------|--------|
| **Hover** | primary: `bg-co-ink-soft` `#3D3A36` · secondary: ink fill, canvas text · link: rule to steel, text to muted · onDark: fog · secondaryOnDark: canvas fill, ink text · ghost: muted to ink |
| **Active / Pressed** | No separate pressed style; the hover state holds |
| **Disabled** | `opacity: 0.5`, `pointer-events: none` (a submitting form button) |
| **Focus** | Global `outline: 2px solid` ink, offset 2px (canvas on the ink block) |

Hover never turns anything green. Transition: `transition-colors duration-150`.

### Icon button (inline pattern, no component)

40 × 40px square, 1px `border-co-ink`, ink glyph; hover fills ink with a canvas glyph. Used for the dialog close (lucide `X` 16px, stroke 1.5), configuration rail arrows (`←` / `→`) and the hamburger (two 1px × 18px lines, 6px apart, crossing at 45° when open). On ink: 1px `border-co-panel-fg`, hover canvas fill. Floating WhatsApp: 48px, ink fill, 1px canvas border, lucide `MessageCircle` 24px filled, hover ink soft, no shadow.

---

## 2. CARDS / SURFACES

Signal has no boxed cards. A "card" is an image well plus a ruled text block.

### Product card (`src/components/catalog/product-card.tsx`)
- Image well: `aspect-[4/3]`, 1px `border-co-border`, `bg-co-bg-alt`, wrapped in `ClipReveal`; hover turns the border ink
- Body: 1px **ink** rule on top (`border-t border-co-ink pt-3`), then `co-eyebrow` category left + `co-data` band right
- Title: `co-h3`, 16px below the rule; hover text to muted
- Tagline: 14px / 1.55 `text-co-muted`, `max-w-[40ch]`
- Sizes: `co-data text-co-muted-2`
- Foot: `link` button "Enquire" + `co-eyebrow` "Price on request", pushed to the bottom (`mt-auto pt-6`)
- Radius 0, shadow none, press state none

### Series / drawer card (`nav-drawer.tsx`, `series-config-rail.tsx`)
- Figure: `aspect-[16/10]`, 1px hair, canvas, cut-out `object-contain p-6`, `co-data` steel label top-left; hover fog
- Below: ink rule, display name `clamp(20px, 1.8vw, 26px)` 600 caps, `co-data` count in steel, `co-data` span in ink

### Panels
- Fog panel: `bg-co-bg-alt`, no border, used once per section at most
- Ink block: `bg-co-panel text-co-panel-fg`, internal rules `border-co-panel-border`, labels `text-co-panel-faint`
- The sheet: canvas form laid on fog (`series-enquire.tsx`), square, no frame, no shadow

---

## 3. INPUTS: `Input` (`src/components/ui/input.tsx`)

A line on a form, not a container.

### Text Field

| Property | Value |
|----------|-------|
| Height | ~46px (content-driven: 17px text + `py-2.5`) |
| Background | transparent |
| Border (default) | `border-0 border-b` 1px `border-co-ink` |
| Border (focus) | Unchanged rule + global 2px ink outline, offset 2px |
| Border (error) | `aria-[invalid=true]:border-b-2` (2px ink). No red |
| Radius | 0 (`rounded-none`) |
| Padding | 10px 0 |
| Font | Archivo 17px, ink |
| Placeholder color | Steel `#6B665D` |

### Label (`Label`, `src/components/ui/label.tsx`)
- `co-eyebrow` block: Martian Mono 11px caps steel
- Gap to field: 4px (`FIELD = "grid gap-1"`)
- Form grid: `FORM_GRID = "grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2"` (32px × 28px)

### States

| State | Treatment |
|-------|-----------|
| **Default** | 1px ink underline |
| **Focus** | 2px ink outline, offset 2px |
| **Error** | 2px ink underline; the form shows `FormError` ("Not sent" + message) |
| **Disabled** | Opacity 0.5, `cursor-not-allowed` |

### Multiline: `Textarea`
- Same field class, `min-h-[96px]`, `resize-y`

### Date and time
- Native `<Input type="date">` / `type="time"` in the same underline field (showroom visit form). No custom calendar.

---

## 4. LISTS / DATA ROWS

### Index row: `IndexRow` / `IndexHeader` (`src/components/ui/index-row.tsx`)

The parts-list row: Signal's list pattern for systems, services and sectors.

| Property | Value |
|----------|-------|
| Min height | 84px (96px from `md`) |
| Padding | 16px 0 |
| Grid (lg) | `90px · minmax(0,360px) · 1fr · 260px · 60px` (number, name, type, range, arrow) |
| Grid (md) | `64px · 1.1fr · 1fr · 0.8fr · 48px`; phone: `40px · 1fr · auto` |
| Divider | 1px hair bottom |
| Number | `co-data` |
| Name | Archivo wdth 125, 600, caps, `clamp(24px, 2.8vw, 40px)`, line-height 0.9, −0.02em |
| Type | 16px ink soft (phone: 14px muted under the name) |
| Range | `co-data`, from `spanLabel` / `rangeLabel` |
| Accessory | `→` 18px |
| Header | `IndexHeader`: `co-eyebrow`, `py-3.5`, hair bottom, labels "No. / System / Type / Range" |

| State | Treatment |
|-------|-----------|
| **Default** | Transparent |
| **Hover / focus-visible** | Fog row; 170px cut-out thumbnail wipes in left to right (300ms linear); the arrow swaps to `SignalDots` |
| **Phone** | No thumbnail, no hover |

### Spec rows: `SpecRows` (`src/components/ui/spec-rows.tsx`)

The product-data pattern: a real `<dl>`.

| Property | Value |
|----------|-------|
| Grid | `minmax(96px, 130px) 1fr`, column gap 16px |
| Row padding | 11px 0 |
| Rules | 1px hair top on the list, 1px hair under each row |
| Key | `co-data` steel |
| Value | `co-data` ink, wraps (`break-words`) |
| Columns | `1` or `2` (`md:columns-2 md:gap-x-10`, rows never split) |
| `tone="dark"` | Rules `#3B3637`, keys `#9E988D`, values canvas |

### Bill of components (spec block)
- `co-data` list, `grid-cols-[1fr_auto_44px]`: name (sentence case) / code (on-ink muted) / quantity right-aligned, rows `py-2.5` with `#3B3637` rules. Inferred codes carry `°` plus the footnote.

---

## 5. NAVIGATION

### Site header (`src/components/layout/site-header.tsx`)

| Property | Value |
|----------|-------|
| Height | 72px (`HEADER_HEIGHT`) |
| Background | Canvas with 1px hair bottom; transparent over the homepage hero |
| Logo | `<Logo>` 140px (150px from `sm`), reversed over dark film |
| Nav font | `co-data` |
| Actions | "Contact" (`co-data`), `Button size="sm" dots` "Get a quote" |
| Forbidden | `backdrop-filter`, `filter`, `transform`, `will-change` on the header |

### Nav link states

| State | Treatment |
|-------|-----------|
| **Active** | Ink text + static 2px ink rule under the label + `aria-current="page"` |
| **Inactive** | Muted `#55514A` |
| **Hover** | Ink text + 1px ink underline drawing left to right, 400ms linear |

### Nav drawer (`nav-drawer.tsx`)
- Full-width canvas panel under the header, 1px ink bottom rule, opened by hover/focus on "Collections", closes 180ms after the pointer leaves, Esc closes
- Opens with a top-to-bottom clip wipe, 280ms
- Left: series cards; right: "Go deeper" list of `01`–`04` rows (`co-data` number, `co-data` label, 13px muted note, `→`), hair rules, hover fog

### Pager (`series-pager.tsx`)
- Three cells between ink rules: `← Prev` + name · "Get a quote" primary + "All configurations" · name + `Next →`; hair dividers; hover fog; names in display caps `clamp(16px, 1.7vw, 24px)`

### Breadcrumb
- **Absent.** Pages are shallow; the `PageHero` eyebrow states the location (e.g. "Catalog" plus a spaced em dash plus "Office furniture").

---

## 6. TAGS / CHIPS

### Finish chip: `FinishChip` (`src/components/ui/finish-chip.tsx`)

Role-level contract (stable): a square material swatch with the finish name and part code beneath in mono; selected = an ink outline offset from the swatch (the state) plus one signal dot (the confirmation); a picker when given `onSelect`, a static board entry otherwise. Label alignment and spacing internals may shift; read `finish-chip.tsx` for current values.

| Property | Value |
|----------|-------|
| Width | 76px (64px in the configuration rail filter) |
| Swatch | Square (`aspect-square`), 1px hair border, `fill` from series data (a gradient is allowed here only: it describes a material) |
| Edge band | 6px strip along the bottom in the `edge` colour |
| Empty swatch | Fog |
| Name | `co-data` 10px, `leading-snug`, 10px below the swatch |
| Code | Same line block, steel |
| Radius | 0 |

### Selected State
- 1px ink **outline** offset 3px around the swatch (the outline carries the state)
- 7px signal dot, 6px from the top-right corner (confirms it); `dot={false}` where the progress rail is already lit
- `aria-pressed={true}` when it is a button; without `onSelect` it renders a static board entry

### Tags / badges
- **Absent.** No pills or badges. A category is a `co-eyebrow`; a status is a `co-data` line, optionally led by `SignalDots`.

---

## 7. OVERLAYS

### Quote dialog (`src/components/providers/quote-dialog-provider.tsx`)

| Property | Value |
|----------|-------|
| Background | Canvas `bg-co-bg` |
| Frame | 1px `border-co-ink` |
| Radius | 0 |
| Shadow | None |
| Backdrop | `bg-co-ink/70` (`rgba(35, 31, 32, 0.70)`), flat, no blur |
| Width | `min(600px, 92vw)`, `max-h-[90vh]`, scrolls inside |
| Head | Padding 24px (`sm`: 28px × 32px), 1px ink rule below; `co-eyebrow` "Enquiry", `co-h3` title (`max-w-[24ch]`), 15px muted description |
| Close button | 40px ink-outlined square, lucide `X` 16px, stroke 1.5; hover ink fill |
| Open from code | `useQuoteDialog().openQuote(subject?)` |

### Bottom sheet
- **Absent.** The mobile menu is a full-height canvas panel under the 72px header; the PDP uses the sticky quote bar.

### Sticky quote bar (`series-sticky-bar.tsx`)

| Property | Value |
|----------|-------|
| Height | 68px (`SERIES_BAR_HEIGHT`) |
| Background | Fog, 1px ink top rule |
| Content | `co-data` summary (name · size), finish in steel, code in steel (lg), `Button size="sm"` "Get a quote" (no dots) |
| Motion | Slides up 300ms `cubic-bezier(0.65, 0, 0.35, 1)` |

### Image lightbox (`image-lightbox.tsx`)
- Ink ground, canvas-outlined square controls (40px, 48px for prev/next), hover canvas fill, disabled at opacity 0.3

### Dropdown / popover / tooltip
- **Absent.** Selects are native (`Select`); the only hover panel is the nav drawer; labels are printed, not hovered.

---

## 8. STATE PATTERNS

### Empty State (`catalog-browser.tsx`)
- Hair rules top and bottom, padding `clamp(48px, 7vw, 96px)` 0, left-aligned (not centred)
- `co-data` line: "00 results" plus the reason
- 15px ink-soft sentence, `max-w-[48ch]`
- Actions 32px below: `secondary` "Clear filters" + `primary` "Ask us"
- No illustration, no icon

### Loading
- Inline: none; a submitting button is disabled (opacity 0.5)
- Full screen: none; pages are server-rendered in their finished state
- Content appearance: CSS wipe (`co-reveal`) from a finished resting state; images `co-clip`

### Sent (`FormSent`, `form-status.tsx`)
- `role="status"`, padding 24px × 56px (`sm` 32px × 80px; compact 24px × 40px)
- `co-data` line led by `SignalDots`, e.g. "Enquiry received"
- `co-h3` title 24px below, 15px muted body

### Error (`FormError`)
- `role="alert"`, `co-data` ink, 2px ink left rule, `pl-3`, "Not sent" plus a spaced em dash plus the message
- Tone: plain, specific, no alarm colour, no exclamation marks

### Disabled
- Opacity 0.5, no interaction, layout unchanged, no hover

### Placeholder media (`ImagePlaceholder`)
- Fog frame (canvas for cut-out slots), 1px hair, registration cross 12px from the top-left, `co-eyebrow` "Placeholder" plus the hint. Never filler photography.

---

## 9. TOGGLE / SWITCH

**Derived.** Signal has no switch. A binary choice is a two-cell `SegmentedControl` ("Off" / "On") with `aria-pressed`, selected cell ink-filled. Justified by Principle 3 (square) and the existing size selector: one control family for every discrete choice.

---

## 10. CHECKBOX

**Derived.** Not on the site. If a multi-select is ever needed: 16px square, 1px ink border, radius 0; checked = ink fill with a canvas tick drawn from two 1.5px strokes; label `co-data`, 12px gap; focus = 2px ink outline offset 2px; disabled opacity 0.5. Never green.

---

## 11. RADIO

**Derived.** Not on the site. Single choice is a `SegmentedControl`. Round radios would be a third round shape; Signal allows two (the dots).

---

## 12. SEGMENTED CONTROL: `SegmentedControl` (`src/components/ui/segmented-control.tsx`)

The size selector, and the catalog's category and budget filters.

Role-level contract (stable): one ink-framed row of square cells sharing their rules; the selected cell is an ink fill with canvas text plus `aria-pressed`; hover is fog; never green; wraps onto a second row that shares rules with the first. Sizing internals below are at time of writing (a 44px minimum touch height is being introduced); read `segmented-control.tsx` for current values.

| Property | Value |
|----------|-------|
| Cell | `co-data`, `min-w-[64px]`, padding 12px 16px, centred (check the file for the current min height) |
| Frame | 1px ink per cell; cells overlap by 1px (`-ml-px -mt-px`, container `pl-px pt-px`) so wrapped rows share rules |
| Selected | `bg-co-ink text-co-bg`, `z-10`, `aria-pressed="true"` |
| Hover | `bg-co-bg-alt` (fog) |
| Locked | All cells pressed, disabled, `cursor-default` (square / round tops lock depth) |
| `tone="dark"` | 1px canvas frame, selected canvas fill with ink text, hover `#3B3637` |
| Group | `role="group"` + `aria-label` naming the unit ("Length in millimetres") |

Options come from `src/lib/series` (`config.lens`, `config.deps`, `depthOptions`). Never a slider: sizes are discrete.

---

## 13. SELECT: `Select` (`src/components/ui/select.tsx`)

| Property | Value |
|----------|-------|
| Element | Native `<select>`, `appearance-none` (the platform's own accessible list) |
| Field | Same underline as `Input`: 1px ink bottom, 17px Archivo, transparent |
| Chevron | Inline SVG 11 × 7px, 1px ink stroke, `right 2px center` |
| Padding-right | 28px (`pr-7`) |
| States | As `Input` (focus outline, invalid 2px rule, disabled 0.5) |

---

## 14. TEXTAREA

Inherits `Input` with `min-h-[96px]` and `resize-y`. No character count.

---

## 15. DATA TABLE

**Derived from `SpecRows` and the bill of components.** No `<table>` chrome: header labels `co-eyebrow` on a hair rule (`IndexHeader` pattern), rows `co-data` at 11px padding with hair dividers, numeric columns right-aligned and tabular, no zebra stripes, no hover unless the row is a link (then fog).

---

## 16. TABS: contact form tabs (`src/components/forms/contact-form-tabs.tsx`)

| Property | Value |
|----------|-------|
| Frame | 1px ink around tabs and panel; ink rule under the tab row; 1px ink divider between tabs |
| Tab | `co-data`, padding 16px (`sm` 24px) × 16px, left-aligned, `01` / `02` prefix in steel |
| Active | Fog fill, ink text, **3px signal bar** on the bottom edge (`-bottom-px`), `aria-selected` |
| Inactive | Steel text, hover ink |
| Roles | `tablist` / `tab` / `tabpanel` |

The active tab's bar is this screen's one content green; nothing else in the form may be lit.

---

## 17. ACCORDION: FAQ (`src/components/common/faq-section.tsx`)

| Property | Value |
|----------|-------|
| Element | Native `<details>` / `<summary>` (works without JS) |
| Row | Padding 20px 0, 1px hair bottom, hover fog |
| Number | `co-data` steel, ink when open |
| Question | 16px (17px `md`), weight 500, ink, line-height 1.4 |
| Toggle | 28px square, 1px ink border, `co-data` 13px `+`; open = ink fill with canvas `−` |
| Answer | 15px / 1.55 ink soft, `max-w-[65ch]`, 24px bottom padding |

---

## 18. PROGRESS: `ProgressRail` (`src/components/ui/progress-rail.tsx`)

The green bar from inside the logo's O.

| Property | Value |
|----------|-------|
| Track | 2px, hair (`#3B3637` on ink) |
| Fill | `bg-co-green`, width = step / total, `transition-[width] 400ms linear` |
| Radius | 0 (square ends) |
| Caption | `co-data` steel, 8px below: "Step n of m" (always written out) |
| ARIA | `role="progressbar"` with `aria-valuenow` / `aria-valuetext` |

### Pagination bars (hero carousel, configuration gallery)
- 3px tall, 20 to 40px wide, signal when active, hair (or `#3B3637` on ink) otherwise. Hero pagination lives in a solid ink corner block with `co-data` labels (`01 Index`).

---

## 19. SIGNAL DOTS: `SignalDots` (`src/components/ui/signal-dots.tsx`)

| Size | Dot | Gap |
|------|-----|-----|
| `sm` | 7 × 7px | 4px |
| `lg` | 22 × 22px | 12px |

`rounded-full bg-co-green`, `aria-hidden`. Meaning: "on". Used on the header quote button, sent forms, the selected finish chip (single dot), an index row on hover. Check the green budget before adding a pair.

---

## 20. DRAWING MARKS

### Dimension line: `DimensionLine` (`src/components/ui/dimension-line.tsx`)

| Property | Value |
|----------|-------|
| Rule | 1px `currentColor`, draws with `co-rule` (400ms linear) |
| Ticks | 1px × 11px at both ends (static) |
| Label | `co-data` 10px, `px-2`, knocked out of the line on its ground: `surface="canvas"` / `"fog"` / `"ink"` |
| Axis | `x` (needs a width) or `y` (needs a height; label rotated −90°, 11px wide) |
| Value | From `derive.ts`: `configLengthLabel(config)` → `1200 — 1600`, or `` `${series.workingHeightMm} H` `` → `720 H` |
| ARIA | `aria-hidden` (the size is also in the spec rows or caption) |

Every product render carries at least one. Interiors carry a caption but no dimension.

### Registration cross: `RegistrationCross`
- 17 × 17px, two 1px `currentColor` strokes crossing at 8px, `absolute`, pinned to figure corners (`-top-6`, `left-2` / `right-1` on the hero)

### Figure caption: `FigureCaption`
- `co-data` steel; format `figureNumber(n)` + ` — ` + caption, e.g. `Fig. 01 — STRETCH S single table · medium beam · 1 seats`; numbered down each page

### Hairline grid: `HairlineGrid`
- 13 lines (12 columns) inside `co-shell`, 1px; `tone="hair"` `#DCD6C4` (every `PageHero`) or `tone="signal"` `#9DD089` (homepage hero only); lines draw down with a 30ms stagger; phones draw every third line

### Measure rule: `MeasureRule`
- A `DimensionLine` without a value: 1px ink rule with 11px end ticks, draws left to right

### Anatomy hotspot (`src/components/series/series-anatomy.tsx`)
- Numbered marker on the render: 24px (28px `sm`) square, 1px ink border, `co-data` number; canvas fill, hover and active = ink fill with canvas text, `aria-pressed`
- Active label: an ink tag under the marker (`co-data`, canvas text, padding 4px 8px, `max-w-[200px]`, truncated) that wipes in when the part is selected. It is a state label, not a hover tooltip
- Part details beneath in `SpecRows`

### Tick number: `TickNumber`
- Counts to a new value over 400ms linear on change; first render is the real value; screen readers get the target only

---

## 21. SECTION OPENERS AND CLOSERS

### `SectionHeading` (`src/components/common/section-heading.tsx`)
- Grid `200px · 1fr · minmax(0, 420px)` on one baseline (`items-end`), stacks on phones
- `co-eyebrow` label (`01 / Systems`; /about uses `§01 — Definition`), `co-h2` title `max-w-[18ch]`, 15px ink-soft blurb `max-w-[46ch]` + optional `link` button with arrow
- Closed by a 1px **ink** rule (`border-co-panel-fg` on dark), `pb-[clamp(20px,2vw,28px)]`, `mb-[clamp(32px,3.4vw,48px)]`
- Wrapped in `Reveal` (left-to-right wipe)

### `PageHero` (`src/components/common/page-hero.tsx`)
- Canvas, `HairlineGrid` (hair), 1px ink bottom rule
- `co-eyebrow` → `co-h1` with `KineticHeading` (`max-w-[16ch]`) → `co-lead` (`max-w-[58ch]`), vertical gaps `clamp(20px, 2.6vw, 36px)`
- Optional `aside` (usually `SpecRows`) across columns 9 to 12 on a canvas plate; claim across 7
- Padding `pt-[clamp(40px,5vw,72px)] pb-[clamp(48px,6vw,96px)]`; text only, so the claim is the LCP element

### `CtaBand` (`src/components/common/cta-band.tsx`)
- Every page ends on it. `tone="light"`: canvas, 1px ink top rule. `tone="dark"`: the ink block
- Grid `1.4fr · 1fr`, padding `clamp(72px, 9vw, 140px)` 0
- `co-eyebrow` "Enquiry", `co-h1` heading `max-w-[16ch]`, body `clamp(15px, 1.3vw, 18px)` ink soft
- `Button size="lg"` primary "Get a quote" (**no dots**) + optional `secondary` route

### Homepage hero: `SignalHeroPanel` (`src/components/home/signal-hero.tsx`)
- `min-h-[100svh]`, canvas, `HairlineGrid tone="signal"`; claim `co-display` at `clamp(40px, 5.3vw, 76px)` with the second line in steel; `co-lead` in ink; primary "Configure a desk" + secondary "Book a showroom visit"
- Figure: two registration crosses, the render in an `isolate` group over a canvas plate, the group cut to the product by a silhouette matte (`RENDER_MATTES`) so the green lines run through the sweep, or over a `co-cutout-plate` when no matte exists, a vertical `DimensionLine` (working height) and a horizontal one (length per seat), `FigureCaption` + coordinates in `co-data` steel

---

### Swipe rail: `co-rail` (CSS utility in `globals.css`)
- Under 768px only: a flex row that scrolls sideways, `scroll-snap-type: x mandatory`, each child `min(80%, 340px)` wide so the next one shows at the edge, bleeding through the shell gutter (18px / 24px); scrollbar hidden
- From 768px it does nothing: the element declares its real grid with `md:` classes (`co-rail md:grid md:grid-cols-2 …`)
- Used for figure sets on the homepage (Spaces, Projects); offscreen figures wipe open as they are swiped in

### Photographed range: `CollectionGallery` (`src/components/collections/collection-gallery.tsx`)
- For a collection with photographs and no specification: `PageHero` (wordmark, lead, `SpecRows`: Type, Range, Sizes "Quoted to your plan", Pricing), the lead interior as Fig. 01, `01 / Range` (scenes two-up, an odd last one full width; cut-outs four-up on a top ink rule), `02 / Finishes` on fog when a leg-finish shot exists, `CtaBand`
- No `DimensionLine`: there is no size to read. Interiors `co-highkey`; cut-outs `co-cutout` with `co-reveal` on the image; the finish shot is not desaturated

## 22. LOGO: `Logo` (`src/components/common/logo.tsx`)

| Tone | File | Ground |
|---|---|---|
| `dark` | `logo-primary.svg` (ink letters, green dots and bar) | Canvas, fog, light film |
| `light` | `logo-reverse.svg` (white letters, green dots and bar) | Ink, dark film |
| `mono-dark` / `mono-light` | `logo-ink.svg` / `logo-white.svg` | One-colour contexts only |

Minimum 140px wide; clear space half the cap height. Never retyped, redrawn or recoloured. Header 140/150px, footer 168px. The compact mark (`mark-*.svg`) is for icons only.

---

## 23. ABSENT ON PURPOSE

| hue component | Signal answer |
|---|---|
| Avatar | None. Founders get a photo as supplied or a labelled empty frame |
| Badge / tag / pill | `co-eyebrow` or `co-data` text, optionally `SignalDots` |
| Toast | `FormSent` replaces the form in place |
| Tooltip / popover | Print the label beside the thing. The one floating label is the anatomy hotspot tag (below), and it shows on selection, not on hover |
| Spinner / skeleton | Server-rendered finished content; disabled submit at 0.5 |
| Slider / range | `SegmentedControl` with the discrete sizes from `src/lib/series` |
| Switch / radio | `SegmentedControl` |
| Combobox | Native `Select` |
| Alert banner (coloured) | `FormError` pattern: 2px ink left rule, `co-data`, ink |
