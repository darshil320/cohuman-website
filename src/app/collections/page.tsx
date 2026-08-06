import type { Metadata } from "next";
import Link from "next/link";
import { CollectionActions } from "@/components/catalog/collection-actions";
import { catalog } from "@/lib/catalog";
import { findSeries } from "@/lib/series";
import { collectionPhoto } from "@/lib/photos";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { TextReveal } from "@/components/ui/text-reveal";
import { ParallaxImage } from "@/components/ui/parallax-image";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Two desking systems, specified to the millimetre — STRETCHS on a fixed beam chassis and STRETCH on an adjustable one.",
};

export default async function CollectionsPage() {
  const collections = await catalog.getCollections();

  return (
    <div>
      <section className="border-b border-co-border bg-co-bg-alt">
        <Reveal className="mx-auto max-w-[1320px] px-[18px] py-[clamp(44px,6vw,78px)] sm:px-6 lg:px-11">
          <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green">
            Featured collections
          </p>
          <h1 className="mb-4 max-w-[22ch] font-display text-[clamp(34px,5vw,62px)] font-medium leading-[1.02] tracking-tight">
            <TextReveal>Two desking systems, one working height.</TextReveal>
          </h1>
          <p className="max-w-[58ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
            Both run at 720mm, so tops sit flush wherever two configurations meet and both
            are built from a short element set rather than one-off parts. Pick a system, then
            configure the table.
          </p>
        </Reveal>
      </section>

      <StaggerContainer className="mx-auto grid max-w-[1320px] gap-[clamp(30px,4vw,54px)] px-[18px] py-[clamp(44px,6vw,84px)] sm:px-6 lg:px-11">
        {collections.map((collection) => {
          const series = findSeries(collection.slug);
          const href = `/collections/${collection.slug}`;
          return (
            <StaggerItem
              key={collection.slug}
              className="grid grid-cols-1 items-center gap-6 border-b border-co-border pb-[clamp(30px,4vw,54px)] last:border-b-0 lg:grid-cols-2 lg:gap-12"
            >
              <Link
                href={href}
                className="group relative block aspect-[16/11] overflow-hidden bg-[radial-gradient(110%_90%_at_50%_5%,#FFFFFF_0%,#F8F6F1_55%,#EFECE4_100%)]"
              >
                <ParallaxImage
                  src={collectionPhoto[collection.slug]}
                  alt={collection.name}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
                />
              </Link>
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-co-faint">
                  {collection.kicker}
                  {series ? ` · ${series.configs.length} configurations` : null}
                </p>
                <h2 className="mb-3.5 font-display text-[clamp(28px,3.4vw,42px)] font-medium leading-[1.05] tracking-tight">
                  {collection.name}
                </h2>
                <p className="mb-5 max-w-[44ch] text-[clamp(16px,1.4vw,18.5px)] font-light leading-relaxed text-co-muted">
                  {collection.blurb}
                </p>
                {series ? (
                  <p className="mb-6 text-[14.5px] font-light text-co-muted-2">
                    <span className="text-co-faint">Includes</span>{" "}
                    {series.configs
                      .slice(0, 5)
                      .map((config) => config.short)
                      .join(" · ")}
                    {series.configs.length > 5 ? " · …" : null}
                  </p>
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
