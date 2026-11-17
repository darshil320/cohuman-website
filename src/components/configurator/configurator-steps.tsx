import type { Dispatch, SetStateAction } from "react";
import { SegmentedControl } from "@/components/ui/segmented-control";
import {
  POWER_OPTIONS,
  SYSTEMS,
  TO_PLAN,
  VENEER,
  sharingLabel,
  withSystem,
  type ResolvedSpecification,
  type Specification,
  type TopOption,
} from "@/lib/configurator";
import {
  BOARD_SHADES,
  CABLE_OPTIONS,
  CORE_OPTIONS,
  CORNER_OPTIONS,
  EDGE_OPTIONS,
  FABRIC_SHADES,
  PARTITION_OPTIONS,
  STORAGE_OPTIONS,
  type PictureOption,
} from "@/lib/finishes";
import { clampIndex, configSizeRange, depthFieldLabel, depthOptions, lengthFieldLabel } from "@/lib/series";
import { EmptyNote, Field, StepHeading } from "./configurator-controls";
import { seatLabel, sizeHint } from "./labels";
import { PictureTiles, SwatchRow } from "./picture-tiles";

/**
 * The six step bodies, in the catalogue's order (v31, p. 15) with the configuration last
 * (Nov 2026 review): system, top and finish, partition, VOLT & BOLT, accessories,
 * configuration. Each reads the one specification and writes it through `setSpec`; the
 * option logic lives in `@/lib/configurator`, these only decide how a choice is drawn.
 */

export type StepKey = "system" | "top" | "partition" | "power" | "accessories" | "config";

interface StepProps {
  spec: Specification;
  resolved: ResolvedSpecification;
  setSpec: Dispatch<SetStateAction<Specification>>;
}

/** Picture tiles for a list of catalogue options, single choice, optional "none". */
function choiceTiles(
  options: readonly PictureOption[],
  active: string | null,
  pick: (slug: string | null) => void,
  none?: string,
) {
  return [
    ...(none ? [{ id: "none", name: none, empty: true, on: active === null, onPick: () => pick(null) }] : []),
    ...options.map((option) => ({
      id: option.slug,
      name: option.name,
      note: option.note,
      src: option.src,
      on: option.slug === active,
      onPick: () => pick(option.slug),
    })),
  ];
}

function SystemStep({ spec, resolved, setSpec }: StepProps) {
  return (
    <>
      <StepHeading heading="Which system?" note="Standard height is 750 mm of the table top." />
      <PictureTiles
        label="System"
        items={SYSTEMS.map((system) => ({
          id: system.slug,
          name: system.name,
          note: system.note,
          src: system.legImage,
          fit: "cover",
          on: system.slug === spec.systemSlug,
          onPick: () => setSpec((s) => withSystem(s, system.slug)),
        }))}
      />
      {resolved.system.frameShades.length ? (
        <div className="mt-10">
          <SwatchRow
            label="Frame finish"
            swatches={resolved.system.frameShades}
            active={spec.frameShade}
            keyOf={(swatch) => swatch.name}
            onPick={(name) => setSpec((s) => ({ ...s, frameShade: name }))}
          />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyNote>Frame finishes for {resolved.system.name}: not available yet — we confirm them on the quote.</EmptyNote>
        </div>
      )}
    </>
  );
}

function TopStep({ spec, setSpec }: StepProps) {
  return (
    <>
      <StepHeading heading="Which top?" note="The core, the edge and corner profile, and the finish. 25 mm tops, 2 mm PVC edge band." />
      <div className="grid gap-10">
        <Field label="Top core">
          <PictureTiles label="Top core" items={choiceTiles(CORE_OPTIONS, spec.core, (slug) => slug && setSpec((s) => ({ ...s, core: slug })))} />
        </Field>
        <Field label="Edge">
          <PictureTiles label="Edge" items={choiceTiles(EDGE_OPTIONS, spec.edge, (slug) => slug && setSpec((s) => ({ ...s, edge: slug })))} />
        </Field>
        <Field label="Corner">
          <PictureTiles label="Corner" columns={2} items={choiceTiles(CORNER_OPTIONS, spec.corner, (slug) => slug && setSpec((s) => ({ ...s, corner: slug })))} />
        </Field>
        <SwatchRow
          label="Top finish"
          swatches={BOARD_SHADES}
          active={spec.topShade}
          keyOf={(swatch) => swatch.code ?? swatch.name}
          onPick={(key) => setSpec((s) => ({ ...s, topShade: key }))}
          extra={{ key: VENEER, name: "Veneer", note: "Veneer — as per selection" }}
        />
      </div>
    </>
  );
}

function PartitionStep({ spec, resolved, setSpec }: StepProps) {
  return (
    <>
      <StepHeading heading="Which partition?" note="A screen between or behind the desks — or keep the desk open." />
      <PictureTiles
        label="Partition"
        items={choiceTiles(
          PARTITION_OPTIONS,
          spec.partition,
          (slug) => setSpec((s) => ({ ...s, partition: slug, fabric: s.fabric ?? FABRIC_SHADES[1].code ?? null })),
          "No partition",
        )}
      />
      {resolved.partition?.fabric ? (
        <div className="mt-10">
          <SwatchRow
            label="Fabric"
            swatches={FABRIC_SHADES}
            active={spec.fabric}
            keyOf={(swatch) => swatch.code ?? swatch.name}
            onPick={(code) => setSpec((s) => ({ ...s, fabric: code }))}
          />
        </div>
      ) : null}
    </>
  );
}

function PowerStep({ spec, setSpec }: StepProps) {
  return (
    <>
      <StepHeading heading="Which VOLT & BOLT system?" note="Power and data at the desk, and how the cables reach it." />
      <div className="grid gap-10">
        <Field label="Power and data">
          <PictureTiles
            label="Power and data"
            items={choiceTiles(POWER_OPTIONS, spec.power, (slug) => setSpec((s) => ({ ...s, power: slug })), "None").map(
              (tile) => ({ ...tile, fit: "cover" as const }),
            )}
          />
        </Field>
        <Field label="Cable management">
          <PictureTiles
            label="Cable management"
            items={choiceTiles(CABLE_OPTIONS, spec.cable, (slug) => setSpec((s) => ({ ...s, cable: slug })), "None")}
          />
        </Field>
      </div>
    </>
  );
}

function AccessoriesStep({ spec, setSpec }: StepProps) {
  return (
    <>
      <StepHeading heading="Any accessories?" note="Optional — select as many as apply, or none." />
      <PictureTiles
        label="Accessories"
        multi
        columns={4}
        items={STORAGE_OPTIONS.map((option) => ({
          id: option.slug,
          name: option.name,
          meta: option.note,
          src: option.src,
          on: spec.accessories.includes(option.slug),
          onPick: () =>
            setSpec((s) => ({
              ...s,
              accessories: s.accessories.includes(option.slug)
                ? s.accessories.filter((slug) => slug !== option.slug)
                : [...s.accessories, option.slug],
            })),
        }))}
      />
    </>
  );
}

function tableMeta(system: ResolvedSpecification["system"], table: TopOption): string {
  if (table.toPlan) return "Sized to your plan";
  const series = system.tables.kind === "series" || system.tables.kind === "shared" ? system.tables.series : null;
  const config = series?.configs.find((entry) => entry.slug === table.slug);
  return [config ? `${configSizeRange(config)} mm` : null, seatLabel(table.seats), table.sharing ? sharingLabel(table.sharing) : null]
    .filter(Boolean)
    .join(" · ");
}

function ConfigurationStep({ spec, resolved, setSpec }: StepProps) {
  const { system, tables, top } = resolved;

  if (!tables.length || !top) {
    return (
      <>
        <StepHeading heading="Which configuration?" />
        <EmptyNote>
          {system.name}: table types and sizes are not available yet. Send the specification
          and we will quote it to your plan.
        </EmptyNote>
      </>
    );
  }

  const series = system.tables.kind === "series" || system.tables.kind === "shared" ? system.tables.series : null;
  const config = series?.configs.find((entry) => entry.slug === top.slug) ?? null;
  const depths = config && series ? depthOptions({ series, config, lenIndex: spec.lenIndex, depIndex: spec.depIndex }) : null;

  return (
    <>
      <StepHeading
        heading="Which configuration?"
        note="Benches are marked sharing (face to face) or non-sharing (one row). Sizes are fixed, as the catalogue lists them."
      />
      <PictureTiles
        label="Configuration"
        items={tables.map((table) => ({
          id: table.slug,
          name: table.name,
          meta: tableMeta(system, table),
          src: table.image || undefined,
          on: table.slug === top.slug,
          onPick: () => setSpec((s) => ({ ...s, configSlug: table.slug, lenIndex: 0, depIndex: 0 })),
        }))}
      />

      {config ? (
        <div className="mt-10 grid gap-8">
          <Field label={lengthFieldLabel(config)} hint={sizeHint({ axis: "length", config, count: top.lens.length })} hintId="cfg-length-hint">
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
      ) : (
        <div className="mt-8">
          <EmptyNote>Size: {TO_PLAN.toLowerCase()}.</EmptyNote>
        </div>
      )}
    </>
  );
}

export function StepBody({ step, ...props }: StepProps & { step: StepKey }) {
  switch (step) {
    case "system":
      return <SystemStep {...props} />;
    case "top":
      return <TopStep {...props} />;
    case "partition":
      return <PartitionStep {...props} />;
    case "power":
      return <PowerStep {...props} />;
    case "accessories":
      return <AccessoriesStep {...props} />;
    case "config":
      return <ConfigurationStep {...props} />;
  }
}
