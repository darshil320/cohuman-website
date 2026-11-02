import type { ReactNode } from "react";
import { FinishChip } from "@/components/ui/finish-chip";
import type { FinishOption } from "@/lib/configurator";
import { cn } from "@/lib/utils";

/**
 * The configurator's instrument-panel parts: step strip, step headings, option tiles,
 * finish groups and size fields. Square, 1px rules, mono for anything you could
 * measure. A selection is an ink fill plus `aria-pressed` — never green; the progress
 * rail is the one green thing on this screen.
 *
 * No `"use client"`: these take callbacks, so they are only rendered by the client
 * configurator.
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
                  "co-data flex w-full items-baseline gap-2 whitespace-nowrap border border-co-ink px-3 py-2.5 text-left transition-colors duration-150",
                  on ? "relative z-10 bg-co-ink text-co-bg" : "text-co-ink hover:bg-co-bg-alt",
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
  /** Data — a part number, a seat count. Set in mono. */
  meta?: string;
  on: boolean;
  onPick: () => void;
}

/**
 * Square option tiles on a shared hairline grid — each cell draws its own right and
 * bottom rule, so a part-filled last row ends cleanly. Selected is a solid ink cell.
 * `multi` adds a square check mark, since several cells may be on at once.
 * `dense` keeps two columns on phones, for long lists of short entries.
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
        "m-0 grid list-none border-l border-t border-co-border p-0",
        dense ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-2",
      )}
    >
      {items.map((item, index) => (
        <li key={item.id} className="flex">
          <button
            type="button"
            aria-pressed={item.on}
            onClick={item.onPick}
            className={cn(
              "flex w-full flex-col items-start border-b border-r border-co-border px-4 py-3.5 text-left transition-colors duration-150",
              item.on ? "bg-co-ink text-co-bg" : "bg-co-bg text-co-ink hover:bg-co-bg-alt",
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
            {item.meta ? (
              <span className={cn("co-data mt-1.5 block", item.on ? "text-co-panel-faint" : "text-co-muted-2")}>
                {item.meta}
              </span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  );
}

/** A size control with its mono field label, e.g. "Length — mm". */
export function SizeField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="co-eyebrow mb-2.5">{label}</p>
      {children}
    </div>
  );
}

/** One finish group: square chips with part codes, the chosen finish's spec beneath. */
export function FinishGroup({
  heading,
  items,
  activeCode,
  onPick,
}: {
  heading: string;
  items: readonly FinishOption[];
  activeCode: string | null;
  onPick: (code: string) => void;
}) {
  const active = items.find((item) => item.code === activeCode) ?? null;

  return (
    <section className="mt-10 first:mt-0">
      <h2 className="co-h3">{heading}</h2>
      <div role="group" aria-label={heading} className="mt-5 flex flex-wrap gap-3.5">
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
          />
        ))}
      </div>
      {active ? (
        <p className="mt-4 max-w-[48ch] text-[15px] leading-[1.55] text-co-muted">{active.spec}</p>
      ) : null}
    </section>
  );
}

/** For a step the series' specification has nothing to offer in. */
export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="max-w-[48ch] border-t border-co-border pt-5 text-[15px] leading-[1.55] text-co-muted">
      {children}
    </p>
  );
}
