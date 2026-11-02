"use client";

import { useState } from "react";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { siteConfig } from "@/lib/site-config";

export function ShowroomVisitForm() {
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
      const response = await fetch("/api/showroom-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!result.success) {
        setError(result.error ?? "Something went wrong. Please try again.");
        return;
      }
      trackLeadSubmitted("showroom_visit", {
        preferredDate: String(payload.preferredDate ?? ""),
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
      <FormSent label="Visit requested" title="Your visit request is in.">
        We will confirm the date and time within {siteConfig.enquiryTurnaround}.
      </FormSent>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
      <div className={FORM_GRID}>
        <div className={FIELD}>
          <Label htmlFor="visit-name">Name</Label>
          <Input id="visit-name" name="name" placeholder="Your full name" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="visit-email">Email</Label>
          <Input id="visit-email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="visit-phone">Phone</Label>
          <Input id="visit-phone" name="phone" type="tel" placeholder="+91" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="visit-partySize">Number of visitors</Label>
          <Input id="visit-partySize" name="partySize" placeholder="e.g. 2" />
        </div>
        <div className={FIELD}>
          <Label htmlFor="visit-date">Preferred date</Label>
          <Input id="visit-date" name="preferredDate" type="date" required />
        </div>
        <div className={FIELD}>
          <Label htmlFor="visit-time">Preferred time</Label>
          <Input id="visit-time" name="preferredTime" type="time" required />
        </div>
        <div className={`${FIELD} sm:col-span-2`}>
          <Label htmlFor="visit-notes">What would you like to see</Label>
          <Textarea
            id="visit-notes"
            name="notes"
            rows={3}
            placeholder="A collection, a category, or a specific piece you’d like set up for the visit…"
          />
        </div>
      </div>

      <FormError message={error} />

      <Button type="submit" disabled={submitting} className="mt-8 w-full">
        {submitting ? "Sending…" : "Book showroom visit"}
      </Button>
      <FormFootnote>
        Visits are by appointment. We reply within {siteConfig.enquiryTurnaround}.
      </FormFootnote>
    </form>
  );
}
