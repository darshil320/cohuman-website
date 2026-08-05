"use client";

import Image from "next/image";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

/**
 * Products the specification photographs and details but gives no size table or
 * component schedule for. Kept out of the configurator so nothing on the page implies a
 * size or a schedule the manufacturer has not published.
 */
export function SeriesGalleryStrip() {
  const { series } = useSeriesConfigurator();
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
              <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(100%_90%_at_50%_10%,#FFFFFF_0%,#F8F6F1_60%,#EFECE4_100%)]">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-contain p-3 mix-blend-multiply"
                />
              </div>
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
      </div>
    </section>
  );
}
