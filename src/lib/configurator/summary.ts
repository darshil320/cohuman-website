import { TO_PLAN, type ResolvedSpecification } from "./options";

/**
 * The specification as plain text.
 *
 * One function builds the summary shown on screen, the string sent in the enquiry and
 * the copy-to-clipboard payload, so what the customer reads and what lands in the lead
 * email cannot drift apart. No part codes and no supplier names: the quote carries those.
 */
export interface SummaryRow {
  label: string;
  value: string;
  code?: string;
}

const NOT_AVAILABLE = "Not available";

function sharingLabel(sharing: "sharing" | "non-sharing"): string {
  return sharing === "sharing" ? "Sharing (face to face)" : "Non-sharing (one row)";
}

export function summaryRows(spec: ResolvedSpecification): SummaryRow[] {
  const { system, top } = spec;
  const rows: SummaryRow[] = [
    { label: "System", value: system.name },
    { label: "Frame finish", value: spec.frameShade?.name ?? NOT_AVAILABLE },
    { label: "Top core", value: spec.core.name },
    { label: "Edge", value: spec.edge.name },
    { label: "Corner", value: spec.corner.name },
    {
      label: "Top finish",
      value: spec.veneer ? "Veneer, as per selection" : (spec.topShade?.name ?? NOT_AVAILABLE),
      code: spec.topShade?.code,
    },
    {
      label: "Partition",
      value: spec.partition
        ? `${spec.partition.name}${spec.fabric ? `, ${spec.fabric.name} fabric` : ""}`
        : "None",
    },
    { label: "Cable management", value: spec.cable?.name ?? "None" },
    { label: "VOLT & BOLT", value: spec.power?.name ?? "None" },
  ];

  for (const accessory of spec.accessories) {
    rows.push({ label: "Accessory", value: accessory.name });
  }

  rows.push({ label: "Configuration", value: top?.name ?? NOT_AVAILABLE });
  if (top?.sharing) rows.push({ label: "Layout", value: sharingLabel(top.sharing) });
  rows.push({ label: "Size", value: spec.size });
  if (top?.seats && top.seats !== "—") rows.push({ label: "Seats", value: top.seats });

  return rows;
}

/** The specification folded into the enquiry's free-text field. */
export function summaryText(spec: ResolvedSpecification): string {
  return summaryRows(spec)
    .map((row) => `${row.label}: ${row.value}${row.code ? ` (${row.code})` : ""}`)
    .join("\n");
}

/** Short one-line subject for the lead email and the quote dialog (≤ 200 characters). */
export function summarySubject(spec: ResolvedSpecification): string {
  const size = spec.size === TO_PLAN ? "sized to plan" : spec.size;
  return [spec.system.name, spec.top?.name, size].filter(Boolean).join(" · ");
}

export { sharingLabel };
