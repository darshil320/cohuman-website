import type { Metadata } from "next";
import { CollectionCard } from "@/components/collections/collection-card";
import { CtaBand } from "@/components/common/cta-band";
import { PageHero } from "@/components/common/page-hero";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { catalog } from "@/lib/catalog";
import { buildCollectionMenu } from "@/lib/catalog/collection-menu";
import { ALL_SERIES } from "@/lib/series";
import { SHARE_IMAGE } from "@/lib/seo/share-image";
import { itemListJsonLd } from "@/lib/seo/structured-data";

const COLLECTIONS_DESCRIPTION =
  "Every Cohuman collection in one place: the PM x Cohuman designer pieces, the workstation systems and the seating.";

export const metadata: Metadata = {
  title: "Collections",
  description: COLLECTIONS_DESCRIPTION,
  alternates: { canonical: "/collections" },
  openGraph: {
    title: "Collections",
    description: COLLECTIONS_DESCRIPTION,
    url: "/collections",
    images: [SHARE_IMAGE],
  },
  twitter: {
    title: "Collections",
    description: COLLECTIONS_DESCRIPTION,
  },
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Collections — pictures first (Nov 2026 review). One section per group, in the
 * catalogue's order, each a grid of picture cards with a name and one line; the detail
 * lives on each product's own page. Section ids match the header panel's links
 * (`/collections#pm-x-cohuman`).
 */
export default async function CollectionsPage() {
  const [collections, pieces] = await Promise.all([catalog.getCollections(), catalog.getPieces()]);
  const groups = buildCollectionMenu({ collections, pieces, series: ALL_SERIES });

  const itemList = itemListJsonLd(
    "Cohuman collections",
    "/collections",
    groups.flatMap((group) => group.items.map((item) => ({ name: item.title, path: item.href }))),
  );

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />

      <PageHero
        eyebrow="Collections"
        title="Office furniture and beyond."
        titleClassName="max-w-[16ch]"
        lead="Designer pieces, workstation systems and seating. Pick one to see it closer."
      />

      {groups.map((group, i) => (
        <section key={group.id} id={group.id} className="co-shell co-section scroll-mt-[96px]">
          <div className="mb-[clamp(28px,3vw,44px)] grid grid-cols-1 items-end gap-4 border-b border-co-ink pb-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
            <div>
              <p className="co-eyebrow">
                {pad(i + 1)} / {group.label}
              </p>
              <h2 className="co-display mt-3 text-[clamp(40px,5vw,80px)]">
                {group.label}{" "}
                <span className="co-data align-top text-co-muted-2">({pad(group.items.length)})</span>
              </h2>
            </div>
            <p className="max-w-[46ch] text-[15px] leading-[1.55] text-co-ink-soft lg:pb-2">{group.blurb}</p>
          </div>

          <StaggerContainer className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
            {group.items.map((item) => (
              <StaggerItem key={item.slug}>
                <CollectionCard item={item} sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 48vw" />
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>
      ))}

      <CtaBand
        heading="Not sure where to start?"
        body="Send the floor plan and the headcount. We will tell you which pieces fit and quote them."
        subject="Collections"
        secondary={{ label: "Book a showroom visit", href: "/contact" }}
      />
    </div>
  );
}
