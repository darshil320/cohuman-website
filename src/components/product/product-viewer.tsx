"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

export interface ProductImage {
  src: string;
  alt: string;
  /** Short name for the thumbnail, e.g. "In a room", "Front". */
  label: string;
  /** A room shot fills the frame; a render on white multiplies into it. */
  kind: "scene" | "cutout";
}

/**
 * The product page's picture, laid out like the Stretch S / V viewer: one large frame,
 * and directly under it a plain grid of thumbnails (no carousel, no arrows). Clicking a
 * thumbnail swaps the picture in place; nothing flies and the page does not move.
 *
 * Every picture is shown whole, never cropped to the frame. Only the current picture is mounted, so a range with a dozen photographs loads one.
 * Selected = ink frame + ink bar + `aria-pressed`; no green (the header's dots are this
 * screen's only signal).
 */
export function ProductViewer({ images, name }: { images: readonly ProductImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const current = images[index] ?? images[0];
  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden border border-co-border bg-co-bg-alt sm:aspect-[16/10]">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          quality={90}
          sizes="(min-width: 1440px) 900px, (min-width: 1024px) 62vw, 100vw"
          // Room shots are shown whole too (`object-contain`): cropping to the frame cut
          // the legs off Stretch R / E (Nov 2026 review) — the legs are the product.
          className={current.kind === "cutout" ? "co-cutout object-contain p-[6%]" : "object-contain"}
        />
      </div>
      <p className="co-data mt-3 text-co-muted-2" aria-live="polite">
        {current.label}
      </p>

      {images.length > 1 ? (
        <div data-print="hide" className="mt-6">
          <p className="co-eyebrow">Views — pick one to see it above</p>
          <div
            role="group"
            aria-label={`${name} pictures`}
            className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-6"
          >
            {images.map((image, i) => {
              const on = i === index;
              return (
                <button
                  key={image.src}
                  type="button"
                  title={image.label}
                  aria-pressed={on}
                  aria-label={`Show ${image.label}${on ? ", shown above" : ""}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "co-hit group relative flex min-w-0 flex-col border bg-co-bg p-2 text-left transition-colors duration-(--duration-press)",
                    on ? "border-co-ink" : "border-co-border hover:border-co-ink hover:bg-co-bg-alt",
                  )}
                >
                  <span className="relative block h-[64px] w-full overflow-hidden sm:h-[72px]">
                    <Image
                      src={image.src}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 160px, 33vw"
                      className={image.kind === "cutout" ? "co-cutout object-contain" : "object-cover"}
                    />
                  </span>
                  <span
                    className={cn(
                      "co-data mt-2 line-clamp-2 min-h-[2lh] leading-[1.3]",
                      on ? "text-co-ink" : "text-co-muted-2 group-hover:text-co-ink",
                    )}
                  >
                    {image.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-[2px] origin-left bg-co-ink transition-transform duration-300 ease-(--ease-enter)",
                      on ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
