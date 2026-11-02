import type { Dispatch, SetStateAction } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { ALL_OPTIONS, type ResolvedSpecification, type Specification } from "@/lib/configurator";
import { depthFieldLabel, lengthFieldLabel } from "@/lib/series";
import { EmptyNote, FinishGroup, OptionTiles, SizeField, StepHeading } from "./configurator-controls";

/**
 * The five step bodies. Each reads the one specification and writes it through the
 * configurator's own setter, so the option logic is exactly the configurator's — these
 * only decide how a choice is drawn.
 */

export type StepKey = "series" | "config" | "top" | "legs" | "extras";

interface StepProps {
  spec: Specification;
  resolved: ResolvedSpecification;
  setSpec: Dispatch<SetStateAction<Specification>>;
}

/** "1 seat", "4 seats", and nothing at all where the spec does not state a count. */
function seatLabel(seats: string): string | null {
  if (!seats || seats === "—" || seats === "–" || seats === "-") return null;
  return seats === "1" ? "1 seat" : `${seats} seats`;
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
  const showDepth = !top.dia && !top.sq && top.deps.length > 0;

  return (
    <>
      <StepHeading
        heading="Which configuration?"
        note={`${options.tops.length} configurations in this series.`}
      />
      <OptionTiles
        dense
        items={options.tops.map((entry) => ({
          id: entry.slug,
          name: entry.name,
          meta: seatLabel(entry.seats) ?? entry.shape,
          on: entry.slug === spec.topSlug,
          onPick: () => setSpec((s) => ({ ...s, topSlug: entry.slug, lenIndex: 0, depIndex: 0 })),
        }))}
      />

      {config ? (
        <div className="mt-10 grid gap-6">
          <SizeField label={lengthFieldLabel(config)}>
            <SegmentedControl
              label={lengthFieldLabel(config)}
              value={spec.lenIndex}
              options={top.lens.map((mm, index) => ({ value: index, label: mm }))}
              onChange={(index) => setSpec((s) => ({ ...s, lenIndex: index }))}
            />
          </SizeField>

          {showDepth ? (
            <SizeField label={depthFieldLabel(config)}>
              <SegmentedControl
                label={depthFieldLabel(config)}
                value={spec.depIndex}
                options={top.deps.map((mm, index) => ({ value: index, label: mm }))}
                onChange={(index) => setSpec((s) => ({ ...s, depIndex: index }))}
              />
            </SizeField>
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
      <EmptyNote>
        This series&apos; specification names materials rather than finish colours, so there
        is nothing to choose here — we confirm the finish on the quote.
      </EmptyNote>
    );
  }

  return (
    <>
      {topFinishes.length ? (
        <FinishGroup
          heading="Top finish"
          items={topFinishes}
          activeCode={spec.topFinishCode}
          onPick={(code) => setSpec((s) => ({ ...s, topFinishCode: code }))}
        />
      ) : null}
      {frameFinishes.length ? (
        <FinishGroup
          heading="Frame finish"
          items={frameFinishes}
          activeCode={spec.frameFinishCode}
          onPick={(code) => setSpec((s) => ({ ...s, frameFinishCode: code }))}
        />
      ) : null}
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
      <EmptyNote>
        This series publishes no accessory schedule — tell us what you need on the enquiry
        and we will quote it against the run.
      </EmptyNote>
    );
  }

  return (
    <>
      <StepHeading heading="Anything to add?" note="Select as many as apply." />
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
