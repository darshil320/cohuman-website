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
          <Dialog.Overlay className="fixed inset-0 z-[70] bg-co-panel/60 backdrop-blur-sm data-[state=open]:animate-co-fade" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(560px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-card-border bg-white">
            <div className="flex items-start justify-between border-b border-co-border p-6 sm:p-8 sm:pb-0">
              <div>
                <Dialog.Title className="font-display text-2xl font-medium tracking-tight">
                  {subject ? `Enquiring about ${subject}` : "Tell us about the space"}
                </Dialog.Title>
                <Dialog.Description className="mt-2 max-w-[42ch] pb-6 text-[15px] text-co-muted">
                  A floor plan and a headcount are enough to start.
                </Dialog.Description>
              </div>
              <Dialog.Close
                aria-label="Close"
                className="shrink-0 p-1 text-co-faint hover:text-co-ink"
              >
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <EnquiryForm defaultInterest={subject} onSuccess={() => undefined} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </QuoteDialogContext.Provider>
  );
}
