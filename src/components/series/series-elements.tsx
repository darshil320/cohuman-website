"use client";

import { MobilePeek } from "@/components/common/mobile-peek";
import { SectionHeading } from "@/components/common/section-heading";
import { StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import {
  INFERRED_CODE_FOOTNOTE,
  isInferredCode,
  seriesSectionEyebrow,
  type SeriesDefinition,
} from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";


/** Rows a phone shows before the list asks to be opened. */
const MOBILE_PEEK = 3;

/** Number · element · type · code — the index-row columns, shared by header and rows. */
const ROW_GRID =
  "grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 md:grid-cols-[56px_minmax(0,1.4fr)_minmax(0,0.5fr)_minmax(0,0.8fr)] lg:grid-cols-[90px_minmax(0,1.4fr)_minmax(0,0.5fr)_260px]";

/** A part number, with the Sunlit `°` chip where the code is pattern-matched, not printed. */
function ElementCode({ series, code }: { series: SeriesDefinition; code: string }) {
  return (
    <>
      {code}
      {isInferredCode(series, code) ? (
        <span className="ml-0.5 inline-block bg-co-sunlit px-[3px] leading-none text-co-ink" title={INFERRED_CODE_FOOTNOTE}>
          °
        </span>
      ) : null}
    </>
  );
}

/**
 * Component schedule.
 *
 * Read as a parts list: ordinal, the element's name in display caps with its note, the
 * kind, and the part number with the PDF's own reference beneath it — the reference is
 * what a specifier quotes from, so it stays beside the code on every row.
 */
export function SeriesElements() {
  const { series } = useSeriesConfigurator();
  const { elementsSection: section } = series;
  const hasInferred = series.elements.some((element) => isInferredCode(series, element.code));

  return (
    <section className="co-section">
      <div className="co-shell">
        <SectionHeading
          eyebrow={seriesSectionEyebrow(series, "elements", section.eyebrow)}
          title={section.heading}
          blurb={section.blurb}
        />

        <div aria-hidden className={cn(ROW_GRID, "co-eyebrow hidden border-b border-co-border pb-3.5 md:grid")}>
          <span>No.</span>
          <span>Element</span>
          <span>Type</span>
          <span>Code / Ref.</span>
        </div>

        <MobilePeek peek={MOBILE_PEEK} total={series.elements.length} noun="components">
          <StaggerContainer as="ul" className="list-none p-0" staggerDelay={0.06}>
            {series.elements.map((element, index) => (
              <StaggerItem
                as="li"
                key={element.code}
                className={cn(ROW_GRID, "items-baseline border-b border-co-border py-5 md:py-6")}
              >
                <span className="co-data">{String(index + 1).padStart(2, "0")}</span>

                <div className="min-w-0">
                  <h3 className="font-display text-[clamp(20px,2.2vw,30px)] font-semibold leading-[1.2] tracking-[-0.02em]">
                    {element.name}
                  </h3>
                  <p className="mt-2.5 max-w-[52ch] text-[14px] leading-[1.55] text-co-muted">
                    {element.note}
                  </p>
                  {/* Phones fold type and code under the name rather than into columns. */}
                  <p className="co-data mt-3 md:hidden">
                    <span className="text-co-muted-2">
                      {element.kind} · Ref {element.ref} ·{" "}
                    </span>
                    <ElementCode series={series} code={element.code} />
                  </p>
                </div>

                <span className="hidden text-[15px] text-co-ink-soft md:block">{element.kind}</span>

                <span className="co-data hidden min-w-0 break-words md:block">
                  <ElementCode series={series} code={element.code} />
                  <span className="block text-co-muted-2">Ref {element.ref}</span>
                </span>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </MobilePeek>

        {hasInferred ? (
          <p className="co-eyebrow mt-4 normal-case tracking-normal">{INFERRED_CODE_FOOTNOTE}</p>
        ) : null}

        {series.elementsNote ? (
          <div className={cn(ROW_GRID, "mt-[clamp(26px,3vw,40px)] items-baseline gap-y-2")}>
            <p className="co-eyebrow">Note</p>
            <p className="max-w-[62ch] text-[15px] leading-[1.55] text-co-ink-soft">
              {series.elementsNote}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
