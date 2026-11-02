# signal-design: Tokens

Every value here is read from `src/app/globals.css` (authoritative) and `design-model.yaml`. The token **names** in globals.css are historical (`bg-alt`, `panel`, `green`, `cta-green`...) and were kept so call sites did not move; the **values** are the Signal roles. Write code with the `co-*` names (see `platform-mapping.md`); the hue names below (`--background`, `--text1`...) are for reasoning only.

## 0. PRIMITIVES

### Color Ramps

**Neutral** (warm ivory paper to brand ink; every step is a real token value, nothing interpolated)

| Step | Hex | Signal name | globals.css token | Use |
|------|-----|-------------|-------------------|-----|
| 50 | `#FBF8EE` | Canvas | `--color-co-bg`, `--color-co-surface` | Page ground. Never pure white |
| 100 | `#F3EFE1` | Fog | `--color-co-bg-alt`, `--color-co-hero-bg` | Panels, hover rows, sticky bar, placeholder frames |
| 200 | `#E9E4D3` | Fog deep | `--color-co-placeholder-frame-3` | Reserved; steel text fails AA on it (4.48:1) |
| 300 | `#DCD6C4` | Hair | `--color-co-border`, `--color-co-card-border` | 1px structural rules |
| 400 | `#B4AEA4` | On-ink muted | `--color-co-panel-muted` | Secondary text on the ink block |
| 500 | `#9E988D` | On-ink faint | `--color-co-panel-faint` | Labels and keys on the ink block |
| 550 | `#8F8874` | Rule strong | `--color-co-border-strong` | A rule that is the only edge of a control (3.33:1) |
| 600 | `#6B665D` | Steel | `--color-co-muted-2`, `--color-co-faint`, `--color-co-placeholder` | Meta: eyebrows, labels, captions, placeholders |
| 700 | `#55514A` | Muted | `--color-co-muted` | Secondary body copy, inactive nav |
| 800 | `#3D3A36` | Ink soft | `--color-co-ink-soft` | Body copy, leads, primary button hover |
| 850 | `#3B3637` | Ink rule | `--color-co-panel-border` | Hairlines and hover fill on the ink block |
| 900 | `#231F20` | Ink | `--color-co-ink`, `--color-co-panel` | Type, primary buttons, the ink block |

There is no 950. Ink is the floor: nothing on the site is darker than `#231F20`.

**Brand: Signal green** (two used steps, on purpose)

| Step | Hex | globals.css token | Use |
|------|-----|-------------------|-----|
| 300 | `#9DD089` | `--color-co-grid-signal` | Homepage hero grid lines only (the logo green mixed 60/40 with canvas) |
| 500 | `#5EB646` | `--color-co-green`, `--color-co-green-light` | **State only**: dots, progress rail, active bar. Same green as the logo masters |

**Defined but banned** (in globals.css, used nowhere in `src`, not part of the system): `--color-co-green-dark` `#2F7A24`, `--color-co-green-pale` `#CFE8C6`, `--color-co-green-paler` `#E7F2DF`. Do not reach for them to make green legible as text or to tint a panel; that is the rule firing.

**Status Colors**

Signal has no alarm palette. There is no red and no amber ramp.

| Status | Foreground | Tint | How it is carried |
|--------|-----------|------|-------------------|
| Success / sent | `#5EB646` (non-text) | none | `SignalDots` + a mono status line, `role="status"` |
| Warning | `#231F20` ink | none | Words, in ink |
| Error | `#231F20` ink | none | 2px ink left rule + `co-data` "Not sent" line, `role="alert"` |

### Spacing Primitives

`0, 1, 2, 3, 4, 6, 8, 10, 11, 12, 14, 16, 18, 20, 22, 24, 28, 32, 40, 48, 64, 72, 96, 120, 160` (px). Tailwind v4's default 4px scale: halves up to 3.5 (`1.5` = 6px, `2.5` = 10px, `3.5` = 14px), then whole steps. The odd values are real: 11px spec-row padding, 18px phone gutter, 22px button padding. Fractional utilities beyond 3.5 (`p-4.5`) produce no CSS; use an arbitrary value (`p-[18px]`).

### Radii Primitives

`0` and `50%`. Zero on everything; `50%` only on the signal dots.

---

## 1. TYPOGRAPHY

### Font Stack

| Role | Font | Fallback | Weight | Use |
|------|------|----------|--------|-----|
| **Display** | `"Archivo"` at `font-stretch: 125%` (Archivo Expanded) | `ui-sans-serif, system-ui, sans-serif` | 600 | Every claim: hero, page titles, section titles, card titles, row names. Always UPPERCASE |
| **Body / UI** | `"Archivo"` at `font-stretch: 100%` | `ui-sans-serif, system-ui, sans-serif` | 400 (500 for FAQ questions) | Reading text, leads, standfirsts, field values |
| **Mono / Data** | `"Martian Mono"` at `font-stretch: 87.5%` | `ui-monospace, SFMono-Regular, Menlo, monospace` | 400 | Sizes, codes, quantities, steps, labels, buttons, nav, captions |

Display and body are the **same variable file**: Archivo's `wdth` axis runs 62 to 125. Tokens: `--font-display`, `--font-body` (both `var(--font-archivo)`), `--font-mono` (`var(--font-martian)`). The `.font-display` class sets `font-stretch: 125%` and uppercase in the base layer; `.font-mono` sets `font-stretch: 87.5%`.

### Mono Font Rules

**`mono_for_code`: false** · **`mono_for_metrics`: true**

There is no code on a furniture lead-gen site, so `mono_for_code` is moot and set false. `mono_for_metrics` is the heart of the brand: anything you could measure is Martian Mono, uppercase, 11px, tabular figures. That covers millimetre sizes, part codes (`CHSS-ST-SB160`), quantities (`2 pcs`), seat counts, steps (`Step 2 of 3`), result counts (`04 / 16 products`), coordinates, figure numbers, price bands and every label.

- **`mono_for_code: false`:** no code blocks exist; if one ever appears, it takes `co-data` like any other identifier.
- **`mono_for_metrics: true`:** sizes are never typed in Archivo, even inside a sentence-heavy card. A dimension label is `co-data` at 10px; a spec value is `co-data` at 11px.

Archivo Expanded matches the width of the wordmark, Archivo is a plain grotesque for reading, and Martian Mono is a narrow, engineered mono that reads like a drawing's title block. One variable axis does all the work.

### Type Scale

Seven canonical hue tokens plus three Signal extensions (marked +). Sizes are fluid clamps read off the moodboard at 1440px and scaled to a 360px phone.

| Token | Size | Line Height | Letter Spacing | Weight | Use | Utility |
|-------|------|-------------|----------------|--------|-----|---------|
| `--display` | `clamp(44px, 8.9vw, 128px)` | 0.9 | −0.02em | 600 caps, wdth 125 | Homepage claim (overridden to `clamp(40px, 5.3vw, 76px)` there) | `co-display` |
| `--title` + | `clamp(38px, 6vw, 88px)` | 0.9 | −0.02em | 600 caps, wdth 125 | `PageHero` claim, `CtaBand` heading | `co-h1` |
| `--heading` | `clamp(30px, 3.9vw, 56px)` | 0.92 | −0.02em | 600 caps, wdth 125 | `SectionHeading` title | `co-h2` |
| `--subheading` | `clamp(20px, 1.7vw, 24px)` | 1 | −0.01em | 600 caps, wdth 125 | Card titles, dialog title, form-sent title, footer claim | `co-h3` |
| `--lead` + | `clamp(16px, 1.32vw, 19px)` | 1.55 | 0 | 400, ink soft | Standfirsts under a page claim | `co-lead` |
| `--body` | 15px | 1.55 | 0 | 400 | Reading text, section blurbs | body default |
| `--body-sm` | 14px | 1.55 | 0 | 400 | Card taglines, footer address | `text-[14px] leading-[1.55]` |
| `--caption` | 12.5px | 1.625 | 0 | 400 | Footnotes under the spec block (inferred-code proviso) | `text-[12.5px] leading-relaxed` |
| `--label` | 11px | 1.5 | +0.02em | 400 caps, wdth 87.5, steel | Eyebrows, field labels, column heads, captions | `co-eyebrow` |
| `--data` + | 11px (10px in dimension lines and chip names) | 1.5 | +0.02em | 400 caps, wdth 87.5, tabular | Every measured value, code and nav item | `co-data` |

Row-name and pager titles use inline display settings rather than a scale step: `IndexRow` title `clamp(24px, 2.8vw, 40px)`, config card name `clamp(16px, 1.5vw, 20px)`, pager name `clamp(16px, 1.7vw, 24px)`, all 600, line-height 0.9 to 1, −0.02em. Button labels are Martian Mono 12px.

### Typographic Rules

- **Claims in caps, always.** Display is extended UPPERCASE at 600 with −0.02em tracking (−0.01em at h3). Never sentence-case a display face; never set a paragraph in caps.
- **The claim may fade to steel on its second line**, nothing else. Headings are ink, steel or canvas, never green.
- **Measure:** claims cap at `max-w-[16ch]` to `[18ch]`, leads at `[58ch]`, blurbs at `[46ch]`, body at `[65ch]`.
- **Mono is tabular.** `co-data` sets `tabular-nums`; counts are zero-padded (`04 / 16`) so a tally never changes width.
- **Spaced separators are data.** Ranges from `rangeLabel` are `min`, a spaced em dash (U+2014), `max`; spans from `spanLabel` use a spaced arrow (`800 → 4000 mm`); sizes use `×`. Never retype them; call the helper.
- **`text-wrap: pretty`** is on the body; leave it.

---

## 2. COLOR SYSTEM (Semantic Tokens)

Semantic tokens reference the primitives above. Components use the `co-*` names that carry them, never raw hex.

### Primary Mode (Light: canvas)

| Token | Primitive | Hex | Role |
|-------|-----------|-----|------|
| `--background` | `{neutral.50}` | `#FBF8EE` | Page ground (`bg-co-bg`) |
| `--bg` | alias | `var(--background)` | Shorthand alias for `--background` |
| `--surface1` | `{neutral.100}` | `#F3EFE1` | Fog: panels, hover rows, sticky bar, active tab (`bg-co-bg-alt`) |
| `--surface2` | `{neutral.200}` | `#E9E4D3` | Fog deep: reserved, no text in steel on it |
| `--surface3` | `{neutral.50}` | `#FBF8EE` | The sheet: a canvas panel laid on fog (enquiry form on the PDP) |
| `--border` | `{neutral.300}` | `#DCD6C4` | Hair: structural 1px rules (`border-co-border`) |
| `--border-visible` | `{neutral.900}` | `#231F20` | Ink rule: closes sections, frames controls, underlines fields (`border-co-ink`) |
| `--text1` | `{neutral.900}` | `#231F20` | Ink: headings, data values, field values |
| `--text2` | `{neutral.800}` | `#3D3A36` | Ink soft: body copy, leads, blurbs |
| `--text3` | `{neutral.700}` | `#55514A` | Muted: taglines, dialog descriptions, inactive nav |
| `--text4` | `{neutral.600}` | `#6B665D` | Steel: eyebrows, labels, captions, placeholders (meta, not disabled) |
| `--accent` | `{neutral.900}` | `#231F20` | Ink: the primary action is an ink fill |
| `--accent-subtle` | `{neutral.100}` | `#F3EFE1` | Fog: the selected / hover ground |
| `--signal` | `{signal.500}` | `#5EB646` | State only (Signal extension) |
| `--success` | `{signal.500}` | `#5EB646` | Sent: dots, never text |
| `--warning` | `{neutral.900}` | `#231F20` | Ink plus words |
| `--error` | `{neutral.900}` | `#231F20` | Ink plus a 2px ink rule and "Not sent" |

### Secondary Mode (Dark: the ink block)

Not a site-wide theme. This is the ink block generalised (footer, PDP spec block, dark `CtaBand`, hero pagination, lightbox), reached through `tone="dark"` and the `*OnDark` button variants.

| Token | Primitive | Hex | Role |
|-------|-----------|-----|------|
| `--background` | `{neutral.900}` | `#231F20` | Ink block (`bg-co-panel`) |
| `--bg` | alias | `var(--background)` | Shorthand alias for `--background` |
| `--surface1` | `{neutral.850}` | `#3B3637` | Hover fill on ink (`hover:bg-co-panel-border`) |
| `--surface2` | `{neutral.800}` | `#3D3A36` | Ink soft, nearly identical on purpose: the block is flat |
| `--surface3` | `{neutral.900}` | `#231F20` | The sheet on ink is ink |
| `--border` | `{neutral.850}` | `#3B3637` | Ink rule (`border-co-panel-border`) |
| `--border-visible` | `{neutral.50}` | `#FBF8EE` | Canvas rule: frames controls on ink (`border-co-panel-fg`) |
| `--text1` | `{neutral.50}` | `#FBF8EE` | Primary text (`text-co-panel-fg`) |
| `--text2` | `{neutral.400}` | `#B4AEA4` | Secondary text (`text-co-panel-muted`) |
| `--text3` | `{neutral.400}` | `#B4AEA4` | Same as text2: the ink block has three text tones |
| `--text4` | `{neutral.500}` | `#9E988D` | Labels, keys (`text-co-panel-faint`) |
| `--accent` | `{neutral.50}` | `#FBF8EE` | Canvas fill (`onDark` button) |
| `--accent-subtle` | `{neutral.850}` | `#3B3637` | Selected / hover ground on ink |
| `--signal` | `{signal.500}` | `#5EB646` | Unchanged on ink (the reversed logo keeps its green) |
| `--success` | `{signal.500}` | `#5EB646` | Sent |
| `--warning` | `{neutral.50}` | `#FBF8EE` | Canvas plus words |
| `--error` | `{neutral.50}` | `#FBF8EE` | Canvas plus a 2px canvas rule |

### Accent & Status Tints

| Token | Primary | Secondary | Usage |
|-------|---------|-----------|-------|
| `--accent-subtle` | `#F3EFE1` | `#3B3637` | Selected tab, hover row, sticky bar |
| `--success-bg` | `#FBF8EE` | `#231F20` | Equals the background: status never tints a surface |
| `--warning-bg` | `#FBF8EE` | `#231F20` | Equals the background |
| `--error-bg` | `#FBF8EE` | `#231F20` | Equals the background |
| `--overlay` | `rgba(35, 31, 32, 0.70)` | same | The dialog veil (`bg-co-ink/70`), flat, no blur |

### Contrast (WCAG 2.x, computed)

| Pair | Ratio | Passes |
|---|---|---|
| Ink on canvas / fog | 15.34 / 14.16 | AAA |
| Ink soft on canvas / fog | 10.64 / 9.83 | AAA |
| Muted on canvas / fog | 7.42 / 6.85 | AAA / AA |
| Steel on canvas / fog | 5.36 / 4.95 | AA |
| Steel on fog deep | 4.48 | Fails AA small text |
| Canvas on ink | 15.34 | AAA |
| On-ink muted / faint on ink | 7.40 / 5.69 | AAA / AA |
| Ink on signal | 6.41 | AA (the only text pairing with green) |
| Signal on canvas | 2.39 | Non-text only, never alone |
| Rule strong on canvas | 3.33 | UI component 3:1 |

### Color Usage Rules

- **Accent is ink.** The primary action, focus outline, selected segment and closing rules are ink. Green is never the accent.
- **One green thing in content.** The header's quote dots are always lit; content may add one genuinely selected or in-progress mark. Two green things in content means one is wrong.
- **Green is paired.** Every green mark sits next to an ink fill or outline and an ARIA state.
- **Fog is a rhythm break.** Use it for a panel, a hover row or the active tab, not as a card colour repeated across a grid.
- **One ink block per page.** The spec block, the footer, or a dark band.
- **Focus is ink, never green** (`outline: 2px solid` ink, offset 2px; canvas on the ink block).
- **Selection** (`::selection`) is ink with canvas text.

---

## 3. SPACING

### Scale (4px base, Tailwind default)

| Token | Value | Use |
|-------|-------|-----|
| `--space-2xs` | 2px | Active rule and progress track thickness, outline offset |
| `--space-xs` | 4px | Gap inside the signal dot pair, field label to value |
| `--space-sm` | 8px | Dimension label padding, caption gaps, progress caption |
| `--space-md` | 16px | Segmented cell padding-x, spec-row column gap, button group gap |
| `--space-lg` | 24px | Dialog padding, `sm` shell gutter, tab padding-x |
| `--space-xl` | 32px | Form column gap, dialog padding-x (sm), field-to-button gap |
| `--space-2xl` | 48px | `lg` shell gutter, section heading bottom margin (max) |
| `--space-3xl` | 64px | Section padding floor |
| `--space-4xl` | 96px | Hero bottom padding (max), empty-state padding (max) |
| `--space-co-section` | `clamp(64px, 8vw, 120px)` | `co-section` |
| `--space-co-section-lg` | `clamp(80px, 10vw, 160px)` | `co-section-lg`, used sparingly |

Shell: `co-shell` = `max-width: 1440px`, `padding-inline` 18px, 24px from 640px, 48px from 1024px. Spacing between a claim and its lead is fluid (`clamp(20px, 2.6vw, 36px)`); keep that pattern rather than a fixed step.

---

## 4. BORDERS & RADII

### Radii Scale (Semantic → Primitive)

| Token | Value | Primitive | Use |
|-------|-------|-----------|-----|
| `--radius-element` | 0px | `{radii[0]}` | Checkboxes (if ever), chips, swatches |
| `--radius-control` | 0px | `{radii[0]}` | Buttons, fields, segmented cells, icon buttons |
| `--radius-component` | 0px | `{radii[0]}` | Cards, image frames, panels, rows |
| `--radius-container` | 0px | `{radii[0]}` | Dialog, drawer, sticky bar |
| `--radius-pill` | 0px | `{radii[0]}` | Signal has no pills |
| `--radius-dot` | 50% | `{radii[1]}` | The 7px and 22px signal dots only |

### Border Treatment

| Element | Border |
|---------|--------|
| Cards / Surfaces | Image well: 1px hair, ink on hover. Body: 1px ink rule on top only |
| Buttons | Primary: none (ink fill). Secondary: 1px ink. Link: 1px ink bottom only |
| Inputs | No box: 1px ink bottom rule; 2px when invalid |
| Tags / Chips | Finish chip swatch: 1px hair; selected adds a 1px ink outline offset 3px |
| Modals / Sheets | 1px ink frame, 1px ink rule under the head |

Corners are square because the brand is a drawing set: a rule meets a rule at 90 degrees. The two dots are round because they are the logo's dots, and nothing else may borrow that.

---

## 5. ELEVATION & SHADOWS

| Level | Light Mode | Dark Mode | Use |
|-------|-----------|----------|-----|
| **0** | None | None | Everything |
| **1** | None: 1px hair rule | None: 1px `#3B3637` rule | Cards, rows, panels |
| **2** | None: fog surface change | None: `#3B3637` surface change | Hover rows, sticky bar, nav drawer |
| **3** | None: 1px ink frame on a flat 70% ink veil | Same | Dialog, lightbox |

Elevation strategy is **flat**. Depth is a rule or a surface change. A layer that must float (dialog, sticky bar, drawer) gets a 1px ink edge and sits on a flat veil or on the page; it never casts a shadow. The 3D assembly scene's floor shadow catcher (`assembly-scene.tsx`) is a rendered product shadow inside WebGL, not UI elevation.

---

## 6. MOTION & INTERACTION

### Personality

**Plotter, not fade.** Lines draw in at a constant speed like a pen plotter, images and blocks wipe left to right behind a moving ink hairline, numbers tick to their value, headline words lift from a mask (transform only). Nothing fades in, nothing scales, nothing bounces. Everything rests in its finished state and is held back only while `html.co-js` is set and the element lacks `data-shown`, so a page with scripts blocked is complete.

### Timing

| Type | Duration | Easing | Use |
|------|----------|--------|-----|
| **Micro** | 150ms | `cubic-bezier(0.4, 0, 0.2, 1)` (Tailwind default) | Colour changes on hover, arrow nudge (4px) |
| **Standard** | 400ms | `linear` (`--duration-plot`, `--ease-plot`) | `co-rule` line draws, nav underline draw, progress fill, number tick |
| **Emphasis** | 600ms | `cubic-bezier(0.65, 0, 0.35, 1)` | `co-reveal` block wipe (800ms for `co-clip` image wipe, 500ms for `co-wipe-in`) |

| Motion | Spec |
|---|---|
| Headline words | `co-word-rise`, translateY(110%) to 0, 600ms `--ease-co` `cubic-bezier(0.16, 1, 0.3, 1)`, 40ms per word |
| Stagger | `--co-stagger` 0.08s in CSS; `StaggerContainer` defaults to 0.1s; catalog uses 0.06s |
| Hero grid | 13 lines draw down, 400ms linear, 30ms apart |
| Sticky quote bar | Slides up from below, 300ms `cubic-bezier(0.65, 0, 0.35, 1)` |
| Nav drawer | Clip wipe top to bottom, 280ms, same curve |
| Configuration pick | Card grows and neighbours shrink 450ms; its render flies to the viewer 750ms ease-in-out-cubic |
| Header | Background and border colour, 200ms |

### Interaction States

| State | Treatment |
|---|---|
| Hover (fill controls) | Ink to ink soft; outline to ink fill with canvas text; on ink, canvas to fog |
| Hover (rows, tabs) | Fog ground; arrow nudges 4px right |
| Hover (links, nav) | Muted / steel to ink; nav draws a 1px ink underline (400ms linear) |
| Selected | Ink fill + `aria-pressed` (segmented), ink outline offset 3px + signal dot (finish chip), fog + 3px signal bar (tab) |
| Active route | Static 2px ink rule under the nav label + `aria-current="page"` |
| Focus | `outline: 2px solid` ink, offset 2px; canvas on the ink block. Never green |
| Disabled | Opacity 0.5, `pointer-events: none` (fields: `cursor: not-allowed`) |
| Reduced motion | Every keyframe off in CSS; ticks land instantly; carousels go poster-only |

Hover is never green. Hover is not state.

---

## 7. ICONOGRAPHY

> **Fallback disclosure.** Signal uses type, not icons. The kit below is the codebase's own dependency (`lucide-react`), named as the fallback for any new pictogram. It is not a Signal icon set, and the drawing marks are not icons.

### Observed style (the site's actual glyphs)

| Attribute | Value |
|-----------|-------|
| Description | Direction is a text glyph (→ ← ↑ ↓) in the running font. Open and close are `+` and `−` in a 28px ink-outlined square. Registration crosses, dimension ticks and the hamburger are built from 1px spans. Two pictograms exist: lucide `X` on the dialog close (16px, strokeWidth 1.5) and lucide `MessageCircle` on the WhatsApp button (24px, filled, strokeWidth 0). There is no phone icon. |
| Stroke weight | Thin (1px to 1.5px) |
| Corner treatment | Sharp (butt-ended 1px rules) |
| Fill style | Outline |
| Form language | Geometric |
| Visual density | Minimal |

### Fallback kit (what the component library renders)

- **Kit:** Lucide
- **Weight / variant:** single weight; the webfont draws 2px, the React components set `strokeWidth={1.5}`
- **Match score:** medium
- **Why this kit:** It is already in `package.json`, so a new pictogram matches the dialog close and the WhatsApp button. It is geometric and minimal like the drawing marks; its round caps are softer than Signal's butt-ended rules, hence medium. Material Symbols Sharp matches the corners better, but a second icon system for a site with two icons costs more than a softer cap.
- **CDN:** `https://unpkg.com/lucide-static@1.8.0/font/lucide.css`
- **Usage:** in the app, `import { X } from "lucide-react"` with `strokeWidth={1.5}`; in standalone HTML, `<i class="icon-x"></i>`

### Sizes

| Context | Size |
|---------|------|
| Inline with body text | 16px |
| Buttons | 16px (`h-4 w-4`) inside a 40px square |
| Navigation | 24px (`h-6 w-6`) inside a 48px square |

### Color rule

Icons are `currentColor`: ink on canvas, canvas on ink. Never green, never steel on a control.

### Don't

- Never add an icon where a word or an arrow glyph will do: "Download spec sheet ↓" beats a download icon.
- Never claim these are the brand's real icons: they are a best-match fallback.
