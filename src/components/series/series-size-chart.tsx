"use client";

import { MobilePeek } from "@/components/common/mobile-peek";
import { chartDepths, chartLengths } from "@/lib/series";
import { cn } from "@/lib/utils";
import { useSeriesConfigurator } from "./series-context";
import { Reveal } from "./reveal";

const ROW_GRID = "grid grid-cols-[44px_minmax(200px,1.5fr)_1.5fr_1fr_1fr_84px] gap-4";

const HEADINGS = ["#", "Configuration", "Length mm", "Depth mm", "Beam", "Seats"];

/** Rows a phone shows before the chart asks to be opened. */
const MOBILE_PEEK = 5;

/** Values the specification prints as "not stated" — nothing to show on a phone row. */
function stated(value: string): boolean {
  return Boolean(value) && value !== "—" && value !== "–" && value !== "-";
}

/**
 * Closes up the spaces around the slashes for the phone row.
 *
 * Spaced out, a four-length row wrapped onto a second line and the `×` — the one
 * character telling you where length ends and depth begins — was lost in the run of
 * separators. Tight slashes, a spaced `×`, and all but the longest rows fit one line.
 */
function tight(value: string): string {
  return value.replace(/\s*\/\s*/g, "/");
}

function seatLine(seats: string): string | null {
  if (!stated(seats)) return null;
  return seats === "1" ? "1 seat" : `${seats} seats`;
}

/**
 * Size chart.
 *
 * Six columns do not fit a phone, and a sideways-scrolling table hides the two columns
 * people came for. Under `sm` each row becomes a stacked card with its own labels, so
 * nothing scrolls sideways and nothing is cut off; from `sm` it is the six-column grid
 * again. That also keeps the peek clip honest — a horizontal scroller would have been
 * scrollable on both axes, and the browser scrolling a hidden row into view inside it
 * would leave the collapsed chart showing the middle of the list.
 */
export function SeriesSizeChart() {
  const { series, config, pickConfig } = useSeriesConfigurator();
  const section = series.sizeChartSection;

  return (
    <section className="border-b border-co-border">
      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(46px,5.4vw,82px)] sm:px-6 lg:px-11">
        <div className="mb-[clamp(24px,3vw,38px)] grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-end gap-[clamp(20px,3vw,48px)]">
          <Reveal>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.19em] text-co-green">
              {section.eyebrow}
            </p>
            <h2 className="max-w-[20ch] font-display text-[clamp(28px,3.4vw,44px)] font-medium leading-[1.03] tracking-[-0.033em]">
              {section.heading}
            </h2>
          </Reveal>
          {section.blurb ? (
            <Reveal step={1}>
              <p className="max-w-[46ch] text-[15.5px] font-light leading-relaxed text-co-muted">
                {section.blurb}
              </p>
            </Reveal>
          ) : null}
        </div>

        <MobilePeek
          peek={MOBILE_PEEK}
          total={series.configs.length}
          noun="configurations"
          // The rows sit two levels down, under the header row's sibling.
          rowSelector="button"
        >
          <div className="border border-co-border sm:overflow-x-auto">
            <div className="sm:min-w-[720px]">
              {/*
                One legend for the whole list instead of four labels on every card: at
                fourteen rows the repeated labels outweighed the numbers they described.
              */}
              <p
                className="border-b border-co-border bg-co-bg-alt px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-co-placeholder sm:hidden"
                aria-hidden
              >
                Length × depth mm · beam · seats
              </p>

              <div
                className={cn(
                  ROW_GRID,
                  "hidden border-b border-co-border bg-co-bg-alt px-4 py-3.5 sm:grid",
                )}
                aria-hidden
              >
                {HEADINGS.map((heading, index) => (
                  <span
                    key={heading}
                    className={cn(
                      "text-[10.5px] font-semibold uppercase tracking-[0.11em] text-co-placeholder",
                      index === HEADINGS.length - 1 && "text-right",
                    )}
                  >
                    {heading}
                  </span>
                ))}
              </div>

              {series.configs.map((item, index) => {
                const on = item.slug === config.slug;
                const lengths = chartLengths(item);
                const depths = chartDepths(item);
                const seats = seatLine(item.seats);
                return (
                  <button
                    key={item.slug}
                    type="button"
                    aria-pressed={on}
                    onClick={() => pickConfig(index)}
                    className={cn(
                      "block w-full border-b border-co-card-border px-4 py-3 text-left transition-colors",
                      "sm:grid sm:grid-cols-[44px_minmax(200px,1.5fr)_1.5fr_1fr_1fr_84px] sm:items-center sm:gap-4 sm:px-4 sm:py-3.5",
                      on
                        ? "bg-co-bg-alt shadow-[inset_3px_0_0_var(--color-co-green)]"
                        : "bg-co-bg hover:bg-co-bg-alt",
                    )}
                  >
                    {/*
                      Two layouts rather than one reflowed tree: a phone reads this as two
                      lines of prose, a desktop as six aligned columns, and forcing one
                      markup shape to be both is what made the cards look like a grid of
                      labels. Only one is ever rendered, so neither reaches assistive
                      technology twice.
                    */}
                    <span className="block sm:hidden">
                      <span className="flex items-baseline gap-2.5">
                        <span
                          className={cn(
                            "shrink-0 font-mono text-[12px]",
                            on ? "text-co-green" : "text-co-placeholder",
                          )}
                        >
                          {item.n}
                        </span>
                        <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug text-co-ink">
                          {item.name}
                        </span>
                        {stated(item.beam) ? (
                          <span className="shrink-0 font-mono text-[11.5px] text-co-faint">
                            {item.beam}
                          </span>
                        ) : null}
                      </span>
                      {/*
                        Proportional digits, not `tabular-nums`: nothing lines up in a
                        column here, and the fixed-width figures pushed the seat count
                        onto a line of its own.
                      */}
                      <span className="mt-1 block pl-[26px] text-[12.5px] font-light leading-snug text-co-muted">
                        {tight(lengths)}
                        {stated(depths) ? (
                          // Held together so a wrap puts the `×` with the depths it
                          // introduces, rather than dangling it off the line above.
                          <span className="whitespace-nowrap"> × {tight(depths)}</span>
                        ) : null}
                        {seats ? (
                          <span className="whitespace-nowrap text-co-placeholder"> · {seats}</span>
                        ) : null}
                      </span>
                    </span>

                    <span
                      className={cn(
                        "hidden font-mono text-[12.5px] sm:block",
                        on ? "text-co-green" : "text-co-placeholder",
                      )}
                    >
                      {item.n}
                    </span>
                    <span className="hidden text-[15px] font-medium text-co-ink sm:block">
                      {item.name}
                    </span>
                    <span className="hidden text-sm font-light tabular-nums text-co-muted sm:block">
                      {lengths}
                    </span>
                    <span className="hidden text-sm font-light tabular-nums text-co-muted sm:block">
                      {depths}
                    </span>
                    <span className="hidden font-mono text-[12.5px] text-co-faint sm:block">
                      {item.beam}
                    </span>
                    <span className="hidden text-right text-sm font-light text-co-muted sm:block">
                      {item.seats}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </MobilePeek>
      </div>
    </section>
  );
}
