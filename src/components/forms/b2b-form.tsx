"use client";

import { useState } from "react";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/b2b", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      trackLeadSubmitted("b2b_bulk_order", {
        quantity: String(payload.estimatedQuantity ?? ""),
      });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
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
          <Input id="companyName" name="companyName" placeholder="Organisation" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" name="contactName" placeholder="Your full name" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+91" required />
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

      <Button type="submit" disabled={submitting} className="mt-8 w-full">
        {submitting ? "Sending…" : "Send bulk enquiry"}
      </Button>
      <FormFootnote>
        Routed straight to our B2B desk. We reply within {siteConfig.enquiryTurnaround}.
      </FormFootnote>
    </form>
  );
}
