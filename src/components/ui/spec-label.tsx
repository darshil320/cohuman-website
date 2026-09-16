import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SpecLabelProps {
  children: ReactNode;
  /** `dark` is the near-black panel; `light` is the page ground. */
  tone?: "light" | "dark";
  /** Draws the short leading rule. Off for labels that sit inside a bordered row. */
  rule?: boolean;
  className?: string;
}

/**
 * The monospace micro-label used across the drawing-sheet sections.
 *
 * Replaces the bespoke `text-[11px] font-semibold uppercase tracking-[0.19em]` spans that
 * had accumulated on every route, and matches the part-code idiom the series pages
 * already use.
 *
 * On light grounds the colour is `co-muted`, not the `co-placeholder` that `co-eyebrow`
 * uses: at 10.5px this is small text, and `co-placeholder` on white is about 2.5:1 —
 * under the 4.5:1 AA floor. `co-muted` clears 7:1 and still reads as a quiet label at
 * this tracking.
 *
 * `font-mono` is the system stack (`ui-monospace`/SF Mono/Menlo), already used by the
 * series components. It costs no webfont bytes.
 */
export function SpecLabel({ children, tone = "light", rule = false, className }: SpecLabelProps) {
  return (
    <p
      className={cn(
        "flex items-center gap-2.5 font-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.22em] tabular-nums",
        tone === "dark" ? "text-co-panel-faint" : "text-co-muted",
        className,
      )}
    >
      {rule ? (
        <span
          aria-hidden
          className={cn("block h-px w-[22px]", tone === "dark" ? "bg-co-panel-border" : "bg-co-border-strong")}
        />
      ) : null}
      {children}
    </p>
  );
}
