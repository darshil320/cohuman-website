import type { Metadata } from "next";
import { Configurator } from "@/components/configurator/configurator";
import { CtaBand } from "@/components/common/cta-band";
import { Reveal } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

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
      <section className="border-b border-co-border">
        <Reveal className="co-shell py-[clamp(48px,6vw,96px)]">
          <p className="co-eyebrow mb-4">Configurator</p>
          <h1 className="co-h1 mb-6 max-w-[18ch]">
            <TextReveal>Specify the table. We&apos;ll quote the floor.</TextReveal>
          </h1>
          <p className="co-lead max-w-[56ch]">
            Pick a system, a configuration and a size, then the top, the legs and anything that
            goes with them. The drawing follows every choice, and the finished specification
            goes to us with the part numbers already on it.
          </p>
        </Reveal>
      </section>

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
