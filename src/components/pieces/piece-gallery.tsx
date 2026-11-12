"use client";

import Image from "next/image";
import { useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";

export interface GalleryImage {
  src: string;
  alt: string;
  label: string;
  kind: "scene" | "cutout";
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * The product page's picture: one large frame with square arrows, a counter and a strip
 * of thumbnails. The room shot is cropped to fill; the cut-outs sit on the fog panel and
 * multiply into it (`co-cutout`), so the catalogue's white backdrop never shows as a box.
 * Left/right arrow keys step through it when it has focus.
 */
export function PieceGallery({ images, name }: { images: GalleryImage[]; name: string }) {
  const [index, setIndex] = useState(0);
  const count = images.length;
  const go = (next: number) => setIndex((next + count) % count);
  const current = images[index];

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={`${name} pictures`}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="flex h-full flex-col outline-none focus-visible:ring-1 focus-visible:ring-co-ink"
    >
      <div className="relative min-h-[min(72vw,420px)] flex-1 bg-co-bg-alt lg:min-h-[520px]">
        {images.map((image, i) => (
          <Image
            key={image.src}
            src={image.src}
            alt={image.alt}
            fill
            priority={i === 0}
            sizes="(min-width: 1024px) 56vw, 100vw"
            quality={90}
            aria-hidden={i !== index}
            className={cn(
              image.kind === "cutout" ? "co-cutout object-contain p-[7%]" : "object-cover",
              i === index ? "visible" : "invisible",
            )}
          />
        ))}

        {count > 1 ? (
          <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3 sm:px-4">
            <button
              type="button"
              aria-label="Previous picture"
              onClick={() => go(index - 1)}
              className="flex h-11 w-11 items-center justify-center border border-co-ink bg-co-bg text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Next picture"
              onClick={() => go(index + 1)}
              className="flex h-11 w-11 items-center justify-center border border-co-ink bg-co-bg text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
            >
              →
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-4">
        <p className="co-data text-co-muted-2" aria-live="polite">
          {current.label}
        </p>
        <p className="co-data text-co-muted-2">
          {pad(index + 1)} / {pad(count)}
        </p>
      </div>

      <ul className="mt-3 grid list-none grid-cols-4 gap-2 p-0 sm:gap-3">
        {images.map((image, i) => (
          <li key={image.src}>
            <button
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${image.label.toLowerCase()}`}
              aria-pressed={i === index}
              className={cn(
                "relative block aspect-square w-full border bg-co-bg-alt transition-colors",
                i === index ? "border-co-ink" : "border-co-border hover:border-co-muted-2",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 12vw, 22vw"
                className={image.kind === "cutout" ? "co-cutout object-contain p-[10%]" : "object-cover"}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
