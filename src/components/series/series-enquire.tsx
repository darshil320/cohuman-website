"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/common/section-heading";
import { FIELD, FORM_GRID, FormError, FormFootnote, FormSent, SubmitButton } from "@/components/forms/form-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Reveal } from "@/components/ui/scroll-reveal";
import { Select } from "@/components/ui/select";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import { Textarea } from "@/components/ui/textarea";
import { trackLeadSubmitted } from "@/lib/analytics";
import { sendLead } from "@/lib/leads/client";
import { usePendingSubmit } from "@/lib/use-pending-submit";
import {
  INFERRED_CODE_FOOTNOTE,
  enquiryInterest,
  finishLabel,
  isInferredCode,
  selectedParts,
} from "@/lib/series";
import { siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow } from "@/lib/series";

/** Appended to the lead so the specifier receives the exact chassis that was configured. */
function specSummary(lines: string[], notes: string): string {
  const spec = ["— Specified on site —", ...lines].join("\n");
  return notes.trim() ? `${notes.trim()}\n\n${spec}` : spec;
}

export function SeriesEnquire() {
  const { series, config, selection, size, quantity, setQuantity, pickConfigBySlug } =
    useSeriesConfigurator();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { busy, pending, run } = usePendingSubmit();

  const section = series.enquirySection;
  const interest = enquiryInterest(selection);
  const finish = finishLabel(selection);
  const quantityLabel = quantity.trim() ? `${quantity.trim()} positions` : "";

  const parts = selectedParts(selection);
  const inferredCode = isInferredCode(series, parts.code);

  // Presentation only: the payload below builds its own plain-text lines.
  const selectionRows: SpecRow[] = [
    { k: "Series", v: `${series.name} — ${series.eyebrow.toLowerCase()}` },
    { k: "Configuration", v: config.name },
    { k: "Size", v: size },
    ...(finish ? [{ k: "Top finish", v: finish }] : []),
    {
      k: series.codeLabel ?? "Element code",
      v: (
        <>
          {parts.code}
          {inferredCode ? (
            <span className="text-co-muted-2" title={INFERRED_CODE_FOOTNOTE}>
              °
            </span>
          ) : null}
        </>
      ),
    },
    { k: "Quantity", v: quantityLabel || "Not specified" },
  ];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const bom = parts.bom.map((line) => `${line.name} ${line.code} × ${line.qty}`).join("; ");
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
          `${series.codeLabel ?? "Element code"}: ${parts.code}`,
          `Bill of components: ${bom || parts.bomNote || "to be confirmed with the quote"}`,
        ],
        String(form.get("notes") ?? ""),
      ),
    };

    const result = await run(() => sendLead("/api/enquiry", payload));
    if (!result) return; // already sending
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setError(null);
    trackLeadSubmitted("product_enquiry", { interest });
    setSent(true);
  }

  return (
    <section id="enquire" className="co-section scroll-mt-[72px] bg-co-bg-alt">
      <div className="co-shell">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "enquire", section.eyebrow)}
          title={section.heading}
          blurb={section.blurb}
        />

        <div className="grid items-start gap-[clamp(32px,4vw,64px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <Reveal>
            <p className="co-eyebrow mb-3">Your selection</p>
            <SpecRows rows={selectionRows} />
            {inferredCode ? (
              <p className="mt-3 text-[13px] leading-[1.55] text-co-muted">{INFERRED_CODE_FOOTNOTE}</p>
            ) : null}
          </Reveal>

          {/* The form sits on a canvas sheet laid on the fog. Square, no frame, no shadow. */}
          <div className="bg-co-bg">
            {sent ? (
              <>
                <FormSent label="Enquiry received" title="Request logged.">
                  A specification consultant will come back with the component schedule for{" "}
                  {config.name} at {size} within {siteConfig.enquiryTurnaround}.
                </FormSent>
                <div className="px-6 pb-10 sm:px-8 sm:pb-14">
                  <Button type="button" variant="link" arrow onClick={() => setSent(false)}>
                    Send another
                  </Button>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <div className={FORM_GRID}>
                  <div className={FIELD}>
                    <Label htmlFor="series-name">Name</Label>
                    <Input id="series-name" autoComplete="name" name="name" placeholder="Your name" required />
                  </div>
                  <div className={FIELD}>
                    <Label htmlFor="series-company">Company</Label>
                    <Input id="series-company" autoComplete="organization" name="company" placeholder="Organisation" />
                  </div>
                  <div className={FIELD}>
                    <Label htmlFor="series-email">Email</Label>
                    <Input
                      id="series-email"
                      name="email"
                      autoComplete="email"
                      type="email"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                  <div className={FIELD}>
                    <Label htmlFor="series-phone">Phone</Label>
                    <Input id="series-phone" autoComplete="tel" name="phone" type="tel" placeholder="+91" required />
                  </div>
                  <div className={FIELD}>
                    <Label htmlFor="series-city">City</Label>
                    <Input id="series-city" autoComplete="address-level2" name="city" placeholder="Site location" />
                  </div>
                  <div className={FIELD}>
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
                  <div className={cn(FIELD, "sm:col-span-2")}>
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
                  <div className={cn(FIELD, "sm:col-span-2")}>
                    <Label htmlFor="series-notes">Anything else</Label>
                    <Textarea
                      id="series-notes"
                      name="notes"
                      rows={3}
                      placeholder="Floor plate, headcount, timeline"
                    />
                  </div>
                </div>

                <FormError message={error} />

                <SubmitButton label="Request a quote" busy={busy} pending={pending} />
                <FormFootnote>
                  We reply within {siteConfig.enquiryTurnaround}. No mailing list.
                </FormFootnote>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
