import type { Metadata } from "next";
import Image from "next/image";
import { CollectionActions } from "@/components/catalog/collection-actions";
import { CtaBand } from "@/components/common/cta-band";
import { SectionHeading } from "@/components/common/section-heading";
import { DimensionLine } from "@/components/ui/dimension-line";
import { FigureCaption } from "@/components/ui/figure-caption";
import { RegistrationCross } from "@/components/ui/registration-cross";
import { Reveal } from "@/components/ui/scroll-reveal";
import { SpecRows, type SpecRow } from "@/components/ui/spec-rows";
import { catalog, type Collection } from "@/lib/catalog";
import { collectionPhoto } from "@/lib/photos";
import { findSeries, rangeLabel, spanLabel, type SeriesDefinition } from "@/lib/series";
import { itemListJsonLd } from "@/lib/seo/structured-data";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { PageHero } from "@/components/common/page-hero";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Two desking systems, specified to the millimetre — STRETCH S on a fixed beam chassis and STRETCH V on an adjustable one.",
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Collections",
    description:
      "Two desking systems, specified to the millimetre — STRETCH S on a fixed beam chassis and STRETCH V on an adjustable one.",
    url: "/collections",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Collections",
    description:
      "Two desking systems, specified to the millimetre — STRETCH S on a fixed beam chassis and STRETCH V on an adjustable one.",
  },
};

/** Configuration names listed in an entry's "Includes" row before it says "+N more". */
const INCLUDES_SHOWN = 4;

/** Two-digit ordinal, so the index never changes width as it counts. */
function pad(value: number): string {
  return String(value).padStart(2, "0");
}

interface Entry {
  collection: Collection;
  series: SeriesDefinition | null;
}

function includesLabel(series: SeriesDefinition): string {
  const names = series.configs.slice(0, INCLUDES_SHOWN).map((config) => config.short);
  const rest = series.configs.length - INCLUDES_SHOWN;
  return rest > 0 ? `${names.join(" · ")} · +${rest} more` : names.join(" · ");
}

/**
 * Every row is read off the series definition, so this page can never quote a span or a
 * height the configurator does not offer. A collection without a series definition
 * shows only what the collection itself states.
 */
function entryRows({ collection, series }: Entry): SpecRow[] {
  if (!series) return [{ k: "Type", v: collection.kicker }];
  return [
    { k: "Type", v: collection.kicker },
    { k: "Configurations", v: pad(series.configs.length) },
    { k: "Span", v: spanLabel(series.configs) },
    { k: "Working height", v: `${series.workingHeightMm}\u00A0mm` },
    { k: "Includes", v: includesLabel(series) },
  ];
}

/**
 * One system as a drawing-set figure: the studio cut-out with its span and working
 * height drawn on, then the wordmark, spec rows and the configure action.
 *
 * The render is a cut-out, so it composites with `co-cutout` (multiply + feather) and
 * wipes in via `co-reveal` on the image itself. Nothing around it may carry a clip-path,
 * filter, opacity or transform — that would isolate the blend and put the photo's white
 * frame back as a box — which is why this figure is not wrapped in a `Reveal`.
 */
function SeriesEntry({ entry, index }: { entry: Entry; index: number }) {
  const { collection, series } = entry;
  const href = `/collections/${collection.slug}`;
  const photo = collectionPhoto[collection.slug];
  // The config the collection render actually shows, so the caption names it rather
  // than describing it.
  const shown = series?.configs.find((config) => config.image === photo);
  const caption = series
    ? `${series.wordmark} — ${(shown?.name ?? collection.kicker).toLowerCase()}`
    : collection.slotHint;

  return (
    <article className="grid grid-cols-1 gap-y-10 border-b border-co-border py-[clamp(48px,6vw,96px)] last:border-b-0 lg:grid-cols-12 lg:items-center lg:gap-x-0">
      <figure className="relative text-co-ink lg:col-span-7 lg:pr-[clamp(24px,3.5vw,56px)]">
        <div className="relative pr-8 sm:pr-12">
          <RegistrationCross className="-left-1 -top-6" />
          <RegistrationCross className="-top-6 right-0" />

          {photo ? (
            <div className="relative aspect-[7/4]">
              <Image
                src={photo}
                alt={shown?.imageAlt ?? collection.name}
                fill
                sizes="(min-width: 1024px) 52vw, 100vw"
                data-reveal
                className="co-cutout co-reveal object-contain"
              />
            </div>
          ) : null}

          {series ? (
            <DimensionLine
              axis="y"
              label={`${series.workingHeightMm} H`}
              className="absolute bottom-[14%] right-0 top-[14%] sm:right-2"
            />
          ) : null}
        </div>

        {series ? (
          <DimensionLine
            label={spanLabel(series.configs)}
            className="mt-3 w-[calc(100%-2rem)] sm:w-[calc(100%-3rem)]"
          />
        ) : null}

        <FigureCaption n={index + 1} className="mt-5">
          {caption}
        </FigureCaption>
      </figure>

      <Reveal className="flex flex-col lg:col-span-5">
        <p className="co-eyebrow">
          {pad(index + 1)} — {collection.kicker}
        </p>
        <h3 className="co-h1 mt-4 text-[clamp(38px,5vw,72px)]">
          {series?.wordmark ?? collection.name}
        </h3>
        <p className="co-lead mt-6 max-w-[44ch]">{collection.blurb}</p>
        <SpecRows rows={entryRows(entry)} className="mt-8" />
        <CollectionActions name={collection.name} href={href} className="mt-8" />
      </Reveal>
    </article>
  );
}

export default async function CollectionsPage() {
  const collections = await catalog.getCollections();
  const entries: Entry[] = collections.map((collection) => ({
    collection,
    series: findSeries(collection.slug),
  }));

  const allSeries = entries.flatMap((entry) => (entry.series ? [entry.series] : []));
  const allConfigs = allSeries.flatMap((series) => series.configs);
  const workingHeight = rangeLabel(allSeries.map((series) => series.workingHeightMm));

  const heroRows: SpecRow[] = [
    { k: "Systems", v: pad(entries.length) },
    { k: "Configurations", v: pad(allConfigs.length) },
    { k: "Span", v: spanLabel(allConfigs) },
    { k: "Working height", v: `${workingHeight}\u00A0mm` },
    { k: "Pricing", v: "Price on request" },
  ];

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

      <PageHero
        eyebrow="Collections — Desking systems"
        title="Two desking systems, one working height."
        titleClassName="max-w-[14ch]"
        lead={
          <>
            Both run at {workingHeight}mm, so tops sit flush wherever two configurations meet,
            and both are built from a short element set rather than one-off parts. Pick a
            system, then configure the table.
          </>
        }
        aside={<SpecRows rows={heroRows} />}
      />

      {/* Top padding only: the last entry's own padding is the section's foot. */}
      <section className="co-shell pt-[clamp(64px,8vw,120px)]">
        <SectionHeading
          eyebrow="01 / Systems"
          title="Pick a chassis."
          blurb="Each system is one chassis and a short element set. Choose a configuration, a length and a depth — the quote follows the specification, not the other way round."
          className="mb-0"
        />
        {entries.map((entry, index) => (
          <SeriesEntry key={entry.collection.slug} entry={entry} index={index} />
        ))}
      </section>

      <CtaBand
        heading="Not sure which chassis?"
        body="Send the floor plan and the headcount. We will tell you which system fits and quote it to the millimetre."
        subject="Desking systems"
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
