import type { Metadata } from "next";
import Image from "next/image";
import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { SectionHeading } from "@/components/common/section-heading";
import { SpecRows } from "@/components/ui/spec-rows";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  BOARD_SHADES,
  EDGE_DETAILS,
  FRAME_SHADES,
  SCREEN_POSITIONS,
  TECHNICAL_SPEC,
  TOP_CORES,
  type Swatch,
} from "@/lib/finishes";
import { SHARE_IMAGE } from "@/lib/seo/share-image";

const DESCRIPTION =
  "Tops and finishes for every Cohuman system: seven pre-laminated board shades, veneer, frame colours by system, top cores, edges and screen positions.";

export const metadata: Metadata = {
  title: "Tops & finishes",
  description: DESCRIPTION,
  alternates: { canonical: "/finishes" },
  openGraph: { title: "Tops & finishes", description: DESCRIPTION, url: "/finishes", images: [SHARE_IMAGE] },
  twitter: { title: "Tops & finishes", description: DESCRIPTION },
};

function SwatchTile({ swatch, sizes }: { swatch: Swatch; sizes: string }) {
  return (
    <figure>
      <span className="relative block aspect-square border border-co-border bg-co-bg-alt">
        {/*
          Served as-is: the swatch files are tiny catalogue crops (under 20 KB), and the
          image optimiser hung on several of them.
        */}
        <Image
          src={swatch.src}
          alt={`${swatch.name} swatch`}
          fill
          sizes={sizes}
          unoptimized
          className="object-cover"
        />
      </span>
      <figcaption className="mt-2.5">
        {swatch.code ? <span className="co-data block text-co-muted-2">{swatch.code}</span> : null}
        <span className="block text-[14px] font-medium leading-snug text-co-ink">{swatch.name}</span>
      </figcaption>
    </figure>
  );
}

/** A short list as hairline rows: name, and a note where the catalogue gives one. */
function OptionList({ items }: { items: readonly { name: string; note?: string }[] }) {
  return (
    <ul className="list-none border-t border-co-ink p-0">
      {items.map((item) => (
        <li key={item.name} className="border-b border-co-border py-3.5">
          <span className="block font-heading text-[17px] font-semibold text-co-ink">{item.name}</span>
          {item.note ? <span className="mt-1 block text-[14px] leading-relaxed text-co-muted">{item.note}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/**
 * Tops & finishes — the catalogue's shared reference page, the step-02 / step-03 detail
 * of "Build your workstation". Swatches first; the technical rows last and short.
 */
export default function FinishesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Tops & finishes"
        title="Choose the top, the edge and the shade."
        titleClassName="max-w-[18ch]"
        lead="One reference for every system. Shades as printed may vary from the actual finish; ask us for physical samples."
      />

      <section className="co-shell co-section">
        <SectionHeading
          eyebrow="01 / Board"
          title="Pre-laminated board shades."
          blurb="Seven shades for the desktop. Veneer finish as per selection."
        />
        <StaggerContainer className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-7">
          {BOARD_SHADES.map((swatch) => (
            <StaggerItem key={swatch.src}>
              <SwatchTile swatch={swatch} sizes="(min-width: 1024px) 13vw, (min-width: 640px) 24vw, 32vw" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      <section className="border-y border-co-ink bg-co-bg-alt">
        <div className="co-shell co-section">
          <SectionHeading
            eyebrow="02 / Frame"
            title="Metal powder-coat shades."
            blurb="Each system has its own frame colours."
          />
          <div className="grid gap-y-10">
            {FRAME_SHADES.map((group) => (
              <div
                key={group.systems}
                className="grid grid-cols-1 gap-x-[clamp(20px,2.5vw,40px)] gap-y-4 border-t border-co-border pt-5 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
              >
                <div>
                  <h3 className="co-h3">{group.systems}</h3>
                  <p className="co-data mt-1 text-co-muted-2">{group.note}</p>
                </div>
                <ul className="grid list-none grid-cols-3 gap-4 p-0 sm:grid-cols-4 lg:grid-cols-6">
                  {group.shades.map((swatch) => (
                    <li key={swatch.src}>
                      <SwatchTile swatch={swatch} sizes="(min-width: 1024px) 10vw, 30vw" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="co-shell co-section">
        <SectionHeading eyebrow="03 / Build" title="Core, edge and screen." />
        <div className="grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-10 md:grid-cols-3">
          <div>
            <p className="co-eyebrow mb-3">Table top core</p>
            <OptionList items={TOP_CORES.map((name) => ({ name }))} />
          </div>
          <div>
            <p className="co-eyebrow mb-3">Edge detailing</p>
            <OptionList items={EDGE_DETAILS.map((name) => ({ name }))} />
          </div>
          <div>
            <p className="co-eyebrow mb-3">Screen partitions</p>
            <OptionList items={SCREEN_POSITIONS} />
          </div>
        </div>
      </section>

      <section className="co-shell pb-[clamp(64px,8vw,120px)]">
        <SectionHeading
          eyebrow="04 / Specification"
          title="Technical specifications."
          blurb="Values are from the Stretch S and Stretch V specifications. Data for the other collections is to come."
        />
        <SpecRows rows={TECHNICAL_SPEC} />
      </section>

      <CtaBand
        heading="See the shades in person."
        body="Physical samples of every board and frame shade are at the Surat showroom, or ask us to send a set with your quote."
        subject="Finish samples"
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
