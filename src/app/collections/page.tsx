import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CollectionActions } from "@/components/catalog/collection-actions";
import { catalog } from "@/lib/catalog";
import { findSeries } from "@/lib/series";
import { collectionPhoto } from "@/lib/photos";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { itemListJsonLd } from "@/lib/seo/structured-data";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Two desking systems, specified to the millimetre — STRETCHS on a fixed beam chassis and STRETCH on an adjustable one.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Collections",
    description:
      "Two desking systems, specified to the millimetre — STRETCHS on a fixed beam chassis and STRETCH on an adjustable one.",
    url: "/collections",
  },
  twitter: {
    title: "Collections",
    description:
      "Two desking systems, specified to the millimetre — STRETCHS on a fixed beam chassis and STRETCH on an adjustable one.",
  },
};

/** Two-digit ordinal, so the index never changes width as it counts. */
function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export default async function CollectionsPage() {
  const collections = await catalog.getCollections();

  const itemList = itemListJsonLd(
    "Cohuman desking series",
    "/collections",
    collections.map((collection) => ({
      name: collection.name,
      path: `/collections/${collection.slug}`,
      description: collection.blurb,
    })),
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }}
      />

      <section className="border-b border-co-border">
        <Reveal className="mx-auto max-w-[1320px] px-[18px] py-[clamp(52px,7vw,104px)] sm:px-6 lg:px-11">
          <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-co-placeholder">
            Featured collections
          </p>
          <h1 className="mb-6 max-w-[22ch] font-display text-[clamp(34px,5.2vw,68px)] font-medium leading-[0.99] tracking-[-0.04em]">
            <TextReveal>Two desking systems, one working height.</TextReveal>
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Both run at 720mm, so tops sit flush wherever two configurations meet and both
            are built from a short element set rather than one-off parts. Pick a system, then
            configure the table.
          </p>
        </Reveal>
      </section>

      <StaggerContainer className="mx-auto grid max-w-[1320px] gap-0 px-[18px] pb-[clamp(52px,7vw,104px)] sm:px-6 lg:px-11">
        {collections.map((collection, index) => {
          const series = findSeries(collection.slug);
          const href = `/collections/${collection.slug}`;
          // Alternating sides: the eye crosses the page between entries rather than
          // running down one rail, which is what made two entries read as two cards.
          const imageFirst = index % 2 === 0;

          return (
            <StaggerItem
              key={collection.slug}
              className="grid grid-cols-1 items-center gap-y-7 border-b border-co-border py-[clamp(40px,5.4vw,88px)] last:border-b-0 lg:grid-cols-2 lg:gap-x-[clamp(36px,5vw,96px)]"
            >
              {/*
                The renders are studio shots on white, so they composite into the page
                ground with `mix-blend-multiply` — a frame or a fill would only put the
                white back and make the entry a card again.
              */}
              <Link
                href={href}
                aria-label={`View ${collection.name}`}
                className={`group relative block aspect-[16/10] overflow-hidden ${
                  imageFirst ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Image
                  src={collectionPhoto[collection.slug]}
                  alt={collection.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-contain mix-blend-multiply transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
              </Link>

              <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-co-border pb-4">
                  <span
                    aria-hidden
                    className="font-display text-[clamp(26px,3vw,40px)] font-normal leading-none tracking-[-0.04em] tabular-nums text-co-border-strong"
                  >
                    {pad(index + 1)}
                  </span>
                  <p className="min-w-0 text-[10px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-co-placeholder">
                    {collection.kicker}
                  </p>
                  {series ? (
                    <span className="ml-auto shrink-0 whitespace-nowrap font-mono text-[11px] tabular-nums text-co-placeholder">
                      {pad(series.configs.length)} configurations
                    </span>
                  ) : null}
                </div>

                <h2 className="mb-4 font-display text-[clamp(26px,3.8vw,48px)] font-medium leading-[1.0] tracking-[-0.038em]">
                  {collection.name}
                </h2>
                <p className="mb-6 max-w-[44ch] text-[clamp(15px,1.4vw,18.5px)] font-light leading-relaxed text-co-muted">
                  {collection.blurb}
                </p>

                {series ? (
                  <ul className="mb-8 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                    {series.configs.slice(0, 5).map((config) => (
                      <li
                        key={config.slug}
                        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-co-placeholder"
                      >
                        {config.short}
                      </li>
                    ))}
                    {series.configs.length > 5 ? (
                      <li className="text-[11px] font-semibold uppercase tracking-[0.16em] text-co-border-strong">
                        +{series.configs.length - 5} more
                      </li>
                    ) : null}
                  </ul>
                ) : null}

                <CollectionActions name={collection.name} href={href} />
              </div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </div>
  );
}
