# signal-design: Platform Mapping

**The rule:** inside this repo, write code with the existing `co-*` tokens, utilities and components. The hue semantic names (`--background`, `--surface1`, `--text1`, `--accent`...) exist only so this skill can reason in a shared vocabulary; each one maps to a real `co-*` token below. **Never add a parallel token set to `src/app/globals.css`**, never add a `tailwind.config.*` (Tailwind v4 reads `@theme inline`), and never hard-code a hex value in a component.

---

## 1. REACT / NEXT.JS / TAILWIND v4 (this repo)

Tokens live in `src/app/globals.css` inside `@theme inline { ... }`. Each `--color-co-x` becomes the utilities `bg-co-x`, `text-co-x`, `border-co-x`, `outline-co-x`, `fill-co-x`; each `@utility co-x` is a class. If a genuinely new token is ever needed, add it to `@theme inline` with a `co-` name and record its contrast in `design.md`. Read `node_modules/next/dist/docs/` before touching Next APIs (see `AGENTS.md`).

### 1.1 Colour: hue name → real token

| hue token | Light (canvas) | Utility | Dark (ink block) | Utility on ink |
|---|---|---|---|---|
| `--background` / `--bg` | `--color-co-bg` `#FBF8EE` | `bg-co-bg` | `--color-co-panel` `#231F20` | `bg-co-panel` |
| `--surface1` | `--color-co-bg-alt` `#F3EFE1` | `bg-co-bg-alt` | `--color-co-panel-border` `#3B3637` | `hover:bg-co-panel-border` |
| `--surface2` | `--color-co-placeholder-frame-3` `#E9E4D3` | (unused; reserve) | `--color-co-ink-soft` `#3D3A36` | `bg-co-ink-soft` |
| `--surface3` | `--color-co-bg` `#FBF8EE` (sheet on fog) | `bg-co-bg` | `--color-co-panel` | `bg-co-panel` |
| `--border` | `--color-co-border` `#DCD6C4` | `border-co-border` | `--color-co-panel-border` | `border-co-panel-border` |
| `--border-visible` | `--color-co-ink` `#231F20` | `border-co-ink` | `--color-co-panel-fg` `#FBF8EE` | `border-co-panel-fg` |
| `--text1` | `--color-co-ink` | `text-co-ink` | `--color-co-panel-fg` | `text-co-panel-fg` |
| `--text2` | `--color-co-ink-soft` `#3D3A36` | `text-co-ink-soft` | `--color-co-panel-muted` `#B4AEA4` | `text-co-panel-muted` |
| `--text3` | `--color-co-muted` `#55514A` | `text-co-muted` | `--color-co-panel-muted` | `text-co-panel-muted` |
| `--text4` | `--color-co-muted-2` `#6B665D` | `text-co-muted-2` (or `co-eyebrow`) | `--color-co-panel-faint` `#9E988D` | `text-co-panel-faint` |
| `--accent` | `--color-co-ink` | `bg-co-ink text-co-bg` | `--color-co-panel-fg` | `bg-co-bg text-co-ink` |
| `--accent-subtle` | `--color-co-bg-alt` | `bg-co-bg-alt` | `--color-co-panel-border` | `bg-co-panel-border` |
| `--signal` (ext) | `--color-co-green` `#5EB646` | `bg-co-green` only | same | `bg-co-green` only |
| `--signal-grid` (ext) | `--color-co-grid-signal` `#9DD089` | `bg-co-grid-signal` (via `HairlineGrid tone="signal"`) | n/a | n/a |
| `--success` | `--color-co-green` | `SignalDots` | same | `SignalDots` |
| `--warning` / `--error` | `--color-co-ink` | `text-co-ink border-co-ink` (`FormError`) | `--color-co-panel-fg` | `text-co-panel-fg` |
| `--success-bg` / `--warning-bg` / `--error-bg` | `--color-co-bg` (no tint) | none | `--color-co-panel` | none |
| overlay | `bg-co-ink/70` | `bg-co-ink/70` | same | same |

Legacy names that resolve to the same values (`--color-co-surface`, `--color-co-hero-bg`, `--color-co-card-border`, `--color-co-faint`, `--color-co-placeholder`, `--color-co-green-light`) may appear in old code; prefer the names in the table. `--color-co-cta-green` is **ink** (`#231F20`) despite its name. `--color-co-green-dark`, `-pale`, `-paler` are banned.

### 1.2 Type: hue name → real utility

| hue token | Utility | Notes |
|---|---|---|
| `--display` | `co-display` | Homepage overrides size: `co-display text-[clamp(40px,5.3vw,76px)]` |
| `--title` (ext) | `co-h1` | `PageHero`, `CtaBand` |
| `--heading` | `co-h2` | `SectionHeading` |
| `--subheading` | `co-h3` | Card, dialog, form-sent titles |
| `--lead` (ext) | `co-lead` | Colour ink soft built in |
| `--body` | (none: body default 15px / 1.55) | `text-[15px] leading-[1.55]` when restating |
| `--body-sm` | `text-[14px] leading-[1.55]` | Taglines |
| `--caption` | `text-[12.5px] leading-relaxed` | Footnotes |
| `--label` | `co-eyebrow` | Steel built in; `Label` component wraps it |
| `--data` (ext) | `co-data` | Ink (inherits colour), tabular; add `text-[10px]` for dimension and chip labels |
| family: display | `font-display` | Sets wdth 125 + uppercase in the base layer |
| family: mono | `font-mono` | Sets wdth 87.5 |

Inline display settings for one-off sizes: `font-display text-[clamp(24px,2.8vw,40px)] font-semibold leading-[0.9] tracking-[-0.02em]`.

### 1.3 Spacing, layout, radii, motion

| Need | Use |
|---|---|
| Page width + gutters | `co-shell` (1440 max; 18 / 24 / 48px) |
| Section padding | `co-section`, `co-section-lg` |
| Spacing steps | Tailwind default scale (`gap-3.5` = 14px, `py-[11px]`); never `p-4.5` |
| Radius | none: do not write `rounded-*` (the dots already have `rounded-full`) |
| Shadow / blur | none: do not write `shadow-*`, `blur-*`, `backdrop-*`, `drop-shadow-*` |
| Line draw | `co-rule` + `data-reveal` (`data-axis="y"` for vertical) |
| Block reveal | `<Reveal>` / `<StaggerContainer>` + `<StaggerItem>` |
| Image wipe | `<ClipReveal>` (never around a cut-out); `co-wipe-in` on a click-swapped `<img>` |
| Headline | `<KineticHeading>` inside the `h1` |
| Number change | `<TickNumber value={n} />` |
| Plotter timing | `duration-[400ms] ease-linear` or `var(--duration-plot)` / `var(--ease-plot)` |
| Hover timing | `transition-colors duration-150` |
| Product render | `co-cutout` (+ `co-cutout-plate` in an `isolate` group over grid lines) |
| Interior photo | `co-highkey` |

### 1.4 Use the existing components

| Component | File | Use it when |
|---|---|---|
| `Button` | `src/components/ui/button.tsx` | Any action or CTA link. `primary` for the one main action, `secondary` for the alternative, `link` + `arrow` for "see more"; `*OnDark` on the ink block. `dots` on the header quote button only |
| `SegmentedControl` | `src/components/ui/segmented-control.tsx` | Any discrete choice: sizes, filters, a binary toggle. `tone="dark"` on the ink block, `locked` for derived values |
| `FinishChip` | `src/components/ui/finish-chip.tsx` | A material / finish swatch, as a picker (`onSelect`) or a board entry. `dot={false}` if the progress rail is already lit |
| `ProgressRail` | `src/components/ui/progress-rail.tsx` | A multi-step flow (the configurator). The step is always written out |
| `SpecRows` | `src/components/ui/spec-rows.tsx` | Any key / value product data; the `PageHero` aside; `tone="dark"` in the spec block; `columns={2}` for long lists |
| `IndexRow` / `IndexHeader` | `src/components/ui/index-row.tsx` | A list of systems, services, sectors or configurations, read like a parts list |
| `DimensionLine` | `src/components/ui/dimension-line.tsx` | On every product render, with a label from `derive.ts`. Match `surface` to the ground behind it |
| `MeasureRule` | `src/components/ui/measure-rule.tsx` | A decorative measured rule with no value |
| `RegistrationCross` | `src/components/ui/registration-cross.tsx` | Pinning the corners of a figure |
| `FigureCaption` / `figureNumber` | `src/components/ui/figure-caption.tsx` | Captioning any figure; number down the page |
| `HairlineGrid` | `src/components/ui/hairline-grid.tsx` | Behind a hero (the parent needs `relative`). `tone="signal"` on the homepage only |
| `SignalDots` | `src/components/ui/signal-dots.tsx` | Marking something switched on, after checking the green budget |
| `TickNumber` | `src/components/ui/tick-number.tsx` | A live size that changes with a selection |
| `Input` / `Textarea` / `Select` / `Label` | `src/components/ui/{input,textarea,select,label}.tsx` | Every form field; use `FORM_GRID` and `FIELD` from `form-status.tsx` for layout |
| `Reveal`, `StaggerContainer`, `StaggerItem` | `src/components/ui/scroll-reveal.tsx` | Revealing blocks on scroll (CSS, server-safe) |
| `ClipReveal` | `src/components/ui/clip-reveal.tsx` | Wiping in an interior photo frame (never a cut-out) |
| `KineticHeading` | `src/components/ui/kinetic-heading.tsx` | The words of an `h1` claim |
| `SectionHeading` | `src/components/common/section-heading.tsx` | Opening every section |
| `PageHero` | `src/components/common/page-hero.tsx` | Opening every secondary route |
| `CtaBand` | `src/components/common/cta-band.tsx` | Ending every page (except /contact and /b2b, which end on the form) |
| `Logo` | `src/components/common/logo.tsx` | Every appearance of the wordmark |
| `ImagePlaceholder` | `src/components/common/image-placeholder.tsx` | An image slot without real photography yet (`variant="white"` for a cut-out slot) |
| `FormSent` / `FormError` / `FormFootnote` | `src/components/forms/form-status.tsx` | Form outcomes and the reassurance line |
| `EnquireButton` | `src/components/common/enquire-button.tsx` | Opening the quote dialog with a subject from a server page |
| `useQuoteDialog().openQuote(subject?)` | `src/components/providers/quote-dialog-provider.tsx` | Opening the quote dialog from a client component |
| `FaqSection` | `src/components/common/faq-section.tsx` | Question / answer lists |
| `ProductCard` | `src/components/catalog/product-card.tsx` | A catalog product in a grid |

---

## 2. HTML / CSS (standalone mockups only)

For a standalone HTML file outside the app (a mockup, a pitch page, this skill's `component-library.html`). Not for `globals.css`.

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,100..900&family=Martian+Mono:wdth,wght@75..112.5,100..800&display=swap" rel="stylesheet">
```

The `wdth` ranges matter: without them `font-stretch: 125%` and `87.5%` silently do nothing.

### CSS Custom Properties: Primary Mode (canvas)

```css
:root {
  /* Signal names, identical values to src/app/globals.css */
  --color-co-bg: #fbf8ee;
  --color-co-bg-alt: #f3efe1;
  --color-co-ink: #231f20;
  --color-co-ink-soft: #3d3a36;
  --color-co-muted: #55514a;
  --color-co-muted-2: #6b665d;
  --color-co-border: #dcd6c4;
  --color-co-border-strong: #8f8874;
  --color-co-green: #5eb646;
  --color-co-grid-signal: #9dd089;
  --color-co-panel: #231f20;
  --color-co-panel-border: #3b3637;
  --color-co-panel-fg: #fbf8ee;
  --color-co-panel-muted: #b4aea4;
  --color-co-panel-faint: #9e988d;

  /* hue aliases */
  --background: var(--color-co-bg);
  --bg: var(--background);
  --surface1: var(--color-co-bg-alt);
  --surface2: #e9e4d3;
  --surface3: var(--color-co-bg);
  --border: var(--color-co-border);
  --border-visible: var(--color-co-ink);
  --text1: var(--color-co-ink);
  --text2: var(--color-co-ink-soft);
  --text3: var(--color-co-muted);
  --text4: var(--color-co-muted-2);
  --accent: var(--color-co-ink);
  --accent-subtle: var(--color-co-bg-alt);
  --signal: var(--color-co-green);
  --success: var(--color-co-green);
  --success-bg: var(--color-co-bg);
  --warning: var(--color-co-ink);
  --warning-bg: var(--color-co-bg);
  --error: var(--color-co-ink);
  --error-bg: var(--color-co-bg);

  /* Fonts */
  --font-display: "Archivo", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Archivo", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Martian Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Type scale */
  --text-display: clamp(44px, 8.9vw, 128px);
  --text-title: clamp(38px, 6vw, 88px);
  --text-heading: clamp(30px, 3.9vw, 56px);
  --text-subheading: clamp(20px, 1.7vw, 24px);
  --text-lead: clamp(16px, 1.32vw, 19px);
  --text-body: 15px;
  --text-body-sm: 14px;
  --text-caption: 12.5px;
  --text-label: 11px;

  /* Spacing */
  --space-2xs: 2px;
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 48px;
  --space-3xl: 64px;
  --space-4xl: 96px;
  --space-co-section: clamp(64px, 8vw, 120px);

  /* Radii: square, except the dots */
  --radius-cards: 0;
  --radius-buttons: 0;
  --radius-inputs: 0;
  --radius-tags: 0;
  --radius-modals: 0;
  --radius-dot: 50%;

  /* Motion */
  --ease-fast: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-plot: linear;
  --ease-wipe: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-co: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-plot: 400ms;
  --duration-wipe: 600ms;

  /* Shadows: none, on purpose */
  --shadow-1: none;
  --shadow-2: none;
  --shadow-3: none;
}

.display { font-family: var(--font-display); font-stretch: 125%; font-weight: 600; text-transform: uppercase; letter-spacing: -0.02em; line-height: 0.9; }
.data { font-family: var(--font-mono); font-stretch: 87.5%; font-size: 11px; line-height: 1.5; letter-spacing: 0.02em; text-transform: uppercase; font-variant-numeric: tabular-nums; }
.cutout { mix-blend-mode: multiply; }
```

### Secondary Mode (the ink block)

Signal has no site-wide dark theme and does not follow `prefers-color-scheme`. Dark is a block:

```css
.ink-block {
  --background: var(--color-co-panel);
  --bg: var(--background);
  --surface1: var(--color-co-panel-border);
  --surface2: var(--color-co-ink-soft);
  --surface3: var(--color-co-panel);
  --border: var(--color-co-panel-border);
  --border-visible: var(--color-co-panel-fg);
  --text1: var(--color-co-panel-fg);
  --text2: var(--color-co-panel-muted);
  --text3: var(--color-co-panel-muted);
  --text4: var(--color-co-panel-faint);
  --accent: var(--color-co-panel-fg);
  --accent-subtle: var(--color-co-panel-border);
  --success: var(--color-co-green);
  --success-bg: var(--color-co-panel);
  --warning: var(--color-co-panel-fg);
  --warning-bg: var(--color-co-panel);
  --error: var(--color-co-panel-fg);
  --error-bg: var(--color-co-panel);
  --shadow-1: none;
  --shadow-2: none;
  --shadow-3: none;
  background: var(--background);
  color: var(--text1);
}
```

In the app the same thing is `bg-co-panel text-co-panel-fg` plus each component's `tone="dark"` / `*OnDark` variant.

---

## 3. SWIFTUI / iOS

Signal is a web-only system; there is no Cohuman app. If a native surface is ever built, carry the values, not the web structure.

### Font Registration

Bundle the Archivo and Martian Mono variable TTFs (both are OFL on Google Fonts), list them under `UIAppFonts`, and set the width axis through `UIFontDescriptor` variation attributes (`wdth` 125 for display, 87.5 for mono). SwiftUI's `Font.custom` alone cannot set the axis.

### Color Extension

```swift
import SwiftUI

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        self.init(.sRGB,
                  red: Double((int >> 16) & 0xFF) / 255,
                  green: Double((int >> 8) & 0xFF) / 255,
                  blue: Double(int & 0xFF) / 255,
                  opacity: 1)
    }

    static let coCanvas = Color(hex: "FBF8EE")
    static let coFog = Color(hex: "F3EFE1")
    static let coHair = Color(hex: "DCD6C4")
    static let coInk = Color(hex: "231F20")
    static let coInkSoft = Color(hex: "3D3A36")
    static let coMuted = Color(hex: "55514A")
    static let coSteel = Color(hex: "6B665D")
    static let coSignal = Color(hex: "5EB646")   // state only, never text
    static let coInkRule = Color(hex: "3B3637")
    static let coOnInkMuted = Color(hex: "B4AEA4")
    static let coOnInkFaint = Color(hex: "9E988D")
}
```

### Spacing & Radius Constants

```swift
enum CoSpacing {
    static let xxs: CGFloat = 2
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
    static let xxxl: CGFloat = 64
    static let xxxxl: CGFloat = 96
}

enum CoRadius {
    static let all: CGFloat = 0   // Rectangle(), never RoundedRectangle
    // Signal dots: Circle(), 7pt, the only round shape
}
```

Use `Rectangle()` and `.overlay(Rectangle().stroke(Color.coInk, lineWidth: 1))` for frames; no `.shadow`, no `.background(.ultraThinMaterial)`.
