"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "@/components/common/image-lightbox";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/**
 * Products the specification photographs and details but gives no size table or
 * component schedule for. Kept out of the configurator so nothing on the page implies a
 * size or a schedule the manufacturer has not published.
 */
export function SeriesGalleryStrip() {
  const { series } = useSeriesConfigurator();
  const [openAt, setOpenAt] = useState<number | null>(null);
  const gallery = series.gallery;
  if (!gallery?.items.length) return null;

  return (
    <section className="border-b border-co-border">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(24px,3vw,38px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
              {gallery.eyebrow}
            </p>
            <h2 className="max-w-[22ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em]">
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

        <ul className="grid list-none grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4 p-0">
          {gallery.items.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              step={index}
              className="border border-co-card-border bg-white"
            >
              <button
                type="button"
                aria-label={`Open ${item.name} at full size`}
                onClick={() => setOpenAt(index)}
                className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-white p-0"
              >
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain p-3 mix-blend-multiply transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                />
                <span
                  aria-hidden
                  className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center border border-co-card-border bg-co-bg/85 text-co-faint opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 1H1v3.5M7.5 1H11v3.5M4.5 11H1V7.5M7.5 11H11V7.5"
                      stroke="currentColor"
                      strokeWidth="1.4"
                    />
                  </svg>
                </span>
              </button>
              <div className="border-t border-co-card-border px-4 py-3.5">
                <h3 className="mb-1 font-display text-[17px] font-medium tracking-[-0.02em]">
                  {item.name}
                </h3>
                <p className="text-[13px] font-light leading-normal text-co-muted">{item.note}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <p className="mt-5 text-[12.5px] font-light leading-snug text-co-placeholder">
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
