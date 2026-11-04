"use client";

import { SectionHeading } from "@/components/common/section-heading";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/ui/scroll-reveal";
import { INFERRED_CODE_FOOTNOTE, isInferredCode } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { seriesSectionEyebrow } from "@/lib/series";

/**
 * Accessory quoted by SKU and travel rather than by configuration — VARIDEX's
 * retractable wire channel. Rendered only where the series defines one.
 *
 * Set on the ink block: the parts that make up the channel as an index on the left, the
 * SKU table in mono on the right, every code and limit read straight off the series data.
 */
export function SeriesAccessory() {
  const { series } = useSeriesConfigurator();
  const accessory = series.accessory;
  if (!accessory) return null;

  const hasInferred = accessory.rows.some((row) => isInferredCode(series, row.code));

  return (
    <section className="co-section bg-co-panel text-co-panel-fg">
      <div className="co-shell">
        <SectionHeading
          tone="dark"
          eyebrow={seriesSectionEyebrow(series, "accessory", accessory.eyebrow)}
          title={accessory.heading}
          blurb={accessory.blurb}
        />

        <div className="grid items-start gap-[clamp(36px,4vw,64px)] lg:grid-cols-2">
          <StaggerContainer as="ul" staggerDelay={0.08} className="list-none border-t border-co-panel-border p-0">
            {accessory.parts.map((part, index) => (
              <StaggerItem
                as="li"
                key={part.name}
                className="grid grid-cols-[40px_minmax(0,1fr)] items-baseline gap-x-4 border-b border-co-panel-border py-5"
              >
                <span className="co-data text-co-panel-faint">{String(index + 1).padStart(2, "0")}</span>
                <div className="min-w-0">
                  <h3 className="co-h3 text-co-panel-fg">{part.name}</h3>
                  <p className="mt-2 max-w-[46ch] text-[15px] leading-[1.55] text-co-panel-muted">{part.note}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <Reveal>
            <table className="co-data w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-co-panel-fg">
                  {accessory.columns.map((column, index) => (
                    <th
                      key={column}
                      scope="col"
                      className={cn("pb-3 text-left font-normal text-co-panel-faint", index > 0 && "text-right")}
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accessory.rows.map((row) => (
                  <tr key={row.code} className="border-b border-co-panel-border">
                    <th scope="row" className="py-4 pr-4 text-left font-normal text-co-panel-fg">
                      {row.code}
                      {isInferredCode(series, row.code) ? (
                        <span className="ml-0.5 inline-block bg-co-sunlit px-[3px] leading-none text-co-ink" title={INFERRED_CODE_FOOTNOTE}>
                          °
                        </span>
                      ) : null}
                    </th>
                    <td className="py-4 text-right text-co-panel-fg">{row.min}</td>
                    <td className="py-4 pl-4 text-right text-co-panel-fg">{row.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {hasInferred ? (
              <p className="mt-3 text-[13px] leading-[1.55] text-co-panel-faint">{INFERRED_CODE_FOOTNOTE}</p>
            ) : null}
            <p className="mt-5 max-w-[52ch] text-[13px] leading-[1.55] text-co-panel-muted">
              Travel is the span the tray covers, not the length of the top — we size it
              against the beam on the quote.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
