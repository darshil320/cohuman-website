"use client";

import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { cn } from "@/lib/utils";

import { Reveal } from "@/components/ui/scroll-reveal";

interface CtaBandProps {
  heading: string;
  body: string;
  buttonLabel?: string;
  subject?: string;
  /** `light` is a bone-toned band with ink type; `dark` is the near-black panel. */
  tone?: "light" | "dark";
}

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
    <section
      className={cn(
        isLight ? "border-y border-co-border bg-co-bg-alt" : "bg-co-panel",
      )}
    >
      <Reveal className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-8 px-[18px] py-14 sm:px-6 sm:py-20 lg:px-11">
        <div>
          <h2
            className={cn(
              "mb-2.5 max-w-[24ch] font-display text-[26px] font-medium leading-[1.06] tracking-tight sm:text-[36px] lg:text-[44px]",
              isLight ? "text-co-ink" : "text-co-panel-fg",
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "max-w-[46ch] text-[16.5px]",
              isLight ? "text-co-muted" : "text-co-panel-muted",
            )}
          >
            {body}
          </p>
        </div>
        <Button
          size="lg"
          variant={isLight ? "primary" : "onDark"}
          onClick={() => openQuote(subject)}
          className="whitespace-nowrap"
        >
          {buttonLabel}
        </Button>
      </Reveal>
    </section>
  );
}
