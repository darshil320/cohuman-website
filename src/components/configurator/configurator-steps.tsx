import type { Dispatch, SetStateAction } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ALL_OPTIONS, type ResolvedSpecification, type Specification } from "@/lib/configurator";
import {
  clampIndex,
  configSizeRange,
  depthFieldLabel,
  depthOptions,
  lengthFieldLabel,
} from "@/lib/series";
import { EmptyNote, Field, FinishGroup, OptionTiles, StepHeading } from "./configurator-controls";
import { seatLabel, sizeHint } from "./labels";

/**
 * The five step bodies. Each reads the one specification and writes it through the
 * configurator's own setter, so the option logic is exactly the configurator's — these
 * only decide how a choice is drawn.
 *
 * Every step opens the same way — a question in extended caps and a plain note — even
 * when the series has nothing to offer in it, so the panel never changes shape between
 * steps and an empty step reads as an answer rather than a gap.
 */

export type StepKey = "series" | "config" | "top" | "legs" | "extras";

interface StepProps {
  spec: Specification;
  resolved: ResolvedSpecification;
  setSpec: Dispatch<SetStateAction<Specification>>;
}

function SeriesStep({ spec, onPick }: { spec: Specification; onPick: (slug: string) => void }) {
  return (
    <>
      <StepHeading heading="Which system?" note="Both run at 720mm working height." />
      <OptionTiles
        items={ALL_OPTIONS.map((entry) => ({
          id: entry.series.slug,
          name: entry.series.name,
          note: entry.series.promise,
          on: entry.series.slug === spec.seriesSlug,
          onPick: () => onPick(entry.series.slug),
        }))}
      />
    </>
  );
}

function ConfigurationStep({ spec, resolved, setSpec }: StepProps) {
  const { options, top } = resolved;
  const config = options.series.configs.find((entry) => entry.slug === top.slug);
  // The same derivation the spec block uses: round and square tops lock their depth.
  const depths = config
    ? depthOptions({ series: options.series, config, lenIndex: spec.lenIndex, depIndex: spec.depIndex })
    : null;

  return (
    <>
      <StepHeading
        heading="Which configuration?"
        note={`${options.tops.length} configurations in this series. Pick one, then its size.`}
      />
      <OptionTiles
        dense
        items={options.tops.map((entry) => {
          const source = options.series.configs.find((c) => c.slug === entry.slug);
          const range = source ? `${configSizeRange(source)} mm` : null;
          return {
            id: entry.slug,
            name: entry.name,
            meta: [range, seatLabel(entry.seats)].filter((line): line is string => Boolean(line)),
            on: entry.slug === spec.topSlug,
            onPick: () => setSpec((s) => ({ ...s, topSlug: entry.slug, lenIndex: 0, depIndex: 0 })),
          };
        })}
      />

      {config ? (
        <div className="mt-10 grid gap-8">
          <Field
            label={lengthFieldLabel(config)}
            hint={sizeHint({ axis: "length", config, count: top.lens.length })}
            hintId="cfg-length-hint"
          >
            <SegmentedControl
              label={lengthFieldLabel(config)}
              describedBy="cfg-length-hint"
              value={clampIndex(spec.lenIndex, top.lens.length)}
              options={top.lens.map((mm, index) => ({ value: index, label: mm }))}
              onChange={(index) => setSpec((s) => ({ ...s, lenIndex: index }))}
            />
          </Field>

          {depths && depths.values.length > 0 ? (
            <Field
              label={depthFieldLabel(config)}
              hint={sizeHint({ axis: "depth", config, count: depths.values.length, locked: depths.locked })}
              hintId="cfg-depth-hint"
            >
              <SegmentedControl
                label={depthFieldLabel(config)}
                describedBy="cfg-depth-hint"
                locked={depths.locked}
                value={depths.locked ? 0 : clampIndex(spec.depIndex, depths.values.length)}
                options={depths.values.map((mm, index) => ({ value: index, label: mm }))}
                onChange={(index) => {
                  if (!depths.locked) setSpec((s) => ({ ...s, depIndex: index }));
                }}
              />
            </Field>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

function FinishStep({ spec, resolved, setSpec }: StepProps) {
  const topFinishes = resolved.options.finishes.filter((f) => f.applies === "top");
  const frameFinishes = resolved.options.finishes.filter((f) => f.applies === "frame");

  if (!topFinishes.length && !frameFinishes.length) {
    return (
      <>
        <StepHeading heading="Which finishes?" />
        <EmptyNote>
          This series’ specification names materials rather than finish colours, so there
          is nothing to choose here — we confirm the finish on the quote.
        </EmptyNote>
      </>
    );
  }

  return (
    <>
      <StepHeading
        heading="Which finishes?"
        note="The top and the frame are specified separately. Both are keyed under the plan."
      />
      <div className="grid gap-8">
        {topFinishes.length ? (
          <FinishGroup
            label="Top finish"
            items={topFinishes}
            activeCode={spec.topFinishCode}
            onPick={(code) => setSpec((s) => ({ ...s, topFinishCode: code }))}
          />
        ) : null}
        {frameFinishes.length ? (
          <FinishGroup
            label="Frame finish"
            items={frameFinishes}
            activeCode={spec.frameFinishCode}
            onPick={(code) => setSpec((s) => ({ ...s, frameFinishCode: code }))}
          />
        ) : null}
      </div>
    </>
  );
}

function LegStep({ spec, resolved, setSpec }: StepProps) {
  return (
    <>
      <StepHeading
        heading="Which leg package?"
        note="Beams follow the top you picked, so they are not a separate choice."
      />
      <OptionTiles
        items={resolved.options.legs.map((entry) => ({
          id: entry.code,
          name: entry.name,
          note: entry.note,
          meta: entry.code,
          on: entry.code === spec.legCode,
          onPick: () => setSpec((s) => ({ ...s, legCode: entry.code })),
        }))}
      />
    </>
  );
}

function ExtrasStep({ spec, resolved, setSpec }: StepProps) {
  const { accessories } = resolved.options;

  if (!accessories.length) {
    return (
      <>
        <StepHeading heading="Anything to add?" />
        <EmptyNote>
          This series publishes no accessory schedule — tell us what you need on the enquiry
          and we will quote it against the run.
        </EmptyNote>
      </>
    );
  }

  return (
    <>
      <StepHeading heading="Anything to add?" note="Optional — select as many as apply, or none." />
      <OptionTiles
        multi
        items={accessories.map((entry) => ({
          id: entry.code,
          name: entry.name,
          note: entry.note,
          meta: entry.code,
          on: spec.accessoryCodes.includes(entry.code),
          onPick: () =>
            setSpec((s) => ({
              ...s,
              accessoryCodes: s.accessoryCodes.includes(entry.code)
                ? s.accessoryCodes.filter((code) => code !== entry.code)
                : [...s.accessoryCodes, entry.code],
            })),
        }))}
      />
    </>
  );
}

export function StepBody({
  step,
  onPickSeries,
  ...props
}: StepProps & { step: StepKey; onPickSeries: (slug: string) => void }) {
  switch (step) {
    case "series":
      return <SeriesStep spec={props.spec} onPick={onPickSeries} />;
    case "config":
      return <ConfigurationStep {...props} />;
    case "top":
      return <FinishStep {...props} />;
    case "legs":
      return <LegStep {...props} />;
    case "extras":
      return <ExtrasStep {...props} />;
  }
}
