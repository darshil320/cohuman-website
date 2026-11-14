"use client";

import { useId, useState } from "react";
import categories from "@/data/categories.json";
import collections from "@/data/collections.json";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent, SubmitButton } from "@/components/forms/form-status";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { sendLead } from "@/lib/leads/client";
import { usePendingSubmit } from "@/lib/use-pending-submit";
import { siteConfig } from "@/lib/site-config";

const baseInterestOptions = [
  "Not sure yet — advise me",
  ...collections.map((c) => c.name),
  ...categories.map((c) => c.label),
  "Full furniture fit-out",
  "Space planning only",
  "AMC / aftercare",
];

interface EnquiryFormProps {
  defaultInterest?: string;
  /** Prefills Requirements (the configurator's specification). */
  defaultMessage?: string;
  onSuccess?: () => void;
  compact?: boolean;
}

export function EnquiryForm({ defaultInterest, defaultMessage, onSuccess, compact }: EnquiryFormProps) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { busy, pending, run } = usePendingSubmit();
  // The form can be on the page twice (the /contact tab and the site-wide quote dialog),
  // so its field ids are per instance.
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;

  const interestOptions =
    defaultInterest && !baseInterestOptions.includes(defaultInterest)
      ? [defaultInterest, ...baseInterestOptions]
      : baseInterestOptions;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await run(() => sendLead("/api/enquiry", payload));
    if (!result) return; // already sending
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    trackLeadSubmitted("product_enquiry", { interest: String(payload.interest ?? "") });
    setSent(true);
    onSuccess?.();
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
          <Label htmlFor={id("name")}>Name</Label>
          <Input id={id("name")} autoComplete="name" name="name" placeholder="Your full name" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor={id("company")}>Company</Label>
          <Input id={id("company")} autoComplete="organization" name="company" placeholder="Organisation" />
        </div>
        <div className={FIELD}>
          <Label htmlFor={id("email")}>Email</Label>
          <Input id={id("email")} autoComplete="email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor={id("phone")}>Phone</Label>
          <Input id={id("phone")} autoComplete="tel" name="phone" type="tel" placeholder="+91" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor={id("city")}>City / location</Label>
          <Input id={id("city")} autoComplete="address-level2" name="city" placeholder="Where is the office?" />
        </div>
        <div className={FIELD}>
          <Label htmlFor={id("quantity")}>Seats / quantity</Label>
          <Input id={id("quantity")} name="quantity" placeholder="e.g. 60 seats" />
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor={id("interest")}>Product or collection of interest</Label>
          <Select id={id("interest")} name="interest" defaultValue={defaultInterest ?? interestOptions[0]}>
            {interestOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor={id("message")}>Requirements</Label>
          <Textarea
            id={id("message")}
            name="message"
            rows={defaultMessage ? 8 : 4}
            defaultValue={defaultMessage}
            placeholder="Floor area, timeline, existing layout, budget band, anything else useful…"
          />
        </div>
      </div>

      <FormError message={error} />

      <SubmitButton label="Send enquiry" busy={busy} pending={pending} />
      <FormFootnote>
        No newsletters, no reselling your details. We reply within {siteConfig.enquiryTurnaround}.
      </FormFootnote>
    </form>
  );
}
