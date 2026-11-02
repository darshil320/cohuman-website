"use client";

import Link from "next/link";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/scroll-reveal";
import { cn } from "@/lib/utils";

interface CtaBandProps {
  heading: string;
  body: string;
  buttonLabel?: string;
  subject?: string;
  /** A second, quieter route — e.g. the showroom visit beside the quote. */
  secondary?: { label: string; href: string };
  /** `light` is the page ground; `dark` is the ink block. */
  tone?: "light" | "dark";
  /** Mono label over the heading. */
  eyebrow?: string;
}

/**
 * Closing call to action — the enquiry band every page ends on.
 *
 * Display-caps claim on the left, the quote action on the right. The button is the plain
 * primary: the header's quote button already carries the dots, and two lit quote buttons
 * on one screen would break the one-green-thing rule.
 */
export function CtaBand({
  heading,
  body,
  buttonLabel = "Get a quote",
  subject,
  secondary,
  tone = "light",
  eyebrow = "Enquiry",
}: CtaBandProps) {
  const { openQuote } = useQuoteDialog();
  const isLight = tone === "light";

  return (
    <section className={cn("border-t", isLight ? "border-co-ink bg-co-bg" : "border-co-panel bg-co-panel")}>
      <Reveal className="co-shell grid grid-cols-1 items-end gap-x-[clamp(28px,4vw,80px)] gap-y-10 py-[clamp(72px,9vw,140px)] lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className={cn("co-eyebrow mb-6", !isLight && "text-co-panel-faint")}>{eyebrow}</p>
          <h2 className={cn("co-h1 mb-6 max-w-[16ch]", isLight ? "text-co-ink" : "text-co-panel-fg")}>
            {heading}
          </h2>
          <p
            className={cn(
              "max-w-[48ch] text-[clamp(15px,1.3vw,18px)] leading-[1.55]",
              isLight ? "text-co-ink-soft" : "text-co-panel-muted",
            )}
          >
            {body}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 lg:justify-self-end">
          <Button
            type="button"
            size="lg"
            variant={isLight ? "primary" : "onDark"}
            onClick={() => openQuote(subject)}
          >
            {buttonLabel}
          </Button>
          {secondary ? (
            <Button asChild size="lg" variant={isLight ? "secondary" : "secondaryOnDark"}>
              <Link href={secondary.href}>{secondary.label}</Link>
            </Button>
          ) : null}
        </div>
      </Reveal>
    </section>
  );
}
