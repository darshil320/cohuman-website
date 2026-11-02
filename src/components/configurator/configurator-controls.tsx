import type { ReactNode } from "react";
import { FinishChip } from "@/components/ui/finish-chip";
import type { FinishOption } from "@/lib/configurator";
import { cn } from "@/lib/utils";

/**
 * The configurator's instrument-panel parts: step strip, step headings, option tiles,
 * labelled fields and finish groups. Square, 1px rules, mono for anything you could
 * measure. A selection is an ink fill plus `aria-pressed` — never green; the progress
 * rail is the one green thing on this screen.
 *
 * Every control here is at least 44px tall, and a focused cell rises above its
 * neighbours so the ink focus ring is never painted over by the cell beside it.
 *
 * No `"use client"`: these take callbacks, so they are only rendered by client parents
 * (the /configure configurator and the collection page's spec block).
 */

/** Two-digit ordinal, so a counter never changes width. */
export function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export interface StepEntry {
  key: string;
  label: string;
}

/**
 * The step strip: one ink frame, cells divided by the same rule, the current step
 * filled. Cells overlap by a pixel so a wrapped row shares its rules. On phones only
 * the current step keeps its name on screen; the others keep it for screen readers.
 */
export function StepNav({
  steps,
  current,
  onPick,
}: {
  steps: readonly StepEntry[];
  current: number;
  onPick: (index: number) => void;
}) {
  return (
    <nav aria-label="Configurator steps">
      <ol className="m-0 flex list-none flex-wrap p-0 pl-px pt-px">
        {steps.map((entry, index) => {
          const on = index === current;
          return (
            <li key={entry.key} className="-ml-px -mt-px flex grow">
              <button
                type="button"
                onClick={() => onPick(index)}
                aria-current={on ? "step" : undefined}
                className={cn(
                  "co-data relative flex min-h-11 w-full items-center gap-2 whitespace-nowrap border border-co-ink px-3 text-left transition-colors duration-150 focus-visible:z-20",
                  on ? "z-10 bg-co-ink text-co-bg" : "text-co-ink hover:bg-co-bg-alt",
                )}
              >
                <span className={on ? "text-co-panel-faint" : "text-co-muted-2"}>{pad(index + 1)}</span>
                <span className={cn(!on && "sr-only sm:not-sr-only")}>{entry.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** A step's question in extended caps, with an optional plain-language note. */
export function StepHeading({ heading, note }: { heading: string; note?: string }) {
  return (
    <div className="mb-6">
      <h2 className="co-h3">{heading}</h2>
      {note ? <p className="mt-3 max-w-[52ch] text-[15px] leading-[1.55] text-co-muted">{note}</p> : null}
    </div>
  );
}

export interface OptionTile {
  id: string;
  name: string;
  /** Reading copy — a promise, a part description. */
  note?: string;
  /** Data — a part number, a size range, a seat count. Set in mono, one line each. */
  meta?: string | readonly string[];
  on: boolean;
  onPick: () => void;
}

/**
 * Square option tiles on a shared hairline grid. Every cell draws its full frame and
 * overlaps its neighbours by a pixel (as the segmented control does), so a part-filled
 * last row — or a single tile — ends on its own rules. Selected is a solid ink cell
 * lifted above the shared rules. `multi` adds a square check mark, since several cells
 * may be on at once. `dense` keeps two columns on phones, for long lists of short entries.
 */
export function OptionTiles({
  items,
  multi = false,
  dense = false,
}: {
  items: readonly OptionTile[];
  multi?: boolean;
  dense?: boolean;
}) {
  return (
    <ul
      className={cn(
        "m-0 grid list-none p-0 pl-px pt-px",
        dense ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {items.map((item, index) => {
        const meta = typeof item.meta === "string" ? [item.meta] : (item.meta ?? []);
        return (
          <li key={item.id} className="-ml-px -mt-px flex">
            <button
              type="button"
              aria-pressed={item.on}
              onClick={item.onPick}
              className={cn(
                "relative flex w-full flex-col items-start border px-4 py-3.5 text-left transition-colors duration-150 focus-visible:z-20",
                item.on
                  ? "z-10 border-co-ink bg-co-ink text-co-bg"
                  : "border-co-border bg-co-bg text-co-ink hover:bg-co-bg-alt",
              )}
            >
              <span className="flex w-full items-center justify-between gap-3">
                <span className={cn("co-data", item.on ? "text-co-panel-faint" : "text-co-muted-2")}>
                  {pad(index + 1)}
                </span>
                {multi ? (
                  <span
                    aria-hidden
                    className={cn("block h-3 w-3 border", item.on ? "border-co-bg bg-co-bg" : "border-co-ink")}
                  />
                ) : null}
              </span>
              <span className="co-data mt-2 block">{item.name}</span>
              {item.note ? (
                <span
                  className={cn(
                    "mt-1.5 block max-w-[46ch] text-[13px] leading-[1.5]",
                    item.on ? "text-co-panel-muted" : "text-co-muted",
                  )}
                >
                  {item.note}
                </span>
              ) : null}
              {meta.length ? (
                <span className={cn("co-data mt-1.5 block", item.on ? "text-co-panel-faint" : "text-co-muted-2")}>
                  {meta.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * A labelled field: mono label, the control, and an optional line of helper text — used
 * for the size selectors and finish groups in both configurators, so a fixed size or a
 * chosen finish is explained in the same place on /configure and on the spec block.
 * `dark` sits on the ink spec block.
 */
export function Field({
  label,
  hint,
  hintId,
  tone = "light",
  className,
  children,
}: {
  label: string;
  hint?: ReactNode;
  /** Id for the hint, so the control can point at it with `aria-describedby`. */
  hintId?: string;
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const dark = tone === "dark";
  return (
    <div className={className}>
      <p className={cn("co-eyebrow mb-2.5", dark && "text-co-panel-faint")}>{label}</p>
      {children}
      {hint ? (
        <p
          id={hintId}
          className={cn(
            "mt-2.5 max-w-[46ch] text-[13px] leading-[1.5]",
            dark ? "text-co-panel-muted" : "text-co-muted",
          )}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/**
 * One finish group: square chips with part codes, the chosen finish's spec beneath.
 * Chips are wide enough that a part code such as `PROS-TOP-NOK` never breaks mid-code.
 */
export function FinishGroup({
  label,
  items,
  activeCode,
  onPick,
}: {
  label: string;
  items: readonly FinishOption[];
  activeCode: string | null;
  onPick: (code: string) => void;
}) {
  const active = items.find((item) => item.code === activeCode) ?? null;

  return (
    <Field label={label} hint={active ? `${active.name} — ${active.spec}` : undefined}>
      <div role="group" aria-label={label} className="flex flex-wrap items-start gap-3.5">
        {items.map((item) => (
          <FinishChip
            key={item.code}
            name={item.name}
            code={item.code}
            fill={item.fill}
            edge={item.edge}
            selected={item.code === activeCode}
            onSelect={() => onPick(item.code)}
            // The progress rail is this screen's one green thing; the outline carries state.
            dot={false}
            className="w-[96px]"
          />
        ))}
      </div>
    </Field>
  );
}

/** The empty state for a step the series' specification has nothing to offer in. */
export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[48ch] border-t border-co-border pt-5 text-[15px] leading-[1.55] text-co-muted">
      {children}
    </p>
  );
}
