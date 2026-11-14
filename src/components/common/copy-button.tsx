"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type State = "idle" | "copied" | "failed";

const LABEL: Record<State, string> = {
  idle: "Copy",
  copied: "Copied",
  failed: "Select it",
};
const RESET_MS = 2000;

/** Each label sits in one grid cell, so a swap never changes the button's width. */
const ROLL =
  "col-start-1 row-start-1 transition-transform duration-(--duration-press) ease-(--ease-enter)";

/**
 * A mono "Copy" beside an address or number, for the visitor who wants it in their own
 * mail client or CRM rather than the one `mailto:` opens. The label rolls to "Copied"
 * (Signal has no toasts and no fades) and back after two seconds; the change is
 * announced. If the clipboard is blocked it says "Select it" instead of failing quietly.
 * 44px target, visual stays small.
 */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(value);
      setState("copied");
    } catch {
      setState("failed");
    }
    timer.current = window.setTimeout(() => setState("idle"), RESET_MS);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${label}`}
      className={cn(
        "co-hit co-data inline-flex shrink-0 text-co-muted-2 transition-colors duration-(--duration-press) hover:text-co-ink",
        className,
      )}
    >
      {/* The clip lives on this inner cell, not the button, so the 44px zone isn't cut. */}
      <span className="grid overflow-hidden">
        {(Object.keys(LABEL) as State[]).map((key, index) => {
          const current = (Object.keys(LABEL) as State[]).indexOf(state);
          return (
            <span
              key={key}
              aria-hidden={key !== state || undefined}
              className={cn(
                ROLL,
                index < current && "-translate-y-full",
                index > current && "translate-y-full",
                key !== "idle" && "text-co-ink",
              )}
            >
              {LABEL[key]}
            </span>
          );
        })}
      </span>
      <span className="sr-only" aria-live="polite">
        {state === "copied"
          ? `${label} copied`
          : state === "failed"
            ? "Copy blocked — select the text"
            : ""}
      </span>
    </button>
  );
}
