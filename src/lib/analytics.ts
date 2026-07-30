"use client";

import { track } from "@vercel/analytics";

// Three distinct lead sources, tracked separately so lead volume/quality is
// attributable per the brief: general enquiry, B2B bulk orders, showroom visits.
export type LeadSource = "product_enquiry" | "b2b_bulk_order" | "showroom_visit";

export function trackLeadSubmitted(source: LeadSource, meta?: Record<string, string>) {
  track("lead_submitted", { source, ...meta });
}

export function trackWhatsAppClick(context: string) {
  track("whatsapp_click", { context });
}

export function trackQuoteOpened(context: string) {
  track("quote_dialog_opened", { context });
}
