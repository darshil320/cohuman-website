"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

interface EnquireButtonProps extends Omit<ButtonProps, "onClick"> {
  subject: string;
}

export function EnquireButton({ subject, children, ...props }: EnquireButtonProps) {
  const { openQuote } = useQuoteDialog();
  return (
    <Button onClick={() => openQuote(subject)} {...props}>
      {children}
    </Button>
  );
}
