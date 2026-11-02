"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { FinishChip } from "@/components/ui/finish-chip";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow } from "@/lib/series";

/**
 * Finish board. Rendered only for series whose specification names finishes.
 *
 * A reference board, not a picker: each finish is a static chip (swatch, name, code) with
 * its material spec beneath, so nothing here is selected and nothing is lit. The swatch
 * fills are material samples from the series data — the one place a gradient describes
 * rather than decorates.
 */
export function SeriesFinishes() {
  const { series } = useSeriesConfigurator();
  const section = series.swatchesSection;
  const swatches = series.swatches;
  if (!swatches?.length || !section) return null;

  return (
    <section className="co-section bg-co-bg-alt">
      <div className="co-shell">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "finishes", section.eyebrow)}
          title={section.heading}
          blurb={section.blurb}
        />

        {/* Two-up on a phone: at one per row the board ran to five full-width tiles and
            buried the footnote a screen and a half down. */}
        <StaggerContainer
          as="ul"
          staggerDelay={0.06}
          className="grid list-none grid-cols-2 gap-x-5 gap-y-10 p-0 sm:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] sm:gap-x-[clamp(20px,2.4vw,40px)] sm:gap-y-12"
        >
          {swatches.map((swatch) => (
            <StaggerItem as="li" key={swatch.name}>
              <FinishChip
                name={swatch.name}
                code={swatch.code}
                fill={swatch.fill}
                edge={swatch.edge}
                className="w-full max-w-[168px]"
              />
              <p className="mt-3 max-w-[30ch] text-[13px] leading-[1.5] text-co-muted">{swatch.spec}</p>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {series.swatchesFootnote ? (
          <p className="mt-[clamp(30px,3.4vw,48px)] max-w-[72ch] border-t border-co-border pt-5 text-[13px] leading-[1.55] text-co-muted">
            {series.swatchesFootnote}
          </p>
        ) : null}
      </div>
    </section>
  );
}
