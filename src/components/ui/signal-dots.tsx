import { cn } from "@/lib/utils";

/**
 * The two dots from above the M in the wordmark — the only round thing on the site.
 *
 * They mean "on": the selected finish, the quote action, a form that sent. They are never
 * decoration, and there is one green thing per view, so before adding a pair, check
 * nothing else on that screen is already lit.
 *
 * Decorative to assistive tech: whatever state they mark must also be in the markup
 * (`aria-pressed`, a status message), because 2.35:1 green on canvas cannot carry it
 * alone.
 */
export function SignalDots({ size = "sm", className }: { size?: "sm" | "lg"; className?: string }) {
  const dot = cn("block rounded-full bg-co-green", size === "lg" ? "h-[22px] w-[22px]" : "h-[7px] w-[7px]");
  return (
    <span aria-hidden className={cn("inline-flex shrink-0 items-center", size === "lg" ? "gap-3" : "gap-1", className)}>
      <span className={dot} />
      <span className={dot} />
    </span>
  );
}
