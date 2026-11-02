import { Button } from "@/components/ui/button";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import type { Estimate, SummaryRow } from "@/lib/configurator";

/**
 * Rows that share a label — several accessories — collapse into one spec row with a
 * line per item. The labels and values are `summaryRows` verbatim, so the screen still
 * reads exactly what the enquiry sends; this only keeps each `<dt>` (and React key)
 * unique.
 */
function groupRows(rows: readonly SummaryRow[]): SpecRow[] {
  const groups = new Map<string, SummaryRow[]>();
  for (const row of rows) {
    groups.set(row.label, [...(groups.get(row.label) ?? []), row]);
  }

  // Name left, part code right — the bill of components' column order — so codes line up
  // down the block on wide screens and drop under their name on a phone.
  return [...groups].map(([label, items]) => ({
    k: label,
    v: items.map((item) => (
      <span
        key={`${item.value}-${item.code ?? ""}`}
        className="flex flex-wrap items-baseline justify-between gap-x-4"
      >
        <span className="min-w-0">{item.value}</span>
        {item.code ? <span className="text-co-panel-faint">{item.code}</span> : null}
      </span>
    )),
  }));
}

/**
 * The finished specification — the PDP's ink spec block, ending in the enquiry. Price
 * stays whatever `estimate()` says; today that is "Price on request" and its reason.
 * No `"use client"`: it takes `onSend`, so only the client configurator renders it.
 */
export function SpecificationBlock({
  rows,
  price,
  onSend,
}: {
  rows: readonly SummaryRow[];
  price: Estimate | null;
  onSend: () => void;
}) {
  return (
    <section
      aria-label="Your specification"
      className="mt-12 bg-co-panel px-5 py-8 text-co-panel-fg sm:px-8 sm:py-10"
    >
      <p className="co-eyebrow mb-5 text-co-panel-faint">Your specification</p>
      <SpecRows rows={groupRows(rows)} tone="dark" />

      {price && !price.priced ? (
        <p className="mt-6 max-w-[46ch] text-[13px] leading-[1.55] text-co-panel-muted">
          <span className="font-medium text-co-panel-fg">Price on request.</span> {price.reason}
        </p>
      ) : null}

      <div className="mt-8">
        <Button type="button" variant="onDark" onClick={onSend}>
          Send this specification
        </Button>
      </div>
    </section>
  );
}
