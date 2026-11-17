import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CollectionCard } from "@/components/collections/collection-card";
import { CtaBand } from "@/components/common/cta-band";
import { ProductSpecLayout } from "@/components/product/product-spec-layout";
import type { ProductImage } from "@/components/product/product-viewer";
import { PieceDetails } from "@/components/pieces/piece-details";
import { Button } from "@/components/ui/button";
import type { SpecRow } from "@/components/ui/spec-rows";
import { WORKSPACE_WARRANTY, standardRows } from "@/components/product/spec-fields";
import { catalog, pieceImages, pieceLeadImage, pieceSizeLabel, type Piece } from "@/lib/catalog";
import { buildCollectionMenu, type CollectionGroup } from "@/lib/catalog/collection-menu";
import { ALL_SERIES } from "@/lib/series";
import { breadcrumbJsonLd } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";

/**
 * One product — a designer collab piece, a chair or Type A. It opens exactly like the
 * Stretch S / V pages (`ProductSpecLayout`): name, viewer and thumbnails on the left, the
 * ink specification panel on the right. Then the catalogue's detail folded, versions
 * where it draws them, the rest of the group, and the enquiry.
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

const mm = (values: number[]) => `${values.join(" / ")}\u00A0mm`;

/**
 * The ink panel: the Stretch S fields, "Not available" where the catalogue states
 * nothing (see `spec-fields.tsx`). Type A's three parts stand in for width / depth /
 * height. Nothing is invented.
 */
function specRows(piece: Piece, groupLabel: string): SpecRow[] {
  const { size, parts } = piece;
  return standardRows(
    {
      Type: piece.type,
      Configurations: piece.availableAs?.join(", "),
      Width: size ? mm(size.w) : undefined,
      Depth: size ? mm(size.d) : undefined,
      Height: size ? mm(size.h) : undefined,
      Seats: piece.seats,
      Finish: piece.finish ?? piece.upholstery,
      Colours: piece.colours?.join(", "),
    },
    {
      replace: parts
        ? {
            Width: parts.map((part) => ({
              k: part.label,
              v: `${pieceSizeLabel(part.size)}${part.size.note ? `, ${part.size.note}` : ""}`,
            })),
            Depth: null,
            Height: null,
          }
        : {},
      extra: [
        ...(size?.note ? [{ k: "Size shown", v: size.note }] : []),
        // Catalogue v31, p. 68: 10 years for workspace systems, 5 years for other products.
        { k: "Warranty", v: piece.group === "workstations" ? WORKSPACE_WARRANTY : "5 years" },
        { k: "Collection", v: groupLabel },
        ...(piece.designer ? [{ k: "Designed by", v: piece.designer }] : []),
      ],
    },
  );
}

function galleryImages(piece: Piece): ProductImage[] {
  return [
    ...(piece.scene ? [{ ...piece.scene, label: "In a room", kind: "scene" as const }] : []),
    ...(piece.photos ?? []).map((photo) => ({ ...photo, kind: "scene" as const })),
    ...piece.views.map((view) => ({ ...view, kind: "cutout" as const })),
    // Named versions (Ergohuman's headrest, leg rest) are pictures in the viewer and a
    // line in the panel, not a section of their own (Nov 2026 review).
    ...(piece.versions ?? []).map((version) => ({ ...version, kind: "cutout" as const })),
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

      {/* A + B — the same opening as the Stretch S / V pages: name and viewer on the
          left with the thumbnails under the picture, the ink specification panel right. */}
      <ProductSpecLayout
        eyebrow={`${groupLabel} — ${piece.type}`}
        title={piece.name}
        credit={group?.credit ?? (piece.designer ? `Designed by ${piece.designer}` : undefined)}
        lead={piece.tagline}
        images={galleryImages(piece)}
        rows={specRows(piece, groupLabel)}
        subject={`${piece.name} — ${piece.type}`}
        secondary={
          <Button asChild variant="secondaryOnDark">
            <Link href={`/collections#${piece.group}`}>All {groupLabel.toLowerCase()}</Link>
          </Button>
        }
      />

      {/* C — the catalogue's detail, folded. */}
      <section className="border-b border-co-border bg-co-bg-alt">
        <div className="co-shell grid grid-cols-1 gap-x-[clamp(28px,4vw,72px)] gap-y-10 py-[clamp(48px,6vw,96px)] lg:grid-cols-2">
          <div>
            <p className="co-eyebrow">02 / Details</p>
            <h2 className="co-h2 mt-5 max-w-[16ch]">About {piece.name}.</h2>
          </div>
          <PieceDetails piece={piece} />
        </div>
      </section>

      {group ? <RelatedRail group={group} current={piece.slug} /> : null}

      <CtaBand
        tone="light"
        heading={`Specify ${piece.name} for your floor.`}
        body={`Tell us the room and the quantity. A real specification comes back from a real person, usually inside ${siteConfig.enquiryTurnaround}.`}
      />
    </div>
  );
}
