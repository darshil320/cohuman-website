import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionCard } from "@/components/collections/collection-card";
import { CtaBand } from "@/components/common/cta-band";
import { EnquireButton } from "@/components/common/enquire-button";
import { PieceGallery, type GalleryImage } from "@/components/pieces/piece-gallery";
import { PieceDetails } from "@/components/pieces/piece-details";
import { Button } from "@/components/ui/button";
import { catalog, pieceImages, pieceLeadImage, pieceSizeLabel, type Piece } from "@/lib/catalog";
import { buildCollectionMenu, type CollectionGroup } from "@/lib/catalog/collection-menu";
import { ALL_SERIES } from "@/lib/series";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";
import { SpecSheetButton } from "@/components/common/spec-sheet-button";

/**
 * One product — a PM x Cohuman piece or a chair — after amardeepdesign.com's product page,
 * kept to Signal: the name and one size line beside a large gallery, then the catalogue's
 * one sentence beside a few collapsed rows (about, dimensions, versions, finish), then
 * the rest of its group as pictures. Little text up top; the detail is there to open.
 */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const pieces = await catalog.getPieces();
  return pieces.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const piece = await catalog.getPiece(slug);
  if (!piece) return {};
  const title = `${piece.name} — ${piece.type}`;
  return {
    title,
    description: piece.tagline,
    alternates: { canonical: `/products/${piece.slug}` },
    openGraph: {
      title: `${title} · ${siteConfig.name}`,
      description: piece.tagline,
      url: `/products/${piece.slug}`,
      images: [pieceLeadImage(piece).src],
    },
  };
}

function galleryImages(piece: Piece): GalleryImage[] {
  return [
    ...(piece.scene ? [{ ...piece.scene, label: "In a room", kind: "scene" as const }] : []),
    ...piece.views.map((view) => ({ ...view, kind: "cutout" as const })),
  ];
}

function productJsonLd(piece: Piece) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} ${piece.name}`,
    description: `${piece.tagline} ${piece.about}`,
    brand: { "@type": "Brand", name: siteConfig.name },
    category: piece.type,
    image: pieceImages(piece).map((image) => `${siteConfig.url}${image.src}`),
    ...(piece.size
      ? {
          width: { "@type": "QuantitativeValue", value: Math.max(...piece.size.w), unitCode: "MMT" },
          depth: { "@type": "QuantitativeValue", value: Math.max(...piece.size.d), unitCode: "MMT" },
          height: { "@type": "QuantitativeValue", value: Math.max(...piece.size.h), unitCode: "MMT" },
        }
      : {}),
  };
}

function RelatedRail({ group, current }: { group: CollectionGroup; current: string }) {
  const items = group.items.filter((item) => item.slug !== current);
  if (!items.length) return null;
  return (
    <section className="co-shell co-section">
      <div className="flex items-baseline justify-between gap-6 border-b border-co-ink pb-4">
        <h2 className="co-h2">
          More from {group.label}{" "}
          <span className="co-data align-top text-co-muted-2">({String(items.length).padStart(2, "0")})</span>
        </h2>
        <Button asChild variant="link" arrow>
          <Link href={`/collections#${group.id}`}>View all</Link>
        </Button>
      </div>
      <ul className="co-rail mt-8 list-none p-0 md:grid md:grid-cols-3 md:gap-x-6 md:gap-y-10 lg:grid-cols-4">
        {items.map((item) => (
          <li key={item.slug}>
            <CollectionCard item={item} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 80vw" />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const [piece, collections, pieces] = await Promise.all([
    catalog.getPiece(slug),
    catalog.getCollections(),
    catalog.getPieces(),
  ]);
  if (!piece) notFound();

  const groups = buildCollectionMenu({ collections, pieces, series: ALL_SERIES });
  const group = groups.find((g) => g.id === piece.group);
  const groupLabel = group?.label ?? "Collections";

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(piece)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Collections", path: "/collections" },
              { name: groupLabel, path: `/collections#${piece.group}` },
              { name: piece.name },
            ]),
          ),
        }}
      />

      {/* A — name and size beside the gallery. */}
      <section className="co-shell grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-8 pb-[clamp(40px,5vw,72px)] pt-[clamp(24px,3vw,40px)] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)]">
        <div className="flex flex-col lg:py-6">
          <nav aria-label="Breadcrumb" className="co-eyebrow flex flex-wrap items-center gap-2">
            <Link href="/collections" className="hover:text-co-ink">
              Collections
            </Link>
            <span aria-hidden>/</span>
            <Link href={`/collections#${piece.group}`} className="hover:text-co-ink">
              {groupLabel}
            </Link>
          </nav>

          <p className="co-eyebrow mt-[clamp(32px,6vw,96px)]">{piece.type}</p>
          <h1 className="co-display mt-3 text-[clamp(48px,7vw,112px)]">{piece.name}</h1>
          <p className="mt-4 font-heading text-[clamp(20px,2vw,30px)] font-semibold leading-[1.2] tracking-[-0.01em] text-co-muted-2">
            {piece.size
              ? pieceSizeLabel(piece.size)
              : piece.parts
                ? piece.parts.map((part) => part.label).join(" · ")
                : (piece.availableAs?.join(" · ") ?? piece.type)}
          </p>
          {piece.size?.note ? <p className="co-data mt-2 text-co-muted-2">{piece.size.note}</p> : null}

          <div data-print="hide" className="mt-10 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
            <EnquireButton subject={`${piece.name} — ${piece.type}`}>Get a quote</EnquireButton>
            <Button asChild variant="secondary">
              <Link href={`/collections#${piece.group}`}>All {groupLabel}</Link>
            </Button>
            <SpecSheetButton title={`${piece.name} — ${piece.type}`} />
          </div>
        </div>

        <PieceGallery images={galleryImages(piece)} name={piece.name} />
      </section>

      {/* B — the catalogue's one sentence, and the detail folded away beside it. */}
      <section className="border-y border-co-border bg-co-bg-alt">
        <div className="co-shell grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-10 py-[clamp(48px,6vw,96px)] lg:grid-cols-2">
          <p className="max-w-[24ch] font-heading text-[clamp(26px,3vw,44px)] font-semibold leading-[1.18] tracking-[-0.015em] text-co-ink">
            {piece.tagline}
          </p>
          <PieceDetails piece={piece} />
        </div>
      </section>

      {/* C — named versions, where the catalogue draws them. */}
      {piece.versions?.length ? (
        <section className="co-shell co-section">
          <h2 className="co-h2 border-b border-co-ink pb-4">{piece.name} versions</h2>
          <ul className="co-rail mt-8 list-none p-0 md:grid md:grid-cols-4 md:gap-6">
            {piece.versions.map((version) => (
              <li key={version.src}>
                <figure>
                  <span className="relative block aspect-[3/4] bg-co-bg-alt">
                    <Image
                      src={version.src}
                      alt={version.alt}
                      fill
                      sizes="(min-width: 768px) 24vw, 80vw"
                      className="co-cutout object-contain p-[8%]"
                    />
                  </span>
                  <figcaption className="co-data mt-3 text-co-ink">{version.label}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {group ? <RelatedRail group={group} current={piece.slug} /> : null}

      <CtaBand
        tone="light"
        heading={`Specify ${piece.name} for your floor.`}
        body={`Tell us the room and the quantity. A real specification comes back from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
