"use client";

import { useState } from "react";
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
      <div className="py-16 text-center sm:py-20">
        <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center bg-co-green text-lg font-semibold text-co-cta-green-ink">
          ✓
        </div>
        <h2 className="mb-2.5 font-display text-2xl font-medium tracking-tight">
          Thank you — your bulk enquiry is with our B2B desk.
        </h2>
        <p className="mx-auto max-w-[42ch] text-[15.5px] leading-relaxed text-co-muted">
          A specifier will reply within {siteConfig.enquiryTurnaround} with a scoped proposal
          for the quantity and timeline you gave us.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" name="companyName" placeholder="Organisation" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="contactName">Contact name</Label>
          <Input id="contactName" name="contactName" placeholder="Your full name" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+91" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="estimatedQuantity">Estimated quantity</Label>
          <Input
            id="estimatedQuantity"
            name="estimatedQuantity"
            placeholder="e.g. 150 desks + 150 chairs"
            required
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="useCase">Use case</Label>
          <Select id="useCase" name="useCase" defaultValue={USE_CASES[0]} required>
            {USE_CASES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="timeline">Timeline</Label>
          <Select id="timeline" name="timeline" defaultValue={TIMELINES[0]} required>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="message">Anything else useful</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Sites/locations, budget band, existing furniture to replace, procurement process…"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={submitting} className="mt-5 w-full">
        {submitting ? "Sending…" : "Send bulk enquiry"}
      </Button>
      <p className="mt-3 text-center text-xs text-co-faint">
        Routed straight to our B2B desk. We reply within {siteConfig.enquiryTurnaround}.
      </p>
    </form>
  );
}
