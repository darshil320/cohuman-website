"use client";

import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site-config";

/**
 * Floating WhatsApp shortcut. Square like every other control — Signal keeps exactly one
 * round shape on the site, the two dots — with no shadow; a 1px canvas rule keeps it
 * legible where it crosses the ink footer.
 */
export function WhatsAppButton() {
  return (
    <a
      data-print="hide"
      href={whatsappHref("Hi Cohuman, I'd like to ask about office furniture for our space.")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("sticky_button")}
      aria-label="Chat with Cohuman on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center border border-co-bg bg-co-ink text-co-bg transition-colors hover:bg-co-ink-soft"
    >
      <MessageCircle className="h-6 w-6" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
