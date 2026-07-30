"use client";

import { MessageCircle } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";
import { whatsappHref } from "@/lib/site-config";

export function WhatsAppButton() {
  return (
    <a
      href={whatsappHref("Hi Cohuman, I'd like to ask about office furniture for our space.")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackWhatsAppClick("sticky_button")}
      aria-label="Chat with Cohuman on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
    </a>
  );
}
