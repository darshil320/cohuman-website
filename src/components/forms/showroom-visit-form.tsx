"use client";

import { useState } from "react";
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
      <div className="py-16 text-center sm:py-20">
        <div className="mx-auto mb-5 flex h-[52px] w-[52px] items-center justify-center bg-co-green text-lg font-semibold text-co-cta-green-ink">
          ✓
        </div>
        <h2 className="mb-2.5 font-display text-2xl font-medium tracking-tight">
          Your visit request is in.
        </h2>
        <p className="mx-auto max-w-[38ch] text-[15.5px] leading-relaxed text-co-muted">
          We will confirm the date and time within {siteConfig.enquiryTurnaround}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        <div className="grid gap-1.5">
          <Label htmlFor="visit-name">Name</Label>
          <Input id="visit-name" name="name" placeholder="Your full name" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="visit-email">Email</Label>
          <Input id="visit-email" name="email" type="email" placeholder="name@company.com" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="visit-phone">Phone</Label>
          <Input id="visit-phone" name="phone" type="tel" placeholder="+91" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="visit-partySize">Number of visitors</Label>
          <Input id="visit-partySize" name="partySize" placeholder="e.g. 2" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="visit-date">Preferred date</Label>
          <Input id="visit-date" name="preferredDate" type="date" required />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="visit-time">Preferred time</Label>
          <Input id="visit-time" name="preferredTime" type="time" required />
        </div>
        <div className="grid gap-1.5 sm:col-span-2">
          <Label htmlFor="visit-notes">What would you like to see</Label>
          <Textarea
            id="visit-notes"
            name="notes"
            rows={3}
            placeholder="A collection, a category, or a specific piece you'd like set up for the visit…"
          />
        </div>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <Button type="submit" disabled={submitting} className="mt-5 w-full">
        {submitting ? "Sending…" : "Book showroom visit"}
      </Button>
      <p className="mt-3 text-center text-xs text-co-faint">
        Visits are by appointment. We reply within {siteConfig.enquiryTurnaround}.
      </p>
    </form>
  );
}
