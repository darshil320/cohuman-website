"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { trackQuoteOpened } from "@/lib/analytics";

interface QuoteDialogContextValue {
  /**
   * `subject` is the short "interest" line (≤200 chars, one line); `details` — e.g. a
   * configurator's full specification — prefills the Requirements field instead.
   */
  openQuote: (subject?: string, details?: string) => void;
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
  const [details, setDetails] = useState<string | undefined>(undefined);
  // The dialog is opened from code, not a Radix Trigger, so Radix has nothing to hand
  // focus back to on close; remember the control that opened it.
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openQuote = useCallback((nextSubject?: string, nextDetails?: string) => {
    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setSubject(nextSubject);
    setDetails(nextDetails);
    setOpen(true);
    trackQuoteOpened(nextSubject ?? "general");
  }, []);

  // Q opens the quote dialog from anywhere — unless the visitor is typing, holding a
  // modifier, or already inside a dialog or menu.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "q" && event.key !== "Q") return;
      if (event.defaultPrevented || event.repeat || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.closest("input, textarea, select, [contenteditable=''], [contenteditable='true']")) return;
      if (document.querySelector("[role=dialog], #mobile-menu[data-open], #collections-panel[data-open]")) return;
      event.preventDefault();
      openQuote();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [openQuote]);

  const value = useMemo(() => ({ openQuote }), [openQuote]);

  return (
    <QuoteDialogContext.Provider value={value}>
      {children}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          {/*
            Flat ink veil, no blur: Signal has no glass. The panel wipes down from its top
            edge while settling from 0.97 (`co-modal`); the veil arrives at once and holds
            until the panel has left (`co-veil`) — Signal has no fades.
          */}
          <Dialog.Overlay className="co-veil fixed inset-0 z-[70] bg-co-ink/70" />
          <Dialog.Content
            onCloseAutoFocus={(event) => {
              const target = returnFocusRef.current;
              // Not if it has gone or sits in a closed panel (the mobile menu's quote button).
              if (!target || !target.isConnected || target.closest("[inert]")) return;
              event.preventDefault();
              target.focus({ preventScroll: true });
            }}
            className="co-modal fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(600px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-ink bg-co-bg">
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
                className="co-hit flex h-10 w-10 shrink-0 items-center justify-center border border-co-ink text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </Dialog.Close>
            </div>
            <EnquiryForm defaultInterest={subject} defaultMessage={details} onSuccess={() => undefined} />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </QuoteDialogContext.Provider>
  );
}
