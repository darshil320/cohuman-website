import type { ResolvedSpecification } from "./options";

/**
 * The specification as plain text.
 *
 * One function builds the summary shown on screen, the string sent in the enquiry and
 * the copy-to-clipboard payload, so what the customer reads and what lands in the lead
 * email cannot drift apart.
 */
export interface SummaryRow {
  label: string;
  value: string;
  code?: string;
}

export function summaryRows(spec: ResolvedSpecification): SummaryRow[] {
  const rows: SummaryRow[] = [
    { label: "Series", value: spec.options.series.name },
    { label: "Configuration", value: spec.top.name },
    { label: "Size", value: spec.size },
  ];

  if (spec.leg) rows.push({ label: "Legs", value: spec.leg.name, code: spec.leg.code });
  if (spec.topFinish)
    rows.push({ label: "Top finish", value: spec.topFinish.name, code: spec.topFinish.code });
  if (spec.frameFinish)
    rows.push({ label: "Frame finish", value: spec.frameFinish.name, code: spec.frameFinish.code });

  for (const accessory of spec.accessories) {
    rows.push({ label: "Accessory", value: accessory.name, code: accessory.code });
  }

  if (spec.top.seats && spec.top.seats !== "—") {
    rows.push({ label: "Seats", value: spec.top.seats });
  }

  return rows;
}

/** The specification folded into the enquiry's free-text field. */
export function summaryText(spec: ResolvedSpecification): string {
  return summaryRows(spec)
    .map((row) => `${row.label}: ${row.value}${row.code ? ` (${row.code})` : ""}`)
    .join("\n");
}

/** Short one-line subject for the lead email and the quote dialog. */
export function summarySubject(spec: ResolvedSpecification): string {
  return `${spec.options.series.wordmark} · ${spec.top.name} · ${spec.size}`;
}
