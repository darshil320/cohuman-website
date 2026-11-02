"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { trackQuoteOpened } from "@/lib/analytics";

interface QuoteDialogContextValue {
  openQuote: (subject?: string) => void;
}

const QuoteDialogContext = createContext<QuoteDialogContextValue | null>(null);

export function useQuoteDialog() {
  const ctx = useContext(QuoteDialogContext);
  if (!ctx) throw new Error("useQuoteDialog must be used within QuoteDialogProvider");
  return ctx;
}

export function QuoteDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState<string | undefined>(undefined);

  const openQuote = useCallback((nextSubject?: string) => {
    setSubject(nextSubject);
    setOpen(true);
    trackQuoteOpened(nextSubject ?? "general");
  }, []);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteDialogContext.Provider value={value}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/* Flat ink veil, no blur: Signal has no glass. */}
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-co-ink/70" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(600px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-ink bg-co-bg">
            <div className="flex items-start justify-between gap-6 border-b border-co-ink p-6 sm:px-8 sm:py-7">
              <div className="min-w-0">
                <p className="co-eyebrow">Enquiry — get a quote</p>
                <Dialog.Title className="co-h3 mt-3 max-w-[24ch]">
                  {subject ? `Enquiring about ${subject}` : "Tell us about the space"}
                </Dialog.Title>
                <Dialog.Description className="mt-2.5 max-w-[42ch] text-[15px] text-co-muted">
                  A floor plan and a headcount are enough to start.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-co-ink text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Dialog.Close>
            </div>
            <EnquiryForm defaultInterest={subject} onSuccess={() => undefined} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </QuoteDialogContext.Provider>
  );
}
