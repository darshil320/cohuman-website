"use client";

import { useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ShowroomVisitForm } from "@/components/forms/showroom-visit-form";
import { cn } from "@/lib/utils";

type Tab = "enquiry" | "visit";

const TABS: { id: Tab; label: string }[] = [
  { id: "enquiry", label: "General enquiry" },
  { id: "visit", label: "Book a showroom visit" },
];

/**
 * Enquiry / showroom-visit switch on the contact page.
 *
 * The active tab carries the green bar — the logo's bar, used as the active underline —
 * and `aria-selected`, so the state is in the markup as well as the colour.
 */
export function ContactFormTabs() {
  const [tab, setTab] = useState<Tab>("enquiry");

  return (
    <div className="border border-co-ink bg-co-bg">
      <div role="tablist" aria-label="Contact form" className="grid grid-cols-2 border-b border-co-ink">
        {TABS.map((t, i) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`contact-tab-${t.id}`}
              aria-selected={on}
              aria-controls={on ? `contact-panel-${t.id}` : undefined}
              onClick={() => setTab(t.id)}
              className={cn(
                "co-data relative px-4 py-4 text-left transition-colors sm:px-6",
                i > 0 && "border-l border-co-ink",
                on ? "bg-co-bg-alt text-co-ink" : "text-co-muted-2 hover:text-co-ink",
              )}
            >
              <span className="mr-2 text-co-muted-2">{String(i + 1).padStart(2, "0")}</span>
              {t.label}
              {on ? <span aria-hidden className="absolute inset-x-0 -bottom-px block h-[3px] bg-co-green" /> : null}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={`contact-panel-${tab}`} aria-labelledby={`contact-tab-${tab}`}>
        {tab === "enquiry" ? <EnquiryForm compact /> : <ShowroomVisitForm />}
      </div>
    </div>
  );
}
