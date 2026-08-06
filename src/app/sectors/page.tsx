import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/common/cta-band";
import { catalog } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-assets";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Beyond the office floor — executive cabins, hospital and clinic furniture, and premium residential interiors, made in the same Surat workshop.",
};

export default async function SectorsPage() {
  const sectors = await catalog.getSectors();

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <Reveal className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Sectors
          </p>
          <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            <TextReveal>One workshop. Four kinds of building.</TextReveal>
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            The desking systems are what most people come for, but the same machines, the
            same finishes and the same installation crews serve three other briefs — a
            director&apos;s cabin, a hospital floor, and a house. Each is quoted by the room.
          </p>
        </Reveal>
      </section>

      <StaggerContainer className="mx-auto grid max-w-[1320px] gap-px border-b border-co-border bg-co-border px-0 sm:grid-cols-2 lg:grid-cols-3">
        {sectors.map((sector) => {
          // The lead photograph appears the moment the file lands in `public/`.
          const lead = sector.photos.find((photo) => publicFileExists(photo.src));
          return (
            <StaggerItem key={sector.slug} className="bg-co-bg">
              <Link
                href={`/sectors/${sector.slug}`}
                className="group flex h-full flex-col p-[clamp(24px,3vw,36px)] transition-colors hover:bg-co-bg-alt"
              >
                <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-co-bg-alt">
                  {lead ? (
                    <Image
                      src={lead.src}
                      alt={lead.alt}
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                    />
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold uppercase tracking-[0.14em] text-co-placeholder">
                      Photography to come
                    </span>
                  )}
                </div>
                <h2 className="mb-1.5 font-display text-[clamp(22px,2.4vw,30px)] font-medium leading-tight tracking-tight">
                  {sector.name}
                </h2>
                <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-co-faint">
                  {sector.kicker}
                </p>
                <p className="mb-6 text-[15px] font-light leading-relaxed text-co-muted">
                  {sector.blurb}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 text-[14px] font-semibold text-co-ink">
                  What we make for it
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </StaggerItem>
          );
        })}

        {/* The desking systems are a sector too — this is where most enquiries start. */}
        <StaggerItem className="bg-co-bg">
          <Link
            href="/collections"
            className="group flex h-full flex-col justify-between p-[clamp(24px,3vw,36px)] transition-colors hover:bg-co-bg-alt"
          >
            <div>
              <p className="mb-3.5 text-[13px] font-semibold uppercase tracking-[0.11em] text-co-green">
                Office
              </p>
              <h2 className="mb-3 font-display text-[clamp(22px,2.4vw,30px)] font-medium leading-tight tracking-tight">
                Desking systems
              </h2>
              <p className="text-[15px] font-light leading-relaxed text-co-muted">
                STRETCHS and STRETCH — configurable beam chassis, specified to the
                millimetre and quoted off a component schedule.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-co-ink">
              Featured collections
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </StaggerItem>
      </StaggerContainer>

      <CtaBand
        heading="Different building, same question."
        body="Send the floor plan, the ward list or the room sizes. You get back a schedule and a drawing, not a price list."
        subject="Sector enquiry"
      />
    </div>
  );
}
