import { ALL_SERIES } from "@/lib/series";

/**
 * The manifest — a running strip of real part numbers and real millimetre spans.
 *
 * This is the section that replaces the stats strip under the hero, and it does the same
 * structural job (a half-step landing between the photograph and the first chapter)
 * without a single boastable figure. Nothing here is decoration: every code and every
 * span is read off `ALL_SERIES`, the same data the configurator quotes from, so it cannot
 * drift from what the customer is actually sold.
 *
 * Within one scroll of the hero, a visitor sees part numbers and tolerances and concludes
 * that the company is an engineering outfit. That is the whole brief.
 *
 * `aria-hidden`: a screen reader announcing forty part numbers is noise, and every one of
 * them is available as real content on /collections.
 */
function manifestEntries(): string[] {
  const entries: string[] = [];

  for (const series of ALL_SERIES) {
    for (const config of series.configs) {
      const lens = config.lens;
      const span =
        lens.length > 1
          ? `${Math.min(...lens)}–${Math.max(...lens)} mm`
          : `${lens[0]} mm`;
      entries.push(config.code, span);
    }
  }

  return entries;
}

export function ManifestTicker() {
  const entries = manifestEntries();

  return (
    <section
      aria-hidden
      /*
        `w-max` makes the track deliberately wider than the viewport, so the section has to
        clip it in its own formatting context — `overflow-hidden` alone still let the wide
        child count toward the document scroll width and gave the whole page a horizontal
        scrollbar on a phone.
      */
      className="relative isolate w-full max-w-full overflow-x-clip border-y border-co-border bg-co-bg-alt py-[clamp(14px,1.6vw,20px)]"
      style={{
        // Fades at both edges, so the strip reads as continuous rather than hard-cut.
        maskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)",
      }}
    >
      {/*
        The track holds the list twice so the -50% translation lands exactly on the
        seam. `will-change` is scoped to this one element rather than the section.
      */}
      <div
        className="animate-co-ticker flex w-max items-center gap-x-[clamp(20px,2.6vw,40px)] whitespace-nowrap"
        style={{ willChange: "transform" }}
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex items-center gap-x-[clamp(20px,2.6vw,40px)] pr-[clamp(20px,2.6vw,40px)]"
          >
            {entries.map((entry, i) => (
              <span
                key={`${copy}-${i}`}
                className="flex items-center gap-x-[clamp(20px,2.6vw,40px)] font-mono text-[10.5px] uppercase tracking-[0.2em] tabular-nums text-co-faint"
              >
                {entry}
                <span className="block h-[3px] w-[3px] bg-co-border-strong" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
