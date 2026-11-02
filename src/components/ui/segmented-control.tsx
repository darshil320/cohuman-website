import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SegmentOption<T extends string | number> {
  value: T;
  label: ReactNode;
}

interface SegmentedControlProps<T extends string | number> {
  /** Names the group for assistive tech, e.g. "Length in millimetres". */
  label: string;
  options: readonly SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** A derived value shown for reference only — square and round tops lock their depth. */
  locked?: boolean;
  /** `dark` sits on the ink spec block. */
  tone?: "light" | "dark";
  className?: string;
}

/**
 * A square segmented control — the size selector.
 *
 * Instrument-panel styling: one 1px ink frame, cells divided by the same rule, the
 * selected cell filled solid. Selection is carried by the fill and by `aria-pressed`,
 * never by colour alone. Cells overlap by a pixel so a wrapped second row shares its
 * rules with the first instead of doubling them.
 *
 * No `"use client"` of its own: it takes an `onChange`, so it is only ever rendered by a
 * client parent.
 */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  locked = false,
  tone = "light",
  className,
}: SegmentedControlProps<T>) {
  const dark = tone === "dark";

  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap pl-px pt-px", className)}>
      {options.map((option) => {
        const on = locked || option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            disabled={locked}
            aria-pressed={on}
            onClick={() => onChange(option.value)}
            className={cn(
              "co-data relative -ml-px -mt-px min-w-[64px] border px-4 py-3 text-center transition-colors duration-150",
              dark ? "border-co-panel-fg" : "border-co-ink",
              on
                ? dark
                  ? "z-10 bg-co-panel-fg text-co-ink"
                  : "z-10 bg-co-ink text-co-bg"
                : dark
                  ? "text-co-panel-fg hover:bg-co-panel-border"
                  : "text-co-ink hover:bg-co-bg-alt",
              locked && "cursor-default",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
