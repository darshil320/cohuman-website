"use client";

import { useState } from "react";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent, SubmitButton } from "@/components/forms/form-status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { sendLead } from "@/lib/leads/client";
import { usePendingSubmit } from "@/lib/use-pending-submit";
import { siteConfig } from "@/lib/site-config";

const USE_CASES = [
  "New office fit-out",
  "Office expansion / additional headcount",
  "Office relocation",
  "Replacing existing furniture",
  "Multiple sites / franchise rollout",
  "Other",
];

const TIMELINES = [
  "Immediate (0–1 month)",
  "1–3 months",
  "3–6 months",
  "6+ months / still planning",
];

export function B2bForm() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { busy, pending, run } = usePendingSubmit();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await run(() => sendLead("/api/b2b", payload));
    if (!result) return; // already sending
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    trackLeadSubmitted("b2b_bulk_order", {
      quantity: String(payload.estimatedQuantity ?? ""),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <FormSent label="Bulk enquiry received" title="Thank you — your bulk enquiry is with our B2B desk.">
        A specifier will reply within {siteConfig.enquiryTurnaround} with a scoped proposal for the quantity and timeline you gave us.
      </FormSent>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
      <div className={FORM_GRID}>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" autoComplete="organization" name="companyName" placeholder="Organisation" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" autoComplete="name" name="contactName" placeholder="Your full name" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" autoComplete="email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" autoComplete="tel" name="phone" type="tel" placeholder="+91" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="estimatedQuantity">Estimated quantity</Label>
          <Input
            id="estimatedQuantity"
            name="estimatedQuantity"
            placeholder="e.g. 150 desks + 150 chairs"
            required
          />
        </div>
        <div className={FIELD}>
          <Label htmlFor="useCase">Use case</Label>
          <Select id="useCase" name="useCase" defaultValue={USE_CASES[0]} required>
            {USE_CASES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className={FIELD}>
          <Label htmlFor="timeline">Timeline</Label>
          <Select id="timeline" name="timeline" defaultValue={TIMELINES[0]} required>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor="message">Anything else useful</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Sites/locations, budget band, existing furniture to replace, procurement process…"
          />
        </div>
      </div>

      <FormError message={error} />

      <SubmitButton label="Send bulk enquiry" busy={busy} pending={pending} />
      <FormFootnote>
        Routed straight to our B2B desk. We reply within {siteConfig.enquiryTurnaround}.
      </FormFootnote>
    </form>
  );
}
