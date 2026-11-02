import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/configurator";
import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SHARE_IMAGE } from "@/lib/seo/share-image";

export const metadata: Metadata = {
  title: "Configure your desking",
  description:
    "Specify a Cohuman desking system — configuration, size, top and frame finish, leg package and accessories — and send the specification for a quote.",
  alternates: { canonical: "/configure" },
  openGraph: {
    title: "Configure your desking",
    description:
      "Specify a Cohuman desking system — configuration, size, finish, legs and accessories — and send it for a quote.",
    url: "/configure",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Configure your desking",
    description:
      "Specify a Cohuman desking system — configuration, size, finish, legs and accessories — and send it for a quote.",
  },
};

export default function ConfigurePage() {
  return (
    <div>
      <PageHero
        eyebrow="Configurator"
        title="Specify the table. We’ll quote the floor."
        titleClassName="max-w-[18ch]"
        lead={
          <>
            Pick a system, a configuration and a size, then the top, the legs and anything that
            goes with them. The drawing follows every choice, and the finished specification
            goes to us with the part numbers already on it.
          </>
        }
      />

      <section className="co-shell co-section">
        <Configurator />
      </section>

      <CtaBand
        heading="Rather talk it through?"
        body="Send us the floor plan and a headcount instead — we will come back with a layout and a costed proposal."
        subject="Configurator — floor plan enquiry"
      />
    </div>
  );
}
