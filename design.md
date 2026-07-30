# Cohuman — Design Reference

> Warm workshop, sharp edges

**Theme:** light (single dark panel tone used for contrast sections)

Cohuman's visual language comes straight from the original Furniture Concepts 2.0
demo (`Cohuman.dc.html`), re-skinned from "shop this catalog" to "let's design your
space." It pairs a warm, paper-toned neutral canvas with a single olive-green
accent and one recurring deep-green-black panel for contrast sections. Display type
is a medium-weight grotesque (Bricolage Grotesque) with tight tracking; body copy
is a lighter, humanist sans (Figtree). Corners are sharp everywhere — cards,
buttons, inputs, images all use `border-radius: 0` — the one deliberate exception
is the WhatsApp button, which stays a circle because that shape is the universally
recognized convention for that channel. Structure is built from hairline borders
and single-pixel-gap grids (a bg-colored gap standing in for a border) rather than
shadows; there is no elevation system in this design.

## Tokens — Colors

| Name | Value | Token | Role |
|---|---|---|---|
| Bg | `#F7F5F0` | `--color-co-bg` | Page canvas — warm off-white, not pure white |
| Bg Alt | `#F2EFE8` | `--color-co-bg-alt` | Alternating section background (stats strip, sticky filter bar, form-side panels) |
| Surface | `#FFFFFF` | `--color-co-surface` | Product/collection cards, form panels |
| Ink | `#1F2328` | `--color-co-ink` | Primary text, primary button fill |
| Ink Soft | `#3A4048` | `--color-co-ink-soft` | Body copy on light surfaces (spec values, paragraphs) |
| Muted | `#565C64` | `--color-co-muted` | Secondary body copy |
| Muted 2 | `#6B7178` | `--color-co-muted-2` | Card descriptions, metadata |
| Faint | `#8C929A` | `--color-co-faint` | Eyebrow-adjacent labels, breadcrumb, placeholder captions |
| Border | `#DCD8CF` | `--color-co-border` | Section dividers, sticky bar border |
| Border Strong | `#C8C3B8` | `--color-co-border-strong` | Outline button borders |
| Card Border | `#E4E0D7` | `--color-co-card-border` | Product/collection card borders |
| Green | `#6FA82B` | `--color-co-green` | Primary accent — links, eyebrows, hover states, CTA band background |
| Green Dark | `#4E7D1F` | `--color-co-green-dark` | Link hover (on light bg) |
| Green Light | `#9CC763` | `--color-co-green-light` | Accent text on dark panels, focus ring |
| Green Pale | `#C9DFA4` | `--color-co-green-pale` | Hero eyebrow text over photography |
| Panel | `#1C241C` | `--color-co-panel` | Dark contrast sections (footer, "furnish by space", process steps) |
| Panel Border | `#2E382D` | `--color-co-panel-border` | 1px gaps between panel grid cells |
| Panel Fg | `#F0EEE7` | `--color-co-panel-fg` | Headings on dark panels |
| Panel Muted | `#A8B0A4` | `--color-co-panel-muted` | Body copy on dark panels |
| CTA Green Ink | `#12200A` | `--color-co-cta-green-ink` | Text/button-fill on top of the green CTA band |

## Tokens — Typography

### Bricolage Grotesque — display · `--font-display` / `--font-bricolage`
- **Weights used:** 500 (medium) throughout; 600 for the wordmark
- **Sizes:** 18–82px, mostly via `clamp()` for fluid hero/section headings
- **Tracking:** tight, roughly -0.02em to -0.035em at display sizes
- **Role:** every heading (h1/h2/h3), stat numbers, nav wordmark, price-band
  numerals. Never used for body copy or button labels.

### Figtree — body · `--font-body` / `--font-figtree`
- **Weights used:** 300 (light, most paragraph copy), 400, 500, 600 (button/label
  weight)
- **Sizes:** 13–20px, fluid via `clamp()` for lead paragraphs
- **Role:** paragraphs, form labels/inputs, nav links, button text, metadata.
  Body copy defaults to weight 300 — noticeably lighter than a typical UI
  grotesque — which is what gives the long-form paragraphs (About, product specs)
  their editorial rather than corporate feel.

### Type scale (representative, not exhaustive — most headings are fluid via `clamp()`)

| Role | Size | Weight | Tracking |
|---|---|---|---|
| Eyebrow / kicker | 11–11.5px | 600 | 0.18–0.2em, uppercase |
| Body | 15–19px | 300 | normal |
| Card title | 18–22px | 500 (display font) | -0.02em |
| Section heading | clamp(28px, 3.6vw, 46px) | 500 (display font) | -0.03em |
| Hero heading | clamp(38px, 6.2vw, 82px) | 500 (display font) | -0.035em |
| Stat numeral | clamp(30px, 3.2vw, 42px) | 500 (display font) | -0.03em |

## Tokens — Spacing & Shapes

**Base unit:** 4px (standard Tailwind scale — see CLAUDE.md conventions note on
which fractional values are actually valid)

### Border radius

Everything is **0** — cards, buttons, inputs, images, form panels. The single
exception is the site-wide WhatsApp button, which is a circle (`rounded-full`)
because that shape is the universal convention for the channel and breaking from
it would hurt recognizability, not brand consistency.

### Layout

- **Page max-width:** 1320px
- **Section padding:** fluid, `clamp(44px, 6vw, 108px)` vertical depending on
  section weight
- **Grid gap convention:** dense grids (services list, process steps, timeline)
  use `gap-px` with a border-colored background showing through as 1px
  dividers, rather than individual card borders — this is what gives the
  "engineered" flatness to those sections.

## Components

### Header
Sticky, `bg-co-bg` at 90% opacity + backdrop blur, bottom hairline border
(`co-border`). Logo is a small rotated "pill" dot in `co-green` + wordmark
("Co" in ink/semibold, "Human" in muted/medium). Desktop nav is plain text
links; mobile collapses to a two-line hamburger icon and a full-screen link
list in the display font.

### Primary button
`bg-co-ink text-co-bg`, hover swaps to `bg-co-green` + `text-co-cta-green-ink`.
No border, no shadow, sharp corners. This is the only button style that should
read as "the" primary action on a page (Request a Quote).

### Outline button
Transparent fill, `border-co-border-strong`, hover fills `bg-co-bg-alt` and
darkens the border to `co-ink`. Used for secondary actions (Enquire on a card,
Browse the catalog).

### Product / Collection card
White surface, `border-co-card-border`, hover darkens border to `co-ink` (no
shadow, no lift — this design has no elevation system). Image slot fills the
card top edge-to-edge with no radius. Category/collection eyebrow in
`co-faint`, title in the display font, price band + lead time as small
metadata text, Enquire button bottom-right.

### CTA band
Full-bleed section, either solid `co-green` (with `co-cta-green-ink` text and
button) or `co-panel` (dark, with `co-panel-fg`/`co-panel-muted` text). Heading
+ short body copy on the left, one primary button on the right — this is the
recurring "don't leave without converting" pattern that closes almost every
page.

### Dark panel section
`bg-co-panel`, used for "Furnish by space," "How a floor comes together,"
"What we hold ourselves to," and the footer. Internal grids use the `gap-px` +
`panel-border` background trick described above instead of individual card
borders.

### Quote dialog (global lead form)
A single Radix Dialog instance mounted once in the root layout
(`QuoteDialogProvider`), opened from anywhere via `useQuoteDialog().openQuote(subject)`.
Overlay is `co-panel` at 60% + blur; content panel is a plain white bordered
box, sharp corners, matching every other surface in the system.

## Do's and Don'ts

### Do
- Keep every corner sharp (radius 0) except the WhatsApp button.
- Use Bricolage Grotesque only for headings/numerals/nav wordmark; Figtree for
  everything else, defaulting to weight 300 for paragraph copy.
- Use `co-green` as the only accent color, and only for links, eyebrows, hover
  states, and CTA emphasis — never as a second "brand color" alongside ink.
- Build dense internal grids (services, timeline, process steps) with the
  `gap-px` + colored-background trick, not individual bordered cards.
- End every page in a CTA band or an explicit lead-capture form — no dead ends.

### Don't
- Don't add box-shadow anywhere; separation comes from hairline borders and
  whitespace only.
- Don't introduce a second accent color — red, blue, or any "sale" color has no
  place in this system.
- Don't round corners on cards, buttons, or images "for softness" — the sharp
  edge is a deliberate brand signal carried over from the original demo.
- Don't put e-commerce language (Add to Cart, Buy Now, Checkout) anywhere —
  every conversion verb is "Enquire," "Request a Quote," or "Book a visit."

## Imagery

No real photography exists yet. Every image slot renders through
`ImagePlaceholder` (`src/components/common/image-placeholder.tsx`) as a warm
radial-gradient card (white → `#F6F4EE` → `#E8E4DA`) with a small caption
describing what should be photographed there. When real photography arrives,
pass it as the `src` prop — direction should stay neutral/warm-wood, consistent
angles, daylight-lit interiors and studio-lit product shots, matching the
gradient's own warm-neutral palette so the transition from placeholder to real
photo doesn't jar.

## Quick Start — CSS custom properties

```css
@theme inline {
  --color-co-bg: #f7f5f0;
  --color-co-bg-alt: #f2efe8;
  --color-co-surface: #ffffff;
  --color-co-ink: #1f2328;
  --color-co-ink-soft: #3a4048;
  --color-co-muted: #565c64;
  --color-co-muted-2: #6b7178;
  --color-co-faint: #8c929a;
  --color-co-border: #dcd8cf;
  --color-co-border-strong: #c8c3b8;
  --color-co-card-border: #e4e0d7;
  --color-co-green: #6fa82b;
  --color-co-green-dark: #4e7d1f;
  --color-co-green-light: #9cc763;
  --color-co-green-pale: #c9dfa4;
  --color-co-panel: #1c241c;
  --color-co-panel-border: #2e382d;
  --color-co-panel-fg: #f0eee7;
  --color-co-panel-muted: #a8b0a4;
  --color-co-cta-green-ink: #12200a;

  --font-display: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif;
  --font-body: var(--font-figtree), system-ui, sans-serif;
}
```

The full, current token set lives in `src/app/globals.css` — treat that file as
authoritative if this document and the code ever disagree.
