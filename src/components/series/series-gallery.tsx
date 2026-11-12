"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { MobilePeek } from "@/components/common/mobile-peek";
import { SectionHeading } from "@/components/common/section-heading";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow } from "@/lib/series";

/**
 * Products the specification photographs and details but gives no size table or
 * component schedule for. Kept out of the configurator so nothing on the page implies a
 * size or a schedule the manufacturer has not published.
 *
 * Every other render on the site carries a dimension line; these deliberately do not,
 * because the data holds no size for them. The caption says so instead — a missing
 * dimension is stated, never filled in.
 *
 * The renders are cut-outs shot on white, so they sit on the page ground with
 * `co-cutout` rather than in frames. Their reveal wipe is on the image itself: a
 * clip-path on any wrapper would isolate the multiply and bring the white box back.
 */
export function SeriesGalleryStrip() {
  const { series } = useSeriesConfigurator();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const gallery = series.gallery;
  if (!gallery?.items.length) return null;

  return (
    <section className="co-section">
      <div className="co-shell">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "gallery", gallery.eyebrow)}
          title={gallery.heading}
          blurb={gallery.blurb}
        />

        <MobilePeek peek={2} total={gallery.items.length} noun="products">
          <ul className="grid list-none grid-cols-1 gap-x-[clamp(18px,2.6vw,44px)] gap-y-[clamp(36px,4vw,64px)] p-0 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.items.map((item, index) => (
              <li key={item.name}>
                <figure>
                  <button
                    type="button"
                    aria-label={`Open ${item.name} at full size`}
                    onClick={() => setOpenAt(index)}
                    className="group block w-full cursor-zoom-in bg-transparent p-0 text-left"
                  >
                    <span className="relative block aspect-[4/3] w-full">
                      <Image
                        src={item.image}
                        alt={item.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        data-reveal
                        className="co-cutout co-reveal object-contain"
                      />
                    </span>
                    {/* The rule under the plate carries the hover — ink, never a fade. */}
                    <span
                      aria-hidden
                      className="mt-3 block h-px w-full bg-co-border transition-colors duration-150 group-hover:bg-co-ink group-focus-visible:bg-co-ink"
                    />
                  </button>

                  <figcaption className="mt-3">
                    <span className="co-data block text-co-muted-2">
                      <span className="text-co-ink">{item.name}</span>
                    </span>
                    <span className="mt-2 block text-[14px] leading-[1.55] text-co-muted">{item.note}</span>
                    <span className="co-eyebrow mt-3 block">Photographed — sizes on request</span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </MobilePeek>

        <p className="mt-[clamp(30px,3.4vw,48px)] max-w-[72ch] border-t border-co-border pt-5 text-[13px] leading-[1.55] text-co-muted">
          Quoted from the drawing — send us the space and we size these against the rest of
          the run.
        </p>

        <ImageLightbox
          items={gallery.items.map((item) => ({
            src: item.image,
            alt: item.imageAlt,
            caption: `${item.name} — ${item.note}`,
          }))}
          index={openAt ?? 0}
          open={openAt !== null}
          onClose={() => setOpenAt(null)}
          onIndexChange={setOpenAt}
        />
      </div>
    </section>
  );
}
