import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BrandLogo } from "@/lib/brand-logos";

interface BrandMarqueeProps {
  brands: BrandLogo[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  const track = [...brands, ...brands];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max items-center gap-6 py-2 animate-co-marquee group-hover:[animation-play-state:paused]">
        {track.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="flex h-24 w-52 shrink-0 items-center justify-center bg-white p-6"
          >
            <Image
              src={brand.src}
              alt={brand.name}
              width={brand.width}
              height={brand.height}
              style={{ width: "auto", height: "auto" }}
              className={cn("max-h-12 max-w-full object-contain", brand.invert && "invert")}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
