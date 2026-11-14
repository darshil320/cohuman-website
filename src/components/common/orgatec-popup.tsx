"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { SpecRows } from "@/components/ui/spec-rows";
import { ORGATEC_2026, isAnnouncementLive } from "@/lib/events/orgatec";

/** Session key: once dismissed, the popup stays away for the rest of the visit. */
const DISMISSED_KEY = "co-orgatec-2026-dismissed";

/**
 * Let the visitor read first: the popup asks for attention only after they have had
 * time with the page (client decision: 8–10s).
 */
const OPEN_DELAY_MS = 9000;
/** If they are busy at that moment (in a dialog, typing in a form), ask again later. */
const RETRY_MS = 3000;

/** Never interrupt: another dialog is open, or focus is in a form field. */
function visitorIsBusy(): boolean {
  if (document.querySelector("[role=dialog]")) return true;
  return document.activeElement?.closest("input, textarea, select") != null;
}

function readDismissed(): boolean {
  try {
    return window.sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    // Storage blocked (private mode, strict settings): treat as not dismissed.
    return false;
  }
}

function writeDismissed(): void {
  try {
    window.sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Storage blocked: the popup may show again on the next page — acceptable.
  }
}

/**
 * The ORGATEC announcement (client decision, Nov 2026): booth, dates and venue only — no
 * sign-up, no form. Opens once per session after the page settles, and stops rendering
 * on its own when the show ends (`ORGATEC_2026.endsAt`). Built in Signal — canvas, ink,
 * square corners — not in the organiser's red and yellow.
 *
 * Decides on the client only, so the server HTML never carries it and the date check
 * uses the visitor's clock rather than the build's.
 */
export function OrgatecPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAnnouncementLive(ORGATEC_2026, new Date()) || readDismissed()) return;
    let timer = 0;
    const attempt = () => {
      if (visitorIsBusy()) {
        timer = window.setTimeout(attempt, RETRY_MS);
        return;
      }
      setOpen(true);
    };
    timer = window.setTimeout(attempt, OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) writeDismissed();
  };

  const show = ORGATEC_2026;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/*
            Flat ink veil, no blur: Signal has no glass. The panel wipes down from its top
            edge while settling from 0.97 (`co-modal`); the veil arrives at once and holds
            until the panel has left (`co-veil`) — Signal has no fades.
          */}
        <Dialog.Overlay className="co-veil fixed inset-0 z-[70] bg-co-ink/70" />
        <Dialog.Content className="co-modal fixed left-1/2 top-1/2 z-[71] max-h-[90vh] w-[min(480px,92vw)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto border border-co-ink bg-co-bg">
          <div className="flex items-start justify-between gap-6 border-b border-co-ink p-6 sm:px-8 sm:py-7">
            <Logo className="w-[160px]" sizes="160px" />
            <Dialog.Close
              aria-label="Close"
              className="flex h-11 w-11 shrink-0 items-center justify-center border border-co-ink text-co-ink transition-colors hover:bg-co-ink hover:text-co-bg"
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </Dialog.Close>
          </div>

          <div className="p-6 sm:px-8 sm:py-8">
            <p className="co-eyebrow">Meet us at</p>
            <Dialog.Title className="co-h2 mt-3">{show.name}</Dialog.Title>
            <Dialog.Description className="mt-3 text-[15px] leading-[1.55] text-co-ink-soft">
              Come meet our team and see our latest workspace solutions at booth {show.booth}.
            </Dialog.Description>

            <SpecRows
              className="mt-7"
              rows={[
                { k: "Booth", v: show.booth },
                { k: "Dates", v: show.datesLabel },
                { k: "Venue", v: `${show.venue}, ${show.city}` },
              ]}
            />

            <Dialog.Close asChild>
              <Button type="button" still className="mt-8 w-full sm:w-auto">
                See you there
              </Button>
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
