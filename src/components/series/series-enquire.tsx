"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { enquiryInterest, finishLabel } from "@/lib/series";
import { siteConfig } from "@/lib/site-config";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/** Appended to the lead so the specifier receives the exact chassis that was configured. */
function specSummary(lines: string[], notes: string): string {
  const spec = ["— Specified on site —", ...lines].join("\n");
  return notes.trim() ? `${notes.trim()}\n\n${spec}` : spec;
}

export function SeriesEnquire() {
  const { series, config, selection, size, quantity, setQuantity, pickConfigBySlug } =
    useSeriesConfigurator();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const section = series.enquirySection;
  const interest = enquiryInterest(selection);
  const finish = finishLabel(selection);
  const quantityLabel = quantity.trim() ? `${quantity.trim()} positions` : "";

  const selectionRows = [
    { k: "Series", v: `${series.name} — ${series.eyebrow.toLowerCase()}` },
    { k: "Configuration", v: config.name },
    { k: "Size", v: size },
    ...(finish ? [{ k: "Top finish", v: finish }] : []),
    { k: series.codeLabel ?? "Element code", v: config.code },
    { k: "Quantity", v: quantityLabel || "Not specified" },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);
    const bom = config.bom.map((line) => `${line.name} ${line.code} × ${line.qty}`).join("; ");
    const payload = {
      name: String(form.get("name") ?? ""),
      company: String(form.get("company") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      city: String(form.get("city") ?? ""),
      quantity: quantityLabel,
      interest,
      message: specSummary(
        [
          `Series: ${series.name}`,
          `Configuration: ${config.name}`,
          `Size: ${size}`,
          ...(finish ? [`Top finish: ${finish}`] : []),
          `${series.codeLabel ?? "Element code"}: ${config.code}`,
          `Bill of components: ${bom}`,
        ],
        String(form.get("notes") ?? ""),
      ),
    };

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
      trackLeadSubmitted("product_enquiry", { interest });
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="enquire" className="scroll-mt-[74px] border-b border-co-border bg-co-bg-alt">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,84px)] sm:px-6 lg:px-11">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] items-start gap-[clamp(26px,3.6vw,60px)]">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
              {section.eyebrow}
            </p>
            <h2 className="mb-4 max-w-[18ch] font-display text-[clamp(28px,3.6vw,46px)] font-medium leading-[1.02] tracking-[-0.035em]">
              {section.heading}
            </h2>
            <p className="mb-6 max-w-[42ch] text-[15.5px] font-light leading-relaxed text-co-muted">
              {section.blurb}
            </p>

            <div className="border border-co-border bg-co-bg">
              <p className="border-b border-co-border px-4 py-3.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-co-faint">
                Your selection
              </p>
              <dl className="grid">
                {selectionRows.map((row) => (
                  <div
                    key={row.k}
                    className="grid grid-cols-[minmax(96px,0.44fr)_1fr] gap-4 border-b border-co-card-border/60 px-4 py-3"
                  >
                    <dt className="pt-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-co-placeholder">
                      {row.k}
                    </dt>
                    <dd className="text-[14.5px] text-co-ink">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>

          {sent ? (
            <motion.div
              className="bg-co-panel px-[clamp(24px,3.4vw,44px)] py-[clamp(28px,3.4vw,44px)] text-co-panel-fg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              <span className="mb-4 flex h-[34px] w-[34px] items-center justify-center bg-co-green text-lg font-bold text-co-cta-green-ink">
                ✓
              </span>
              <h3 className="mb-3 font-display text-[clamp(24px,2.6vw,32px)] font-medium tracking-[-0.028em] text-co-panel-fg">
                Request logged.
              </h3>
              <p className="mb-5 max-w-[38ch] text-[15.5px] font-light leading-relaxed text-co-panel-muted">
                A specification consultant will come back with the component schedule for{" "}
                {config.name} at {size} within {siteConfig.enquiryTurnaround}.
              </p>
              <Button variant="outlineOnDark" onClick={() => setSent(false)}>
                Send another
              </Button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="grid gap-3 border border-co-border bg-co-bg p-[clamp(20px,2.6vw,32px)]"
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="series-name">Name</Label>
                  <Input id="series-name" name="name" placeholder="Your name" required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="series-company">Company</Label>
                  <Input id="series-company" name="company" placeholder="Organisation" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="series-email">Email</Label>
                  <Input
                    id="series-email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    required
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="series-phone">Phone</Label>
                  <Input id="series-phone" name="phone" type="tel" placeholder="+91" required />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="series-city">City</Label>
                  <Input id="series-city" name="city" placeholder="Site location" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="series-quantity">Quantity</Label>
                  <Input
                    id="series-quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="series-configuration">Configuration of interest</Label>
                <Select
                  id="series-configuration"
                  name="configuration"
                  value={config.slug}
                  onChange={(event) => pickConfigBySlug(event.target.value)}
                >
                  {series.configs.map((item) => (
                    <option key={item.slug} value={item.slug}>
                      {item.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="series-notes">Anything else</Label>
                <Textarea
                  id="series-notes"
                  name="notes"
                  rows={3}
                  placeholder="Floor plate, headcount, timeline"
                />
              </div>

              {error ? <p className="text-sm text-red-600">{error}</p> : null}

              <Button type="submit" disabled={submitting} className="mt-1 w-full">
                {submitting ? "Sending…" : "Request a quote"}
              </Button>
              <p className="text-[12.5px] font-light leading-snug text-co-placeholder">
                We reply within {siteConfig.enquiryTurnaround}. No mailing list.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
