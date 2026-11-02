"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

interface EnquireButtonProps extends Omit<ButtonProps, "onClick"> {
  subject: string;
}

/**
 * A `Button` that opens the quote dialog with `subject` prefilled — the one client
 * boundary a server page needs for an enquiry action. Styling is the Signal `Button`
 * (square, mono label); pick the tone with `variant`. `type` defaults to `"button"` so
 * it never submits a surrounding form.
 */
export function EnquireButton({ subject, children, type = "button", ...props }: EnquireButtonProps) {
  const { openQuote } = useQuoteDialog();
  return (
    <Button type={type} onClick={() => openQuote(subject)} {...props}>
      {children}
    </Button>
  );
}
