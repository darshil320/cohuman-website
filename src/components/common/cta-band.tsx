"use client";

import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";

import { Reveal } from "@/components/ui/scroll-reveal";

interface CtaBandProps {
  heading: string;
  body: string;
  buttonLabel?: string;
  subject?: string;
  /** `light` is the page ground; `dark` is the near-black panel. */
  tone?: "light" | "dark";
}

/**
 * Closing call to action.
 *
 * The heading runs at display size against a lot of air, and the action is an underlined
 * link rather than a filled rectangle — on a page built from hairlines, a button-shaped
 * block was the one element that still read as chrome.
 */
export function CtaBand({
  heading,
  body,
  buttonLabel = "Request a Quote",
  subject,
  tone = "light",
}: CtaBandProps) {
  const { openQuote } = useQuoteDialog();
  const isLight = tone === "light";

  return (
    <section className={cn("border-t", isLight ? "border-co-border bg-co-bg" : "border-co-panel bg-co-panel")}>
      <Reveal className="co-shell grid grid-cols-1 items-end gap-x-[clamp(28px,4vw,80px)] gap-y-10 py-[clamp(72px,9vw,148px)] lg:grid-cols-[1.35fr_1fr]">
        <div>
          <h2
            className={cn(
              "co-h1 mb-6 max-w-[18ch]",
              isLight ? "text-co-ink" : "text-co-panel-fg",
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "max-w-[48ch] text-[clamp(15px,1.3vw,18px)] font-light leading-relaxed",
              isLight ? "text-co-muted" : "text-co-panel-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="lg:justify-self-end">
          <button
            type="button"
            onClick={() => openQuote(subject)}
            className={cn(
              "group inline-flex items-center gap-3 border-b-2 pb-2 text-[clamp(16px,1.5vw,21px)] font-semibold transition-colors",
              isLight
                ? "border-co-ink text-co-ink hover:border-co-placeholder hover:text-co-muted"
                : "border-co-panel-fg text-co-panel-fg hover:border-co-panel-faint hover:text-co-panel-muted",
            )}
          >
            {buttonLabel}
            <svg
              aria-hidden
              width="16"
              height="11"
              viewBox="0 0 13 9"
              fill="none"
              className="transition-transform duration-300 ease-[var(--ease-co)] group-hover:translate-x-1.5"
            >
              <path d="M0 4.5h11M8 1l3.5 3.5L8 8" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </Reveal>
    </section>
  );
}
