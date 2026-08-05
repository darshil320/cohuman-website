interface BrandMarqueeProps {
  brands: readonly string[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  const track = [...brands, ...brands];

  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max gap-16 py-2 animate-co-marquee group-hover:[animation-play-state:paused]">
        {track.map((brand, i) => (
          <span
            key={`${brand}-${i}`}
            className="whitespace-nowrap font-display text-[clamp(24px,3vw,36px)] font-medium tracking-tight text-co-panel-fg/70"
          >
            {brand}
          </span>
        ))}
      </div>
    </div>
  );
}
