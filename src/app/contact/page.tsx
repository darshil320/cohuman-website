import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import { ContactFormTabs } from "@/components/forms/contact-form-tabs";
import { FaqSection } from "@/components/common/faq-section";
import { SectionHeading } from "@/components/common/section-heading";
import { mailtoHref, siteConfig, telHref, whatsappHref } from "@/lib/site-config";
import { Reveal } from "@/components/ui/scroll-reveal";

const FAQ_ITEMS = [
  {
    question: "How long does a quote take?",
    answer: `Most enquiries get a reply with test-fits and a costed schedule within ${siteConfig.enquiryTurnaround}, from a specifier rather than an automated response.`,
  },
  {
    question: "Are prices listed on the site?",
    answer:
      "No — Cohuman is a request-a-quote business, not a checkout. Catalog pages show a qualitative price band (Value, Mid or Premium) instead of a fixed number, since final pricing depends on quantity, finish and site conditions.",
  },
  {
    question: "What's the lead time once an order is confirmed?",
    answer:
      "It varies by product — most items ship 2 to 4 weeks from order confirmation. The exact lead time is listed on each product's specification table.",
  },
  {
    question: "What warranty comes with the furniture?",
    answer:
      "Warranty terms vary by product, typically 3 to 5 years, and are listed on each product's specification table. An AMC (annual maintenance contract) is also available for ongoing servicing and spares.",
  },
  {
    question: "Do you take bulk or multi-site orders?",
    answer:
      "Yes — bulk and franchise/multi-site orders go through a dedicated B2B enquiry route with its own desk, separate from the standard product enquiry form.",
  },
  {
    question: "Do you only sell furniture, or handle the full fit-out?",
    answer:
      "Both. Services range from space planning and test-fits, to a single-contract turnkey fit-out, to delivery/installation by in-house crews, to ongoing AMC aftercare.",
  },
  {
    question: "Can I visit a showroom before ordering?",
    answer:
      "Yes — book a showroom visit through the second tab on this page. Visits are by appointment.",
  },
];

export const metadata: Metadata = {
  title: "Contact & Showroom",
  description:
    "Visit the Cohuman showroom in Surat, or send us your floor plan and headcount for a costed proposal.",
};

const contactRows = [
  { k: "Showroom", v: `${siteConfig.address.line2} — ${siteConfig.address.line1}` },
  { k: "Phone / WhatsApp", v: siteConfig.phoneDisplay },
  { k: "Hours", v: siteConfig.hours },
  { k: "Legal entity", v: `${siteConfig.legalName} — founded ${siteConfig.foundedYear} by ${siteConfig.founder}` },
];

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ContactPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const isOrgatec = resolvedSearchParams?.source === "orgatec";

  return (
    <div>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[clamp(30px,4vw,68px)] px-[18px] py-[clamp(44px,6vw,82px)] pb-[clamp(64px,8vw,104px)] sm:px-6 lg:grid-cols-2 lg:px-11">
        <Reveal>
          <p className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            {isOrgatec ? "ORGATEC 2026" : "Contact"}
          </p>
          <h1 className="mb-5 max-w-[18ch] font-display text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.02] tracking-tight">
            {isOrgatec ? "Let's meet at the event." : "Tell us about the space."}
          </h1>
          <p className="mb-[34px] max-w-[42ch] text-[clamp(16.5px,1.5vw,19.5px)] font-light leading-relaxed text-co-muted">
            {isOrgatec
              ? "Attending ORGATEC? Reach out to schedule a consultation with our design team. We'd love to connect."
              : `A floor plan and a headcount are enough to start. You will hear back from a specifier, not a chatbot, within ${siteConfig.enquiryTurnaround}.`}
          </p>

          <div className="mb-4 flex flex-wrap gap-2.5">
            <a
              href={telHref()}
              className="flex items-center gap-2 border border-co-border-strong px-5 py-3 text-[14.5px] font-semibold text-co-ink hover:border-co-ink hover:bg-co-bg-alt"
            >
              <Phone className="h-4 w-4" /> Call showroom
            </a>
            <a
              href={whatsappHref("Hi Cohuman, I'd like to ask about office furniture.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border border-co-border-strong px-5 py-3 text-[14.5px] font-semibold text-co-ink hover:border-co-ink hover:bg-co-bg-alt"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp us
            </a>
          </div>

          <div className="border-t border-co-border">
            {contactRows.map((c) => (
              <div key={c.k} className="border-b border-co-border py-[18px]">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                  {c.k}
                </p>
                <p className="text-[16px] font-light leading-relaxed text-co-ink-soft">{c.v}</p>
              </div>
            ))}
          </div>
          {/* Both inboxes, addressed to a person rather than hidden behind one form. */}
          <div className="mt-[26px] grid gap-px border border-co-border bg-co-border sm:grid-cols-2">
            {siteConfig.emails.map((inbox) => (
              <div key={inbox.address} className="bg-co-bg p-[clamp(16px,2vw,20px)]">
                <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                  {inbox.label}
                </p>
                <a
                  href={mailtoHref(inbox.address, "Enquiry from the Cohuman website")}
                  className="block break-all text-[15px] font-medium text-co-ink underline-offset-4 hover:underline"
                >
                  {inbox.address}
                </a>
                <p className="mt-1 text-[13px] font-light leading-snug text-co-muted">
                  {inbox.note}
                </p>
              </div>
            ))}
          </div>

          {/* Who actually answers, city by city. */}
          <div className="mt-4 grid gap-px border border-co-border bg-co-border sm:grid-cols-2">
            {siteConfig.offices
              .filter((office) => office.contact)
              .map((office) => (
                <div key={office.city} className="bg-co-bg p-[clamp(16px,2vw,20px)]">
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-co-faint">
                    {office.city} · {office.role}
                  </p>
                  <p className="text-[15px] font-medium text-co-ink">{office.contact?.name}</p>
                  {office.phoneDisplay && office.phoneE164 ? (
                    <a
                      href={telHref(office.phoneE164)}
                      className="mt-1 block text-[14px] font-light text-co-ink-soft underline-offset-4 hover:text-co-ink hover:underline"
                    >
                      {office.phoneDisplay}
                    </a>
                  ) : (
                    <p className="mt-1 text-[13px] font-light text-co-faint">
                      Direct line to follow — reach {office.contact?.name.split(" ")[0]} on the
                      sales inbox meanwhile.
                    </p>
                  )}
                </div>
              ))}
          </div>

          <p className="mt-[18px] text-[13px] font-light text-co-faint">
            Showroom address, phone and hours above are placeholders pending confirmation —
            send over the current details and they will drop straight in.
          </p>

          {siteConfig.mapEmbedUrl ? (
            <iframe
              title="Cohuman showroom location"
              src={siteConfig.mapEmbedUrl}
              className="mt-6 h-[280px] w-full border border-co-border"
              loading="lazy"
            />
          ) : (
            <div className="mt-6 flex h-[280px] w-full items-center justify-center border border-dashed border-co-border-strong bg-co-bg-alt text-sm text-co-faint">
              Map embed pending confirmed showroom address
            </div>
          )}
        </Reveal>

        <Reveal delay={0.15}>
          <ContactFormTabs />
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1320px] px-[18px] pb-[clamp(64px,8vw,104px)] sm:px-6 lg:px-11">
        <SectionHeading eyebrow="FAQ" title="Common questions, answered plainly." />
        <Reveal delay={0.1}>
          <FaqSection items={FAQ_ITEMS} />
        </Reveal>
      </section>
    </div>
  );
}
