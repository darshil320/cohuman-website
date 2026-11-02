"use client";

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
} from "@/lib/series";
import { useSeriesConfigurator } from "./series-context";
import { SeriesConfigRail } from "./series-config-rail";
import { SeriesStage } from "./series-stage";

/** Smooth-scroll to an in-page section and record it in the URL, as the old panel did. */
function scrollToSection(id: string) {
  document.querySelector(`#${id}`)?.scrollIntoView({ behavior: "smooth" });
  history.pushState(null, "", `#${id}`);
}

/**
 * B — the spec block. Officemate's solid colour block, turned to ink: mono spec rows,
 * the two size selectors, the progress rail and the bill of components on the left; the
 * viewer — poster plus WebGL stage, with its dimension lines — on the canvas beside it.
 * The configuration picker runs full width underneath.
 *
 * The progress rail is this view's one green thing. A configuration is always selected,
 * so step 1 is complete on arrival; length and depth count once the visitor sets them,
 * or immediately where there is nothing to choose (one option, or a depth locked to the
 * top's shape).
 */
export function SeriesSpecBlock() {
  const { series, config, selection, setLength, setDepth, touched } =
    useSeriesConfigurator();

  const length = selectedLength(selection);
  const depth = selectedDepth(selection);
  const depths = depthOptions(selection);
  const finish = finishLabel(selection);
  const inferred = isInferredCode(series, config.code);
  const hasInferredBom = config.bom.some((line) => isInferredCode(series, line.code));

  const lengthDone = touched.length || config.lens.length === 1;
  const depthDone = touched.depth || depths.locked || depths.values.length === 1;
  const step = 1 + (lengthDone ? 1 : 0) + (depthDone ? 1 : 0);
  const nextStep = !lengthDone ? "choose a length" : !depthDone ? "choose a depth" : "ready to quote";

  const rows: SpecRow[] = [
    { k: "Model", v: config.name },
    {
      k: series.codeLabel ?? "Code",
      v: (
        <>
          {config.code}
          {inferred ? <span title={INFERRED_CODE_FOOTNOTE}>°</span> : null}
        </>
      ),
    },
    {
      k: config.dia ? "Diameter" : "Length",
      v: (
        <>
          {config.dia ? "Ø" : ""}
          <TickNumber value={length} /> mm
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
            <TickNumber value={depth} /> mm
          </>
        ),
    },
    { k: "Height", v: `${series.workingHeightMm} mm` },
    { k: "Seats", v: config.seats },
    { k: "Beam", v: config.beam },
    ...(series.finishFilters ? [{ k: "Finish", v: finish ?? "—" }] : []),
  ];

  return (
    <section id="specification" className="scroll-mt-[72px] border-b border-co-ink">
      <div className="co-shell grid grid-cols-1 lg:grid-cols-[minmax(360px,440px)_minmax(0,1fr)]">
        <div className="-mx-[18px] bg-co-panel px-[18px] py-[clamp(40px,5vw,70px)] text-co-panel-fg sm:-mx-6 sm:px-6 lg:mx-0 lg:-ml-12 lg:pl-12 lg:pr-10">
          <p className="co-eyebrow mb-5 text-co-panel-faint">01 / Specification</p>
          <SpecRows rows={rows} tone="dark" />

          <div className="mt-8 grid gap-6">
            <div>
              <p className="co-eyebrow mb-2.5 text-co-panel-faint">{lengthFieldLabel(config)}</p>
              <SegmentedControl
                label={lengthFieldLabel(config)}
                tone="dark"
                value={length}
                options={config.lens.map((value) => ({ value, label: value }))}
                onChange={(value) => setLength(config.lens.indexOf(value))}
              />
            </div>
            <div>
              <p className="co-eyebrow mb-2.5 text-co-panel-faint">{depthFieldLabel(config)}</p>
              <SegmentedControl
                label={depthFieldLabel(config)}
                tone="dark"
                locked={depths.locked}
                value={depth ?? depths.values[0]}
                options={depths.values.map((value) => ({ value, label: value }))}
                onChange={(value) => setDepth(depths.values.indexOf(value))}
              />
            </div>
          </div>

          <ProgressRail
            tone="dark"
            step={step}
            total={3}
            label={`Step ${step} of 3 — ${nextStep}`}
            className="mt-8"
          />

          <div className="mt-9">
            <p className="co-eyebrow mb-3 text-co-panel-faint">Bill of components</p>
            <ul className="co-data grid list-none border-t border-co-panel-border p-0">
              {config.bom.map((line) => (
                <li
                  key={line.code}
                  className="grid grid-cols-[minmax(0,1fr)_auto_44px] items-baseline gap-x-3 border-b border-co-panel-border py-2.5"
                >
                  <span className="min-w-0 normal-case text-co-panel-fg">{line.name}</span>
                  <span className="text-co-panel-muted">
                    {line.code}
                    {isInferredCode(series, line.code) ? <span title={INFERRED_CODE_FOOTNOTE}>°</span> : null}
                  </span>
                  <span className="text-right text-co-panel-fg">{line.qty}</span>
                </li>
              ))}
            </ul>
            {config.bomNote ? (
              <p className="mt-3 text-[13px] leading-relaxed text-co-panel-muted">{config.bomNote}</p>
            ) : null}
            {inferred || hasInferredBom ? (
              <p className="mt-3 text-[12.5px] leading-relaxed text-co-panel-faint">{INFERRED_CODE_FOOTNOTE}</p>
            ) : null}
          </div>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button type="button" variant="onDark" onClick={() => scrollToSection("enquire")}>
              Get a quote
            </Button>
            <Button type="button" variant="secondaryOnDark" onClick={() => scrollToSection("anatomy")}>
              Anatomy ↓
            </Button>
          </div>
          <p className="mt-5 max-w-[40ch] text-[12.5px] leading-relaxed text-co-panel-faint">
            Price on request. Quantity, finish and installation move the number, so we quote
            rather than list.
          </p>
        </div>

        <div className="min-w-0 py-[clamp(32px,4vw,64px)] lg:pl-[clamp(24px,3.5vw,56px)]">
          <div className="lg:sticky lg:top-[104px]">
            <SeriesStage />
          </div>
        </div>
      </div>

      <div id="configurations" className="co-shell scroll-mt-[72px] border-t border-co-border py-[clamp(28px,3vw,44px)]">
        <SeriesConfigRail />
      </div>
    </section>
  );
}
