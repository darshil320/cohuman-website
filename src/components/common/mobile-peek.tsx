"use client";

import { useCallback, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shows the first few rows of a long reference list on a phone and opens to the rest on
 * demand. Above `sm` it does nothing at all — the wrapper returns to `height: auto` and
 * the control is hidden — so the desktop layout is untouched.
 *
 * Nothing is removed to achieve this: every row stays in the DOM, so search engines and
 * assistive technology see the whole list and the collapsed state is a visual clip. The
 * clip lands on a row boundary rather than through a row, so a half-cut card never reads
 * as a rendering fault.
 */

interface MobilePeekProps {
  /** How many rows stay visible while collapsed. */
  peek: number;
  /** Total rows, so a list that already fits renders without any of this. */
  total: number;
  /** Plural noun for the control — "components", "configurations". */
  noun: string;
  /**
   * Selector for the rows, resolved inside the wrapper. Defaults to the direct children
   * of `children`'s root, which covers a plain `ul`; pass one when the rows sit deeper,
   * e.g. inside a horizontally scrolling table.
   */
  rowSelector?: string;
  /** `dark` for sections that run on the panel background. */
  tone?: "light" | "dark";
  children: ReactNode;
  className?: string;
}

export function MobilePeek({
  peek,
  total,
  noun,
  rowSelector,
  tone = "light",
  children,
  className,
}: MobilePeekProps) {
  const [expanded, setExpanded] = useState(false);
  const [heights, setHeights] = useState({ peek: 0, full: 0 });

  /*
    Measured through a ref callback with a ResizeObserver rather than an effect: this is a
    subscription to an external system (layout), so it re-measures when a row rewraps at a
    new width instead of holding a stale pixel value. React 19 runs the returned function
    as the ref's cleanup.
  */
  const measure = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;

      const compute = () => {
        const root = node.firstElementChild as HTMLElement | null;
        if (!root) return;
        const rows = rowSelector
          ? Array.from(node.querySelectorAll<HTMLElement>(rowSelector))
          : (Array.from(root.children) as HTMLElement[]);
        if (!rows.length) return;
        // Offsets, not bounding rects: rows enter on a `translateY`, and a rect read
        // mid-reveal cuts the list low and leaves a sliver of the next row showing.
        const cut = rows[Math.min(peek, rows.length) - 1];
        setHeights({
          peek: cut.offsetTop + cut.offsetHeight - root.offsetTop,
          full: node.scrollHeight,
        });
      };

      compute();
      const observer = new ResizeObserver(compute);
      observer.observe(node);
      const root = node.firstElementChild;
      if (root) for (const row of Array.from(root.children)) observer.observe(row);
      return () => observer.disconnect();
    },
    [peek, rowSelector],
  );

  if (total <= peek) return <>{children}</>;

  return (
    <div className={className}>
      <div
        ref={measure}
        id={`peek-${noun}`}
        // The height rides a custom property so the `sm` utility can win — an inline
        // height would outrank every breakpoint class.
        style={{ "--peek-h": `${expanded ? heights.full : heights.peek}px` } as CSSProperties}
        className={cn(
          "h-[var(--peek-h)] overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
          "sm:h-auto sm:overflow-visible",
          // Until the first measurement lands there is no height to clip to.
          heights.peek === 0 && "h-auto",
        )}
      >
        {children}
      </div>

      <button
        type="button"
        aria-expanded={expanded}
        aria-controls={`peek-${noun}`}
        onClick={() => setExpanded((open) => !open)}
        className={cn(
          "mt-3 flex w-full items-center justify-center gap-2 border px-4 py-3 text-[12.5px] font-semibold uppercase tracking-[0.12em] transition-colors sm:hidden",
          tone === "dark"
            ? "border-co-panel-fg/25 bg-transparent text-co-panel-fg active:bg-co-panel-fg/10"
            : "border-co-border-strong bg-co-bg text-co-ink active:bg-co-bg-alt",
        )}
      >
        {expanded ? "Show fewer" : `All ${total} ${noun}`}
        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className={cn("transition-transform duration-300", expanded && "rotate-180")}
        >
          <path d="M1.5 4L6 8.5 10.5 4" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        {!expanded ? <span className="sr-only">, {total - peek} more hidden</span> : null}
      </button>
    </div>
  );
}
