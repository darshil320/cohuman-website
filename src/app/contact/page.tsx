import type { Metadata } from "next";
import Image from "next/image";
import { FaqSection } from "@/components/common/faq-section";
import { SectionHeading } from "@/components/common/section-heading";
import { ContactFormTabs } from "@/components/forms/contact-form-tabs";
import { Button } from "@/components/ui/button";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal } from "@/components/ui/scroll-reveal";
import { SpecRows } from "@/components/ui/spec-rows";
import { publicFileExists } from "@/lib/public-assets";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { mailtoHref, siteConfig, telHref, whatsappHref } from "@/lib/site-config";

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
    question: "What’s the lead time once an order is confirmed?",
    answer:
      "It varies by product — most items ship 2 to 4 weeks from order confirmation. The exact lead time is listed on each product’s specification table.",
  },
  {
    question: "What warranty comes with the furniture?",
    answer:
      "Warranty terms vary by product, typically 3 to 5 years, and are listed on each product’s specification table. An AMC (annual maintenance contract) is also available for ongoing servicing and spares.",
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
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact & Showroom",
    description:
      "Visit the Cohuman showroom in Surat, or send us your floor plan and headcount for a costed proposal.",
    url: "/contact",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Contact & Showroom",
    description:
      "Visit the Cohuman showroom in Surat, or send us your floor plan and headcount for a costed proposal.",
  },
};

const contactRows = [
  { k: "Showroom", v: `${siteConfig.address.line2} — ${siteConfig.address.line1}` },
  { k: "Phone / WhatsApp", v: siteConfig.phoneDisplay },
  { k: "Hours", v: siteConfig.hours },
  { k: "Legal entity", v: `${siteConfig.legalName} — founded by ${siteConfig.founder}` },
];

/** Mono, but in the address's own case — an email set in caps reads as a different address. */
const MONO_LINK =
  "font-mono text-[12px] leading-[1.5] tracking-[0.06em] text-co-ink underline decoration-co-border underline-offset-4 transition-colors hover:decoration-co-ink";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * Contact. The page is the form, so it ends on the FAQ beneath it rather than a CTA band.
 * Two columns: the details as spec rows and hairline cells on the left, the enquiry /
 * showroom-visit sheet on the right.
 */
export default async function ContactPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const isOrgatec = resolvedSearchParams?.source === "orgatec";
  const showroom = siteConfig.suratPhotos.find((photo) => publicFileExists(photo.src));

  return (
    <div>
      <section className="co-shell grid grid-cols-1 items-start gap-x-[clamp(30px,4vw,80px)] gap-y-14 pb-[clamp(64px,8vw,120px)] pt-[clamp(40px,5vw,72px)] lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="co-eyebrow">{isOrgatec ? "ORGATEC 2026" : "Contact"}</p>
            <h1 className="co-h1 mt-[clamp(20px,2.6vw,36px)] max-w-[14ch] lg:text-[clamp(40px,4.6vw,68px)]">
              <KineticHeading>
                {isOrgatec ? "Let’s meet at the event." : "Tell us about the space."}
              </KineticHeading>
            </h1>
            <p className="co-lead mt-[clamp(20px,2.6vw,32px)] max-w-[42ch]">
              {isOrgatec
                ? "Attending ORGATEC? Reach out to schedule a consultation with our design team. We’d love to connect."
                : `A floor plan and a headcount are enough to start. You will hear back from a specifier, not a chatbot, within ${siteConfig.enquiryTurnaround}.`}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <a href={telHref()}>Call showroom</a>
              </Button>
              <Button asChild variant="secondary">
                <a
                  href={whatsappHref("Hi Cohuman, I'd like to ask about office furniture.")}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </a>
              </Button>
            </div>

            <SpecRows rows={contactRows} className="mt-12" />
          </Reveal>

          {/* Both inboxes, addressed to a person rather than hidden behind one form. */}
          <Reveal className="mt-10">
            <p className="co-eyebrow mb-3">Inboxes</p>
            <div className="grid gap-px border border-co-border bg-co-border sm:grid-cols-2">
              {siteConfig.emails.map((inbox) => (
                <div key={inbox.address} className="bg-co-bg p-5">
                  <p className="co-eyebrow">{inbox.label}</p>
                  <a
                    href={mailtoHref(inbox.address, "Enquiry from the Cohuman website")}
                    className={`${MONO_LINK} mt-3 block break-all`}
                  >
                    {inbox.address}
                  </a>
                  <p className="mt-2 text-[13px] leading-[1.5] text-co-muted">{inbox.note}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Who actually answers, city by city. */}
          <Reveal className="mt-10">
            <p className="co-eyebrow mb-3">Offices</p>
            <div className="grid gap-px border border-co-border bg-co-border sm:grid-cols-2">
              {siteConfig.offices
                .filter((office) => office.contact)
                .map((office) => (
                  <div key={office.city} className="bg-co-bg p-5">
                    <p className="co-eyebrow">
                      {office.city} · {office.role}
                    </p>
                    <p className="mt-3 text-[15px] font-medium text-co-ink">{office.contact?.name}</p>
                    {office.phoneDisplay && office.phoneE164 ? (
                      <a href={telHref(office.phoneE164)} className={`${MONO_LINK} mt-1.5 inline-block`}>
                        {office.phoneDisplay}
                      </a>
                    ) : null}
                  </div>
                ))}
            </div>

          </Reveal>

          {showroom ? (
            <figure className="relative mt-12">
              <RegistrationCross className="-left-2 -top-2 z-10" />
              <ClipReveal className="aspect-[16/10] border border-co-border bg-co-bg-alt">
                <Image
                  src={showroom.src}
                  alt={showroom.alt}
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="co-highkey object-cover"
                />
              </ClipReveal>
              <div className="mt-3 flex flex-wrap justify-between gap-x-6 gap-y-1">
                <FigureCaption n={1} as="span">
                  {showroom.caption}
                </FigureCaption>
                <span className="co-data text-co-muted-2">{siteConfig.coordinates.label}</span>
              </div>
            </figure>
          ) : null}

          {/* The map appears only once a confirmed embed URL exists — no "pending" box. */}
          {siteConfig.mapEmbedUrl ? (
            <iframe
              title="Cohuman showroom location"
              src={siteConfig.mapEmbedUrl}
              className="mt-10 h-[280px] w-full border border-co-border"
              loading="lazy"
            />
          ) : null}
        </div>

        <Reveal delay={0.15}>
          <ContactFormTabs />
        </Reveal>
      </section>

      <section className="co-shell pb-[clamp(64px,8vw,120px)]">
        <SectionHeading eyebrow="01 / FAQ" title="Common questions, answered plainly." className="mb-0" />
        <Reveal>
          <FaqSection items={FAQ_ITEMS} />
        </Reveal>
      </section>
    </div>
  );
}
