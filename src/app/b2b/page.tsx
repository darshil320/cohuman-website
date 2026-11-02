import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/section-heading";
import { B2bForm } from "@/components/forms/b2b-form";
import { Reveal } from "@/components/ui/scroll-reveal";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "B2B & Bulk Orders",
  description:
    "Furnishing an office, a franchise, or multiple sites at once? Get a scoped bulk-order proposal from Cohuman’s B2B desk.",
  alternates: { canonical: "/b2b" },
  openGraph: {
    title: "B2B & Bulk Orders",
    description:
      "Furnishing an office, a franchise, or multiple sites at once? Get a scoped bulk-order proposal from Cohuman’s B2B desk.",
    url: "/b2b",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "B2B & Bulk Orders",
    description:
      "Furnishing an office, a franchise, or multiple sites at once? Get a scoped bulk-order proposal from Cohuman’s B2B desk.",
  },
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

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The B2B desk. The page is the form, so it ends on the form rather than a CTA band:
 * what the desk handles as mono-keyed spec rows on the left, the bulk-order sheet on the
 * right — the same square ink-ruled sheet as the contact page's form.
 */
export default function B2bPage() {
  return (
    <div>
      <PageHero
        eyebrow="B2B / Bulk orders"
        title="Furnishing more than one desk? This is the fast lane."
        titleClassName="max-w-[18ch]"
        lead="For corporate offices, franchise rollouts and multi-site fit-outs, tell us the scale up front — quantity, use case and timeline — and it goes straight to our B2B desk instead of the general enquiry queue."
      />

      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="01 / B2B desk"
          title="Why enquire here instead of the general form"
        />

        <div className="grid grid-cols-1 items-start gap-x-[clamp(28px,4vw,72px)] gap-y-12 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <dl className="border-t border-co-ink">
              {REASONS.map((r, i) => (
                <div
                  key={r.name}
                  className="grid grid-cols-1 gap-x-6 gap-y-2 border-b border-co-border py-5 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]"
                >
                  <dt className="co-data text-co-ink">
                    <span className="mr-2 text-co-muted-2">{pad(i + 1)}</span>
                    {r.name}
                  </dt>
                  <dd className="max-w-[52ch] text-[15px] leading-[1.55] text-co-ink-soft">
                    {r.blurb}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="border border-co-ink bg-co-bg">
              <p className="co-data border-b border-co-ink px-6 py-4 sm:px-8">
                <span className="mr-2 text-co-muted-2">B2B</span>
                Bulk-order enquiry
              </p>
              <B2bForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
