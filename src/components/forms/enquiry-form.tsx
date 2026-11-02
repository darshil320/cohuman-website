"use client";

import { useState } from "react";
import categories from "@/data/categories.json";
import collections from "@/data/collections.json";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

const baseInterestOptions = [
  "Not sure yet — advise me",
  ...collections.map((c) => c.name),
  ...categories.map((c) => c.label),
  "Full turnkey fit-out",
  "Space planning only",
  "AMC / aftercare",
];

interface EnquiryFormProps {
  defaultInterest?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function EnquiryForm({ defaultInterest, onSuccess, compact }: EnquiryFormProps) {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const interestOptions =
    defaultInterest && !baseInterestOptions.includes(defaultInterest)
      ? [defaultInterest, ...baseInterestOptions]
      : baseInterestOptions;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      trackLeadSubmitted("product_enquiry", { interest: String(payload.interest ?? "") });
      setSent(true);
      onSuccess?.();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <FormSent label="Enquiry received" title="Thank you — that is with us." compact={compact}>
        A specifier will reply within {siteConfig.enquiryTurnaround} with test-fits and a costed
        schedule.
      </FormSent>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "p-6" : "p-6 sm:p-8"}>
      <div className={FORM_GRID}>
        <div className={FIELD}>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your full name" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Organisation" />
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
          <Label htmlFor="city">City / location</Label>
          <Input id="city" name="city" placeholder="Where is the office?" />
        </div>
        <div className={FIELD}>
          <Label htmlFor="quantity">Seats / quantity</Label>
          <Input id="quantity" name="quantity" placeholder="e.g. 60 seats" />
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor="interest">Product or collection of interest</Label>
          <Select id="interest" name="interest" defaultValue={defaultInterest ?? interestOptions[0]}>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor="message">Requirements</Label>
          <Textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Floor area, timeline, existing layout, budget band, anything else useful…"
          />
        </div>
      </div>

      <FormError message={error} />

      <Button type="submit" dots disabled={submitting} className="mt-8 w-full">
        {submitting ? "Sending…" : "Send enquiry"}
      </Button>
      <FormFootnote>
        No newsletters, no reselling your details. We reply within {siteConfig.enquiryTurnaround}.
      </FormFootnote>
    </form>
  );
}
