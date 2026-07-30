import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

export type LeadSource = "product_enquiry" | "b2b_bulk_order" | "showroom_visit";

const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  product_enquiry: "Product / collection enquiry",
  b2b_bulk_order: "B2B bulk order enquiry",
  showroom_visit: "Showroom visit booking",
};

interface LeadRecord {
  source: LeadSource;
  receivedAt: string;
  fields: Record<string, string | undefined>;
}

function renderEmailHtml(record: LeadRecord): string {
  const rows = Object.entries(record.fields)
    .filter(([, value]) => Boolean(value))
    .map(
      ([key, value]) =>
        `<tr><td style="padding:6px 12px;color:#8C929A;font-size:12px;text-transform:uppercase;">${key}</td><td style="padding:6px 12px;color:#1F2328;">${value}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:sans-serif;max-width:560px;">
      <h2 style="margin:0 0 4px;">${LEAD_SOURCE_LABEL[record.source]}</h2>
      <p style="margin:0 0 16px;color:#8C929A;font-size:13px;">Received ${record.receivedAt}</p>
      <table style="border-collapse:collapse;width:100%;">${rows}</table>
    </div>
  `;
}

// Server-side copy of every submission, so nothing lives only in an inbox.
// KNOWN LIMITATION (v1): this appends to a local JSONL file, which only
// persists on a traditional always-on server or in local dev — Vercel's
// serverless functions have an ephemeral filesystem, so writes here will not
// survive between invocations in production. The Resend email below is the
// durable record for v1. If lead volume grows, replace this with a real
// store (Vercel KV/Postgres, or a spreadsheet via API) — do not build a full
// CRM here, that is a separate, larger engagement.
async function appendLocalLog(record: LeadRecord) {
  try {
    const dir = path.join(process.cwd(), ".leads");
    await mkdir(dir, { recursive: true });
    await appendFile(
      path.join(dir, `${record.source}.jsonl`),
      JSON.stringify(record) + "\n",
      "utf8",
    );
  } catch {
    // Best-effort only — never block a lead submission on local logging.
  }
}

async function sendLeadEmail(record: LeadRecord) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — the submission still succeeds and is logged locally.
    // Set RESEND_API_KEY (and RESEND_FROM_EMAIL) before launch.
    return;
  }
  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "leads@cohuman.example.com",
    to: siteConfig.email,
    subject: `[Cohuman website] ${LEAD_SOURCE_LABEL[record.source]}`,
    html: renderEmailHtml(record),
  });
}

export async function recordLead(
  source: LeadSource,
  fields: Record<string, string | undefined>,
) {
  const record: LeadRecord = {
    source,
    receivedAt: new Date().toISOString(),
    fields,
  };
  await Promise.all([sendLeadEmail(record), appendLocalLog(record)]);
}
