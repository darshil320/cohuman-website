import type { Metadata } from "next";
import { B2bForm } from "@/components/forms/b2b-form";
import { TextReveal } from "@/components/ui/text-reveal";

export const metadata: Metadata = {
  title: "B2B & Bulk Orders",
  description:
    "Furnishing an office, a franchise, or multiple sites at once? Get a scoped bulk-order proposal from Cohuman's B2B desk.",
};

const REASONS = [
  {
    name: "One point of contact",
    blurb:
      "A dedicated specifier owns your account end to end — quoting, scheduling and aftercare — instead of a different rep per site.",
  },
  {
    name: "Volume-scaled pricing",
    blurb:
      "Larger quantities change the economics of manufacture and delivery. We price the whole order, not per-unit list prices.",
  },
  {
    name: "Phased delivery",
    blurb:
      "Rolling out across floors, buildings or franchise locations on a schedule you control, not all at once.",
  },
  {
    name: "Consistent specification",
    blurb:
      "Same finishes and fixings across every site, so year-three replacements still match year-one furniture.",
  },
];

export default function B2bPage() {
  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            B2B / Bulk orders
          </p>
          <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(34px,5vw,60px)] font-medium leading-[1.02] tracking-tight">
            <TextReveal>Furnishing more than one desk? This is the fast lane.</TextReveal>
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            For corporate offices, franchise rollouts and multi-site fit-outs, tell us the scale
            up front — quantity, use case and timeline — and it goes straight to our B2B desk
            instead of the general enquiry queue.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-[18px] py-[clamp(44px,6vw,84px)] sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-11">
        <div>
          <h2 className="mb-6 font-display text-2xl font-medium tracking-tight sm:text-[28px]">
            Why enquire here instead of the general form
          </h2>
          <div className="grid gap-6">
            {REASONS.map((r) => (
              <div key={r.name}>
                <h3 className="mb-1.5 font-display text-[19px] font-medium tracking-tight">
                  {r.name}
                </h3>
                <p className="text-[15px] font-light leading-relaxed text-co-muted-2">
                  {r.blurb}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-co-card-border bg-white">
          <B2bForm />
        </div>
      </section>
    </div>
  );
}
