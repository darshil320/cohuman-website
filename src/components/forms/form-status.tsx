import type { ReactNode } from "react";
import { SignalDots } from "@/components/ui/signal-dots";
import { cn } from "@/lib/utils";

/**
 * Shared states for the three lead forms, so a sent enquiry, a booked visit and a bulk
 * order all confirm in the same voice.
 *
 * The sent state is where the two dots mean exactly what the logo device says they mean:
 * something switched on. `role="status"` announces it, because the dots alone cannot.
 */
export function FormSent({
  label,
  title,
  children,
  compact = false,
}: {
  /** Mono status line beside the dots, e.g. "Enquiry received". */
  label: string;
  title: string;
  children: ReactNode;
  compact?: boolean;
}) {
  return (
    <div role="status" className={cn(compact ? "p-6 py-10" : "p-6 py-14 sm:p-8 sm:py-20")}>
      <p className="co-data flex items-center gap-3">
        <SignalDots />
        {label}
      </p>
      <h2 className="co-h3 mt-6 max-w-[22ch]">{title}</h2>
      <p className="mt-3 max-w-[44ch] text-[15px] leading-relaxed text-co-muted">{children}</p>
    </div>
  );
}

/** A submission error, announced. Ink, not red — the palette has no alarm colour. */
export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="co-data mt-5 border-l-2 border-co-ink pl-3 text-co-ink">
      Not sent — {message}
    </p>
  );
}

/** The reassurance line under the submit button. */
export function FormFootnote({ children }: { children: ReactNode }) {
  return <p className="co-eyebrow mt-4 normal-case tracking-normal">{children}</p>;
}

/** The field grid every lead form uses: two columns of underline fields from `sm` up. */
export const FORM_GRID = "grid grid-cols-1 gap-x-8 gap-y-7 sm:grid-cols-2";

/** One label + field pair. */
export const FIELD = "grid gap-1";
