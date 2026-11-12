"use client";

import type { MouseEvent } from "react";
import { Field } from "@/components/configurator/configurator-controls";
import { lengthNoun, sizeHint } from "@/components/configurator/labels";
import { Button } from "@/components/ui/button";
import { ProgressRail } from "@/components/ui/progress-rail";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import { TickNumber } from "@/components/ui/tick-number";
import {
  INFERRED_CODE_FOOTNOTE,
  depthFieldLabel,
  depthOptions,
  finishLabel,
  isInferredCode,
  lengthFieldLabel,
  selectedDepth,
  selectedLength,
  selectedParts,
} from "@/lib/series";
import { prefersReducedMotion } from "./series-config-flight";
import { useSeriesConfigurator } from "./series-context";
import { SeriesNameHeading } from "./series-name-hero";
import { SeriesConfigRail } from "./series-config-rail";
import { SeriesStage } from "./series-stage";

/** The first thing a keyboard user can act on inside a section. */
const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Scroll to an in-page section and record it in the URL, as the old panel did. A
 * keyboard activation (`detail === 0`) also moves focus into the section — otherwise
 * the page would move and focus would stay behind on a button now off screen.
 */
function goToSection(id: string, event: MouseEvent<HTMLButtonElement>) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth" });
  history.pushState(null, "", `#${id}`);
  if (event.detail === 0) target.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
}

/** A provisional part number: the ° for the eye, the word for a screen reader. */
function Provisional() {
  return (
    <>
      <span aria-hidden title={INFERRED_CODE_FOOTNOTE}>
        °
      </span>
      <span className="sr-only"> (provisional)</span>
    </>
  );
}

/**
 * B — the spec block. Officemate's solid colour block, turned to ink: mono spec rows,
 * the two size selectors, the progress rail and the bill of components on the right; the
 * viewer — poster plus WebGL stage, with its dimension lines — on the canvas to its left.
 * The configuration picker runs full width underneath.
 *
 * The progress rail is this view's one green thing. It counts what is set, not where
 * you are: a configuration is always selected, so one of three is set on arrival; length
 * and depth count once the visitor sets them, or immediately where there is nothing to
 * choose (one option, or a depth locked to the top's shape). The size fields share
 * `Field` and `sizeHint` with /configure, so a fixed size is explained in the same words
 * on both configurators.
 */
export function SeriesSpecBlock() {
  const { series, config, selection, setLength, setDepth, touched } =
    useSeriesConfigurator();

  const length = selectedLength(selection);
  const depth = selectedDepth(selection);
  const depths = depthOptions(selection);
  const finish = finishLabel(selection);
  const parts = selectedParts(selection);
  const inferred = isInferredCode(series, parts.code);
  const hasInferredBom = parts.bom.some((line) => isInferredCode(series, line.code));

  const lengthDone = touched.length || config.lens.length === 1;
  const depthDone = touched.depth || depths.locked || depths.values.length === 1;
  const set = 1 + (lengthDone ? 1 : 0) + (depthDone ? 1 : 0);
  const nextStep = !lengthDone
    ? `next: ${lengthNoun(config)}`
    : !depthDone
      ? "next: depth"
      : "ready to quote";

  const rows: SpecRow[] = [
    // Model and code rows cut (Nov 2026): the heading names the model, and the part
    // code still travels in the bill of components and the enquiry.
    {
      k: config.dia ? "Diameter" : "Length",
      v: (
        <>
          {config.dia ? "Ø" : ""}
          <TickNumber value={length} />{"\u00A0"}mm
        </>
      ),
    },
    {
      k: "Depth",
      v:
        depth === null ? (
          "—"
        ) : (
          <>
            <TickNumber value={depth} />{"\u00A0"}mm
          </>
        ),
    },
    { k: "Height", v: `${series.workingHeightMm} mm` },
    { k: "Seats", v: config.seats },
    ...(series.finishFilters ? [{ k: "Finish", v: finish ?? "—" }] : []),
  ];

  return (
    <section id="specification" className="scroll-mt-[72px] border-b border-co-ink">
      {/* The name heading and the viewer under it on the left, the ink spec panel on the
          right, rising level with the heading (client request, "suggestion 1") so the name,
          the render and the spec share the first screen. The panel bleeds through the
          shell's right gutter and is one solid rectangle from the heading's top line down —
          the stepped top was dropped in the Nov 2026 review. On phones it stacks: heading,
          viewer, panel. */}
      <div className="co-shell grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
        <div className="min-w-0 pb-[clamp(32px,4vw,64px)] pt-[clamp(40px,5vw,72px)] lg:pr-[clamp(24px,3.5vw,56px)]">
          <SeriesNameHeading />
          <div className="mt-[clamp(32px,4vw,56px)] lg:sticky lg:top-[104px]">
            <SeriesStage />
          </div>
        </div>

        <div className="relative -mx-[18px] bg-co-panel px-[18px] py-[clamp(40px,5vw,70px)] text-co-panel-fg sm:-mx-6 sm:px-6 lg:mx-0 lg:-mr-12 lg:mt-[clamp(40px,5vw,72px)] lg:pl-10 lg:pr-12">
          <p className="co-eyebrow mb-5 text-co-panel-faint">01 / Specification</p>
          <SpecRows rows={rows} tone="dark" />

          {/* The controls and the rail they fill are one group: tight inside, air around. */}
          <div className="mt-8 grid gap-6">
            <Field
              tone="dark"
              label={lengthFieldLabel(config)}
              hint={sizeHint({ axis: "length", config, count: config.lens.length })}
              hintId="spec-length-hint"
            >
              <SegmentedControl
                label={lengthFieldLabel(config)}
                describedBy="spec-length-hint"
                tone="dark"
                value={length}
                options={config.lens.map((value) => ({ value, label: value }))}
                onChange={(value) => setLength(config.lens.indexOf(value))}
              />
            </Field>
            <Field
              tone="dark"
              label={depthFieldLabel(config)}
              hint={sizeHint({
                axis: "depth",
                config,
                count: depths.values.length,
                locked: depths.locked,
              })}
              hintId="spec-depth-hint"
            >
              <SegmentedControl
                label={depthFieldLabel(config)}
                describedBy="spec-depth-hint"
                tone="dark"
                locked={depths.locked}
                value={depth ?? depths.values[0]}
                options={depths.values.map((value) => ({ value, label: value }))}
                onChange={(value) => setDepth(depths.values.indexOf(value))}
              />
            </Field>
          </div>

          <ProgressRail
            tone="dark"
            step={set}
            total={3}
            label={`${set} of 3 set — ${nextStep}`}
            className="mt-6"
          />

          {/* A drawing set's parts list: a header row, then one hairline per component. */}
          <table className="co-data mt-10 w-full border-collapse">
            <caption className="co-eyebrow mb-3 text-left text-co-panel-faint">Bill of components</caption>
            <thead>
              <tr className="border-y border-co-panel-border text-co-panel-faint">
                <th scope="col" className="py-2 pr-3 text-left font-normal">
                  Component
                </th>
                <th scope="col" className="py-2 pr-3 text-left font-normal">
                  Code
                </th>
                <th scope="col" className="w-[52px] py-2 text-right font-normal">
                  Qty
                </th>
              </tr>
            </thead>
            <tbody>
              {parts.bom.map((line) => (
                <tr key={line.code} className="border-b border-co-panel-border align-baseline">
                  <td className="py-2.5 pr-3 normal-case text-co-panel-fg">{line.name}</td>
                  <td className="whitespace-nowrap py-2.5 pr-3 text-co-panel-muted">
                    {line.code}
                    {isInferredCode(series, line.code) ? <Provisional /> : null}
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right text-co-panel-fg">{line.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {parts.bomNote ? (
            <p className="mt-3 text-[13px] leading-relaxed text-co-panel-muted">{parts.bomNote}</p>
          ) : null}
          {inferred || hasInferredBom ? (
            <p className="mt-3 text-[13px] leading-relaxed text-co-panel-faint">{INFERRED_CODE_FOOTNOTE}</p>
          ) : null}

          <div className="mt-10 flex flex-wrap gap-3">
            <Button type="button" variant="onDark" onClick={(event) => goToSection("enquire", event)}>
              Get a quote
            </Button>
            <Button
              type="button"
              variant="secondaryOnDark"
              onClick={(event) => goToSection("anatomy", event)}
            >
              Anatomy <span aria-hidden>↓</span>
            </Button>
          </div>
          <p className="mt-5 max-w-[40ch] text-[13px] leading-relaxed text-co-panel-faint">
            Price on request. Quantity, finish and installation move the number, so we quote
            rather than list.
          </p>
        </div>

      </div>

      <div id="configurations" className="co-shell scroll-mt-[72px] border-t border-co-border py-[clamp(28px,3vw,44px)]">
        <SeriesConfigRail />
      </div>
    </section>
  );
}
