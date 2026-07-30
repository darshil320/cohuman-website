import type { Metadata } from "next";
import { Phone, MessageCircle } from "lucide-react";
import { ContactFormTabs } from "@/components/forms/contact-form-tabs";
import { siteConfig, telHref, whatsappHref } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact & Showroom",
  description:
    "Visit the Cohuman showroom in Surat, or send us your floor plan and headcount for a costed proposal.",
};

const contactRows = [
  { k: "Showroom", v: `${siteConfig.address.line2} — ${siteConfig.address.line1}` },
  { k: "Phone / WhatsApp", v: siteConfig.phoneDisplay },
  { k: "Email", v: siteConfig.email },
  { k: "Hours", v: siteConfig.hours },
  { k: "Legal entity", v: `${siteConfig.legalName} — founded ${siteConfig.foundedYear} by ${siteConfig.founder}` },
];

export default function ContactPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-[1320px] grid-cols-1 items-start gap-[clamp(30px,4vw,68px)] px-[18px] py-[clamp(44px,6vw,82px)] pb-[clamp(64px,8vw,104px)] sm:px-6 lg:grid-cols-2 lg:px-11">
        <div>
          <p className="mb-3.5 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Contact
          </p>
          <h1 className="mb-5 max-w-[18ch] font-display text-[clamp(32px,4.4vw,56px)] font-medium leading-[1.02] tracking-tight">
            Tell us about the space.
          </h1>
          <p className="mb-[34px] max-w-[42ch] text-[clamp(16.5px,1.5vw,19.5px)] font-light leading-relaxed text-co-muted">
            A floor plan and a headcount are enough to start. You will hear back from a
            specifier, not a chatbot, within {siteConfig.enquiryTurnaround}.
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
        </div>

        <ContactFormTabs />
      </section>
    </div>
  );
}
