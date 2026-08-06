"use client";

import { useCallback, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Turns a stacked grid into a swipeable rail on a phone, and leaves the grid alone from
 * `sm` up.
 *
 * A three-up grid becomes a three-screen scroll on a 390px viewport, which is where
 * people browsing furniture give up. Side by side, the same cards are one gesture apart:
 * the cost of looking at the next one drops to a thumb flick, and the cards that are
 * partly visible at the edge are what invite it.
 *
 * Native CSS scroll-snap does the work — no JS drag handling, so momentum, rubber-banding
 * at the ends and accessibility all come from the platform.
 *
 * Contract: `children` is the grid element and its direct children are the cards. The
 * caller keeps ownership of that element's classes — it carries the rail classes for
 * mobile (`flex`, card widths, `snap-start`) and its own grid classes from `sm` up — so
 * this component supplies only the scroll port and the position dots.
 */

interface MobileRailProps {
  /** Total cards, used for the position dots. */
  total: number;
  /** What the rail contains, for the scroll region's accessible name. */
  label: string;
  children: ReactNode;
  className?: string;
}

export function MobileRail({ total, label, children, className }: MobileRailProps) {
  const [active, setActive] = useState(0);

  // Which card is nearest the centre — driven by scroll position rather than by an
  // observer per card, since the rail is short and this stays exact at both ends.
  const onScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const rail = event.currentTarget;
    const card = rail.firstElementChild?.firstElementChild as HTMLElement | null;
    if (!card) return;
    const step = card.offsetWidth + 12;
    setActive(Math.round(rail.scrollLeft / step));
  }, []);

  return (
    <div className={className}>
      <div
        onScroll={onScroll}
        role="region"
        aria-label={label}
        className={cn(
          // The negative margin lets the rail bleed to both screen edges while the cards
          // keep the page's gutter, so the first card lines up with the heading above it.
          "-mx-[18px] snap-x snap-mandatory overflow-x-auto scroll-px-[18px] px-[18px] pb-1",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          // From `sm` the rail stops being a rail: no snapping, no bleed, no overflow.
          "sm:mx-0 sm:snap-none sm:overflow-visible sm:px-0",
        )}
      >
        {/*
          The container itself stays with the caller — it keeps its own grid classes for
          desktop and its stagger animation, and adds the rail classes for mobile. This
          component only supplies the scroll port and the position dots.
        */}
        {children}
      </div>

      {total > 1 ? (
        <div aria-hidden className="mt-4 flex justify-center gap-1.5 sm:hidden">
          {Array.from({ length: total }, (_, index) => (
            <span
              key={index}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                index === active ? "w-5 bg-co-ink" : "w-1.5 bg-co-border-strong",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
