"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { MobilePeek } from "@/components/common/mobile-peek";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/**
 * Products the specification photographs and details but gives no size table or
 * component schedule for. Kept out of the configurator so nothing on the page implies a
 * size or a schedule the manufacturer has not published.
 *
 * Presented as plates on the page ground rather than as cards: the renders are shot on
 * white, so `mix-blend-multiply` drops their background out and a frame would only put
 * it back.
 */
export function SeriesGalleryStrip() {
  const { series } = useSeriesConfigurator();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const gallery = series.gallery;
  if (!gallery?.items.length) return null;

  return (
    <section className="border-b border-co-border">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(58px,7vw,116px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(34px,4.4vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
          <Reveal>
            <p className="mb-4 text-[10.5px] font-semibold uppercase tracking-[0.28em] text-co-placeholder">
              {gallery.eyebrow}
            </p>
            <h2 className="max-w-[22ch] font-display text-[clamp(30px,4vw,54px)] font-medium leading-[1.0] tracking-[-0.038em]">
              {gallery.heading}
            </h2>
          </Reveal>
          {gallery.blurb ? (
            <Reveal step={1}>
              <p className="max-w-[46ch] text-[15.5px] font-light leading-relaxed text-co-muted">
                {gallery.blurb}
              </p>
            </Reveal>
          ) : null}
        </div>

        <MobilePeek peek={2} total={gallery.items.length} noun="products">
          <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-x-[clamp(18px,2.6vw,44px)] gap-y-[clamp(30px,3.6vw,58px)] p-0">
            {gallery.items.map((item, index) => (
              <Reveal as="li" key={item.name} step={index}>
                <button
                  type="button"
                  aria-label={`Open ${item.name} at full size`}
                  onClick={() => setOpenAt(index)}
                  className="group block w-full cursor-zoom-in bg-transparent p-0 text-left"
                >
                  <span className="relative block aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 25vw, 50vw"
                      className="object-contain mix-blend-multiply transition-transform duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                    />
                  </span>

                  {/* Hairline under the plate carries the hover, so nothing is framed. */}
                  <span
                    aria-hidden
                    className="mt-[clamp(12px,1.4vw,18px)] block h-px w-full origin-left scale-x-100 bg-co-border transition-colors duration-500 group-hover:bg-co-ink"
                  />

                  <span className="mt-3 flex items-baseline gap-3">
                    <h3 className="font-display text-[clamp(16px,1.35vw,19px)] font-medium leading-tight tracking-[-0.025em]">
                      {item.name}
                    </h3>
                    <span
                      aria-hidden
                      className="ml-auto shrink-0 font-mono text-[10.5px] tabular-nums text-co-placeholder"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </span>
                  <p className="mt-1.5 text-[13px] font-light leading-relaxed text-co-muted">
                    {item.note}
                  </p>
                </button>
              </Reveal>
            ))}
          </ul>
        </MobilePeek>

        <p className="mt-[clamp(26px,3vw,40px)] border-t border-co-border pt-5 text-[12.5px] font-light leading-relaxed text-co-placeholder">
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
