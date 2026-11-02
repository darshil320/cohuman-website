import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CtaBand } from "@/components/common/cta-band";
import { SectionHeading } from "@/components/common/section-heading";
import { ClipReveal } from "@/components/ui/clip-reveal";
import { FigureCaption } from "@/components/ui/figure-caption";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { publicFileExists } from "@/lib/public-assets";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { itemListJsonLd } from "@/lib/seo/structured-data";
import { ALL_SERIES, spanLabel } from "@/lib/series";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Sectors",
  description:
    "Beyond the office floor — executive cabins, hospital and clinic furniture, and hotel and hospitality interiors, made in the same Surat workshop.",
  alternates: { canonical: "/sectors" },
  openGraph: {
    title: "Sectors",
    description:
      "Beyond the office floor — executive cabins, hospital and clinic furniture, and hotel and hospitality interiors, made in the same Surat workshop.",
    url: "/sectors",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Sectors",
    description:
      "Beyond the office floor — executive cabins, hospital and clinic furniture, and hotel and hospitality interiors, made in the same Surat workshop.",
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/*
  The sector index's own grid. Close to `IndexRow`'s, minus the range column: a sector is
  described, not measured, so the brief (kicker + blurb) takes that width instead. On
  phones the brief drops under the name and the arrow stays on the first line.
*/
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_24px] gap-x-4 md:grid-cols-[64px_minmax(0,1fr)_minmax(0,1.3fr)_48px] lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)_60px]";

function SectorRow({
  n,
  name,
  kicker,
  blurb,
  href,
  detail,
}: {
  n: string;
  name: string;
  kicker: string;
  blurb: string;
  href: string;
  /** A measured line under the brief, where the row has one. */
  detail?: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`${ROW_GRID} group items-start gap-y-3 border-b border-co-border py-[clamp(22px,2.6vw,34px)] transition-colors duration-150 hover:bg-co-bg-alt focus-visible:bg-co-bg-alt md:items-center`}
    >
      <span className="co-data pt-1.5 md:pt-0">{n}</span>
      <span className="co-index">
        {name}
      </span>
      <span className="col-start-2 col-end-4 row-start-2 min-w-0 md:col-auto md:row-auto">
        <span className="block text-[16px] leading-[1.45] text-co-ink">{kicker}</span>
        <span className="mt-2 block max-w-[60ch] text-[14px] leading-[1.55] text-co-muted">{blurb}</span>
        {detail ? <span className="co-data mt-3 block text-co-ink">{detail}</span> : null}
      </span>
      <span
        aria-hidden
        className="col-start-3 row-start-1 justify-self-end text-[18px] leading-none transition-transform duration-150 group-hover:translate-x-1 md:col-auto md:row-auto"
      >
        →
      </span>
    </Link>
  );
}

export default async function SectorsPage() {
  const sectors = await catalog.getSectors();

  const itemList = itemListJsonLd(
    "Sectors Cohuman supplies",
    "/sectors",
    sectors.map((sector) => ({
      name: sector.name,
      path: `/sectors/${sector.slug}`,
      description: sector.blurb,
    })),
  );

  // A sector's lead photograph appears the moment its file lands in `public/`.
  const figures = sectors.flatMap((sector) => {
    const lead = sector.photos.find((photo) => publicFileExists(photo.src));
    return lead ? [{ sector, lead }] : [];
  });

  const deskingRange = spanLabel(ALL_SERIES.flatMap((series) => series.configs));

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <PageHero
        eyebrow="Sectors"
        title="One workshop. Four kinds of building."
        lead={
          <>
            The desking systems are what most people come for, but the same machines, the same
            finishes and the same installation crews serve three other briefs — a
            director’s cabin, a hospital floor, and a house. Each is quoted by the room.
          </>
        }
      />

      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="01 / Sectors"
          title="Same workshop, different brief."
          className="mb-0"
        />
        <Reveal>
          <div aria-hidden className={`${ROW_GRID} co-eyebrow border-b border-co-border py-3.5`}>
            <span>No.</span>
            <span>Sector</span>
            <span className="hidden md:block">Brief</span>
            <span />
          </div>
          {sectors.map((sector, i) => (
            <SectorRow
              key={sector.slug}
              n={pad(i + 1)}
              name={sector.name}
              kicker={sector.kicker}
              blurb={sector.blurb}
              href={`/sectors/${sector.slug}`}
            />
          ))}
          {/* The desking systems are a sector too — this is where most enquiries start. */}
          <SectorRow
            n={pad(sectors.length + 1)}
            name="Desking systems"
            kicker="Office"
            blurb="STRETCH S and STRETCH V — configurable beam chassis, specified to the millimetre and quoted off a component schedule."
            href="/collections"
            detail={deskingRange}
          />
        </Reveal>
      </section>

      {figures.length ? (
        <section className="co-shell pb-[clamp(64px,8vw,120px)]">
          <SectionHeading eyebrow="02 / Photographs" title="On site." />
          <StaggerContainer className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {figures.map(({ sector, lead }, i) => (
              <StaggerItem key={sector.slug}>
                <Link href={`/sectors/${sector.slug}`} className="block">
                  <figure>
                    <ClipReveal className="aspect-[4/3] border border-co-border bg-co-bg-alt">
                      <Image
                        src={lead.src}
                        alt={lead.alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                        className="co-highkey object-cover"
                      />
                    </ClipReveal>
                    <FigureCaption n={i + 1} className="mt-3">
                      {sector.name}
                      {lead.caption ? `, ${lead.caption}` : ""}
                    </FigureCaption>
                  </figure>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ) : null}

      <CtaBand
        tone="light"
        heading="Different building, same question."
        body="Send the floor plan, the ward list or the room sizes. You get back a schedule and a drawing, not a price list."
        subject="Sector enquiry"
      />
    </div>
  );
}
