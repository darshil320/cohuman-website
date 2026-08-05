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
  tone?: "green" | "dark";
}

export function CtaBand({
  heading,
  body,
  buttonLabel = "Request a Quote",
  subject,
  tone = "green",
}: CtaBandProps) {
  const { openQuote } = useQuoteDialog();
  const isGreen = tone === "green";

  return (
    <section className={cn(isGreen ? "bg-co-green" : "bg-co-panel")}>
      <Reveal className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-8 px-[18px] py-14 sm:px-6 sm:py-20 lg:px-11">
        <div>
          <h2
            className={cn(
              "mb-2.5 max-w-[24ch] font-display text-[26px] font-medium leading-[1.06] tracking-tight sm:text-[36px] lg:text-[44px]",
              isGreen ? "text-co-cta-green-ink" : "text-co-panel-fg",
            )}
          >
            {heading}
          </h2>
          <p
            className={cn(
              "max-w-[46ch] text-[16.5px]",
              isGreen ? "text-[#24380F]" : "text-co-panel-muted",
            )}
          >
            {body}
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => openQuote(subject)}
          className={cn(
            "whitespace-nowrap",
            isGreen ? "bg-co-cta-green-ink text-co-green-paler hover:bg-co-ink" : "",
          )}
        >
          {buttonLabel}
        </Button>
      </Reveal>
    </section>
  );
}
