# Interface system — Cohuman configurators

Product UI on this site is two configurators: `/configure` (`src/components/configurator/**`)
and the collection-page spec block + picker (`src/components/series/series-spec-block.tsx`,
`series-config-rail.tsx`, `series-config-flight.tsx`). Everything else is marketing — not
this skill's scope.

**The visual language is fixed: Signal.** Read `design.md` (authoritative) and use the
project skill `signal-design`. Do not introduce tokens, colours, radii, shadows or fonts.

## Patterns already established here — reuse them

- **Field** (`configurator-controls.tsx`): mono label → control → helper line. Pass
  `hintId` and give the control `describedBy` the same id.
- **Size choice** = `SegmentedControl` (44px cells). A fixed value (round top's height,
  square top's depth) is `locked`: dashed, unfilled, explained by helper text from
  `sizeHint` in `labels.ts`.
- **Finish choice** = `FinishChip` with its code; `dot={false}` because the progress rail
  is the configurator's one green thing.
- **Option tiles**: ink fill + `aria-pressed` when selected; borders overlap by 1px.
- **Progress**: `ProgressRail` with a caption that states what is set and what is next
  ("2 of 3 set — next: length").
- **Steps** (`/configure`): each opens with a question; "Next" names its target ("Next:
  Top & finish"); Next/Back move focus to the new step and scroll it under the header
  (instant under reduced motion). The step strip does not steal focus.
- **Bill of components**: a real table (Component / Code / Qty); provisional codes carry
  `°` plus visually hidden "(provisional)" and the footnote.
- **Seat wording** comes from `seatLabel` in `labels.ts` — never print "— seats".

## Non-negotiables

- Targets ≥ 44px on touch; focus ring never hidden (focused cell `z-20`).
- Data, options, estimate/summary logic, the enquiry payload, analytics and
  `series-context.tsx` are not presentation — do not change them from here.
- Check every state (hover, focus-visible, selected, locked, empty, error) at 1440 and 390.

## Open, not yet done

- On phones the drawing (`/configure`) and the viewer (collection page) are out of view
  while choosing. Candidate: a compact sticky mini-plan, or the viewer above the spec
  block on phones — a layout decision for the client.
- `depthFieldLabel` labels a round top's locked value "Working height" in the depth
  slot; "Height — fixed" would read better (`src/lib/series/derive.ts`).
