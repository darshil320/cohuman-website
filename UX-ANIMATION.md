# UX and animation pass: Cohuman site

Branch `ux/animation-pass`, nine commits on top of `main` (`30defe4`). Nothing pushed or
deployed.

## Skill

- `charles-ux-animation`, from `LemonFace0309/charles-skills` (`skills/charles-ux-animation`)
- Installed globally on 2026-11-13 via `npx skills add … -g -a claude-code`, to
  `~/.claude/skills/charles-ux-animation`
- Skill folder hash: `8fce7087b6095d9343fac26cf8cfd9d1a0958de5`
- Contents: Markdown only (`SKILL.md`, `README.md`, `references/recipes.md`,
  `references/techniques.md`); no executables

**How it was reconciled with Signal.** The project's design system is locked, and
`design.md` bans opacity fades. Wherever a skill recipe fades (modal, toast, async button,
icon swap), this pass keeps the skill's **durations and curves** and replaces the fade with
Signal's motion: a clip-path wipe, a roll or a turn. The 400ms linear "plotter" timings for
reveals and rules are untouched.

## Stack

| | |
|---|---|
| Framework | Next.js 16.2.12, App Router, React 19.2; every page static or SSG, `/api/*` on the server |
| Styling | Tailwind CSS v4, tokens in `@theme inline` in `src/app/globals.css`, no config file |
| Primitives | hand-rolled shadcn-style components (cva + `cn`); Radix Dialog, Label, Slot |
| Motion before | CSS keyframe reveals (`co-reveal`, `co-clip`, `co-rule`, `co-kinetic-word`) driven by one IntersectionObserver and gated on `html.co-js`; framer-motion 12 (full `motion`, not LazyMotion) in the root layout, header, Collections panel, sticky bar, lightbox and series pages; three.js / R3F viewer |
| Motion after | the same, minus framer at the root: header overlays are CSS transitions, so framer loads only on the series pages and the lightbox |
| Tooling | npm; `npx tsc --noEmit`, `npm run lint`, `npm test` (vitest, 80 tests), `npm run build` (prebuild `check:links`) |

## Interaction inventory

| Interaction | Trigger | How often (one person) | Must tell them |
|---|---|---|---|
| Quote dialog | pointer, touch, keyboard | 1–3 per session | a form opened over this page, about X; on close, back where they were |
| Collections panel (desktop) | pointer, keyboard | a few | the menu came from the bar; which group is active |
| Mobile menu | touch | a few | it opened or closed, from the bar |
| Mobile Collections expander | touch | 0–2 | the list opened in place |
| Lead form submit (enquiry, B2B, showroom, series) | pointer, Enter | once | it registered; still sending; sent and what's next, or failed and why |
| Contact tabs | pointer, keyboard | 0–2 | which form is showing; nothing typed is lost |
| Size selectors, finish chips, configurator steps | pointer, keyboard | many | selected, and progress |
| Picking a configuration in the filmstrip | pointer | several | which one, and where it went (the viewer) |
| Configuration gallery bars | pointer, touch | several | which configuration is shown |
| Sticky quote bar | scroll | automatic | the quote action is here |
| Project rail, piece gallery, lightbox | pointer, swipe, keyboard | several | which photo, how many |
| ORGATEC popup | timer, 9s after load (1.5s before 14 Nov) | once per session | event, booth, dates |
| Scroll reveals | scroll | passive, many | nothing; the Signal "plotter" signature |
| Press and hover on controls | all | many | the press registered |

## Findings

Severity: **broken**, **friction** or **polish**. Status: **applied**, **proposed** (needs
your decision) or **skipped** (with the reason). Sorted by severity, then by the skill's
five questions.

| # | Severity | Principle | Where | Before | After | Effort | Status |
|---|---|---|---|---|---|---|---|
| 1 | broken | Errors: recover | `forms/contact-form-tabs.tsx` | Switching the /contact tab unmounted the form, so typed input was lost | Both panels mounted; the inactive one is `hidden` | S | applied `5127358` |
| 2 | broken | No JS dependence (found in Verify) | `ui/reveal-observer.tsx` | Chrome clips an IO target by its own `clip-path`. A hidden reveal is a zero-size line at its leading edge (the top on phones), so a jump past it (anchor, fling, `scrollIntoView`) never fired, leaving content hidden for good. At 375px the /contact submit couldn't be clicked | `rootMargin` top of 100000px: anything scrolled past counts as seen | S | applied `a9eadde` |
| 3 | broken | Jakob (Esc), focus | `layout/site-header.tsx`, `layout/collections-panel.tsx` | Mobile menu ignored Esc; neither overlay moved, trapped or returned focus | `useOverlayFocus`: focus moves in, Tab cycles trigger + panel, Esc closes, focus returns to the trigger | M | applied `1d29892` |
| 4 | broken | Focus restore (found in Verify) | `providers/quote-dialog-provider.tsx` | The dialog opens from code, so focus fell to `<body>` on close | Focus returns to the control that opened it | S | applied `b019867` |
| 5 | friction | Doherty threshold | `orgatec-popup.tsx:15,63` | A modal interrupts every first visit 1.5s after load, and is the LCP element on `/` and `/contact` | Retire it after 21 Nov (the show ends), or make it a non-modal strip, or open it on first scroll or interaction | S | **partly applied** 14 Nov: opens after 9s (client: 8–10s) and waits while a dialog is open or a field has focus |
| 6 | friction | Nothing enters at first paint | `ui/kinetic-heading.tsx` (H1 in `film-intro`, `PageHero`, /about, /contact, sectors) | H1 words are masked at `translateY(110%)` on first paint and rise in | Above the fold, ship the H1 at its final state; keep the rise for below-fold headings | S | **proposed** (removes a Signal motion named in `design.md`) |
| 7 | friction | Doherty, async button | `enquiry-form`, `b2b-form`, `showroom-visit-form`, `series-enquire` | "Sending…" swapped in on the same frame (flashing on fast replies); not announced; double Enter could resubmit | Disabled at once with no dimming; "Sending…" only after 300ms, held ≥500ms, rolling in within one grid cell; `aria-live`; in-flight guard (triple Enter sends once) | M | applied `5127358` |
| 8 | friction | Slow in and slow out, exits | `site-header.tsx`, `collections-panel.tsx`, `series-sticky-bar.tsx` | 300ms ease-in-out both ways | Drawer recipe: 280ms `--ease-enter` in, 200ms `--ease-exit` out | S | applied `1d29892`, `0a89d5e` |
| 9 | friction | Origin, exits | `quote-dialog-provider.tsx`, `orgatec-popup.tsx` | Appeared and vanished on one frame | Panel wipes down from 0.97 scale, 220ms in / 160ms out; veil instant and held until the panel leaves | S | applied `b019867` |
| 10 | friction | Reduced motion | `series-sticky-bar.tsx`, `series-pager.tsx`, `series-config-gallery.tsx` | Smooth scroll ignored the OS setting | `scrollToId()` jumps under reduced motion | S | applied `0a89d5e` |
| 11 | friction | Properties | `ui/progress-rail.tsx` | Animated `width` | `scaleX` from the left edge, same 400ms linear | S | applied `0a89d5e` |
| 12 | friction | Performance (Motion entry point) | `app/layout.tsx`, `site-header.tsx`, `collections-panel.tsx` | Full framer-motion on every page for two clip wipes | Header overlays on CSS (`co-drop`), mounted on first open, `inert` while closed; root `MotionConfig` removed, lightbox has its own. −43 KiB JS on `/` and `/contact` | M | applied `1d29892` |
| 13 | friction | Properties | `common/mobile-peek.tsx:95` | Animates `height` over 500ms | Grid-rows expander: the first N rows always shown, the rest in a `co-expander` (needs a child split, an API change) | M | **proposed** |
| 14 | friction | Properties | `series/series-config-rail.tsx:232,241` | Card `width` and `height` over 450ms (specified in `design.md`) | FLIP with transforms | L | **proposed** (client-specified motion; refactor) |
| 15 | friction | Hit area, Fitts | menu toggle, dialog close, lightbox `RoundButton` (40px); header quote button (42px); mobile panel links (~18px); gallery bars (20×19); logo link (19px tall) | Under 44px | `co-hit` 44px invisible zone; links `min-h-11`; gallery bars 28×44 with the same visual spacing | S | applied `1d29892`, `b019867`, `efa0e81` |
| 16 | friction | Jakob (tabs keyboard) | `contact-form-tabs.tsx` | No arrow keys | Roving tabindex; ←/→/Home/End select | S | applied `5127358` |
| 17 | friction | Parkinson's law | the four lead forms | No `autocomplete` | name, organization, email, tel, address-level2 | S | applied `5127358` |
| 18 | polish | Anticipation (press) | `ui/button.tsx` | No press feedback | `:active` scale 0.96 over 150ms on the enter curve; text links and `still` (full-width) buttons excluded | S | applied `5b360f8` |
| 19 | polish | Replacements | `site-header.tsx` burger | Bars jumped to `position:absolute` mid-turn | `translateY(±3.5px)` + rotate, transform only | S | applied `1d29892` |
| 20 | polish | Expanders | `collections-panel.tsx` (mobile Collections) | Mounted instantly | `co-expander` grid rows 250 / 190ms, `inert` while closed; the +/− turns | S | applied `1d29892` |
| 21 | polish | Hit area | `series/series-anatomy.tsx:183` | 24–28px numbered hotspots on a drawing | Grow to 44 only after checking each layout for overlap | S | **proposed** |
| 22 | polish | Errors beside the field | `forms/form-status.tsx` | A server-side error shows under the whole form | Per-field errors, `aria-invalid` and focus on the field (the API returns one string today) | M | **proposed** (API contract) |
| 23 | polish | Fitts | footer and contact email/phone links, breadcrumbs, text links | 18–25px tall (meets the WCAG 2.2 24px floor except the 18px mail links) | `min-h-11` rows, which changes vertical rhythm | S | **proposed** (layout spacing) |
| 24 | polish | Expanders | `common/faq-section.tsx` | `<details>` opens instantly | — | — | skipped: native `<details>` keeps working with no JS, and animating it means animating height |
| 25 | polish | Properties | `projects/project-rail.tsx:100` | Segment height 1px → 3px over 200ms | — | — | skipped: inside a fixed 44px box, so no layout shift, and `scaleY` would blur a hairline |
| 26 | polish | Timing (hover) | `site-header.tsx:141` nav underline | 400ms linear draw on hover (the skill says 100–150ms) | — | — | skipped: Signal's locked "lines draw at plotter speed" |
| 27 | polish | Frequency (keyboard) | `ui/segmented-control.tsx` | Selection colour transitions 150ms when changed by arrow keys | — | — | skipped: 150ms on a fill reads as press feedback and never lags the keys in testing |
| 28 | — | Scroll listeners | `hero-carousel.tsx:130`, `series-pdp.tsx:52` | `scroll` listeners | — | — | skipped: state toggles deduped by the store or React, not reveal triggers |
| 29 | — | Theme switch | — | — | — | — | not applicable: one theme |

**Bugs no principle covers, fixed along the way:**

- `EnquiryForm` used fixed ids (`name`, `email`…). On /contact it renders twice (the tab
  and the quote dialog), so labels pointed at the wrong field. It now uses `useId` (`5127358`).
- The four forms each had their own fetch/try/catch; they now share `sendLead()`
  (`src/lib/leads/client.ts`), which never throws.

## Tokens added

In `:root` in `src/app/globals.css`, mirrored in `src/lib/motion.ts`. The names stay clear
of Tailwind's `--ease-*`, so stock utilities keep their meaning.

| Token | Value | Use |
|---|---|---|
| `--ease-enter` | `cubic-bezier(0.32, 0.72, 0, 1)` | appearing, responding to input |
| `--ease-exit` | `cubic-bezier(0.55, 0, 1, 0.45)` | leaving |
| `--ease-move` | `cubic-bezier(0.77, 0, 0.175, 1)` | resizing or moving in place |
| `--duration-press` | 150ms | press, label roll |
| `--duration-modal-in` / `-out` | 220 / 160ms | dialogs |
| `--duration-drawer-in` / `-out` | 280 / 200ms | header panels, mobile menu, sticky bar, burger |
| `--duration-expand-in` / `-out` | 250 / 190ms | expanders, +/− |
| `PENDING_DELAY_MS` / `PENDING_MIN_MS` (JS) | 300 / 500ms | submit pending state |

**New primitives** (all in `globals.css`):

- `co-hit`: a 44px hit area
- `co-modal` and `co-veil`: Radix dialogs
- `co-drop`: the panels that drop from the header
- `co-expander`: in-place expanders
- a global `prefers-reduced-motion` layer, with `[data-motion-keep]` as the exemption

**New hooks and helpers:**

- `usePendingSubmit`
- `useOverlayFocus`
- `scrollToId` and `prefersReducedMotion`
- `sendLead`

`design.md` gained an "Interaction motion" table describing all of the above.

## Verify

Run against `next start` on the branch build, in Playwright (Chromium):

| Check | Result |
|---|---|
| Scrub at 10% (CDP `Animation.setPlaybackRate 0.1`) | Quote dialog: clip 100% → 44% → 10% → 3% → 0.9% → 0%, scale 0.97 → 1; responds on the first frame and settles with no pop |
| Interrupt halfway | Mobile menu closed mid-open turns around from where it is (`co-drop` is a transition) |
| Hammer the keyboard | Contact tabs ←/→ move and select on the same frame; Tab is trapped in the menu (trigger + panel only); Esc closes; triple Enter on a form sends **one** request |
| Throttle to ≥1s | 1.2s API: the button is disabled at 0ms with no dimming, "Sending…" is visible and announced at 450ms; a fast reply never shows it |
| Tap target edges at 375px | Applied targets are 44×44 (button box or `::after`); remaining small ones are listed as #21 and #23 |
| Paste messy input, force failures | Padded name, upper-case email with spaces, `+91 (98241) 23-456` all accepted; offline (aborted request) keeps every field and shows "Not sent — Something went wrong…"; a server-side failure shows its message |
| Finish every flow | B2B success shows "Bulk enquiry received" with what happens next (API stubbed; no real lead sent) |
| Reduced motion | Mobile menu and dialog open and close at once; headline words don't move; button transitions 0.01ms; end states identical |
| Theme switch | not applicable (one theme) |
| Animated properties | All new motion is transform, `scale`, `clip-path` or `grid-template-rows` (the skill's expander exception); the remaining `width`/`height` animations are #13 and #14 (proposed) and #25 (skipped) |
| Tenth use | Dialog 220ms, panels 280ms, press 150ms all feel immediate at full speed; nothing was cut |
| 375 / 1440 overflow | No horizontal overflow on `/`, `/contact`, `/collections/pros`, `/configure`, `/about`, `/products/arq`, `/projects`, `/b2b` |
| Hover on tap | Tailwind v4 `hover:` and `group-hover:` are behind `@media (hover: hover)`; no new hover motion |
| typecheck / lint / tests / build | all pass, before and after every commit (80/80 tests) |

**Not run, and what each would have caught:**

- **Safari and Firefox.** `@starting-style` (the first-open wipe of `co-drop`) needs Safari
  17.5+ / Firefox 129+. Older engines open the panel without the wipe, still correctly.
- **Real devices / VoiceOver.** Would catch live-region timing ("Sending") and focus
  return on iOS, which uses different focus heuristics.
- **A real lead submission.** Resend isn't configured locally, so the API was stubbed
  for success. A real send would catch production-only response shapes.

## Before / after (Lighthouse mobile, median of 3, paired runs)

| Route | Score | LCP | CLS | TBT | JS |
|---|---|---|---|---|---|
| `/` | 81 → 82 | 5.10 → 4.89 s | 0 → 0 | 4 → 3 ms | 260 → **217 KiB** |
| `/collections/pros` | 89 → 90 | 3.74 → 3.69 s | 0 → 0 | 90 → 83 ms | 504 → 500 KiB |
| `/contact` | 89 → 90 | 3.74 → 3.59 s | 0 → 0 | 0 → 0 ms | 245 → **202 KiB** |

No regressions and nothing reverted. Full method, per-run values and the
`/collections/pros` bisect are in `PERFORMANCE.md`. Every route still misses the 2.5s LCP
budget. On `/` and `/contact` that's the ORGATEC popup (#5).
