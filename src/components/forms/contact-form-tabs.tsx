"use client";

import { useRef, useState, type KeyboardEvent } from "react";
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
 *
 * Both forms stay mounted and the inactive panel is `hidden`, so switching tabs never
 * throws away what the visitor has typed. The tabs follow the ARIA tabs pattern: one tab
 * stop, ←/→ move between them (Home/End to the ends) and select on the same frame.
 */
export function ContactFormTabs() {
  const [tab, setTab] = useState<Tab>("enquiry");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = TABS.length - 1;
    const next =
      event.key === "ArrowRight" ? (index === last ? 0 : index + 1)
      : event.key === "ArrowLeft" ? (index === 0 ? last : index - 1)
      : event.key === "Home" ? 0
      : event.key === "End" ? last
      : null;
    if (next === null) return;
    event.preventDefault();
    setTab(TABS[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="border border-co-ink bg-co-bg">
      <div role="tablist" aria-label="Contact form" className="grid grid-cols-2 border-b border-co-ink">
        {TABS.map((t, i) => {
          const on = tab === t.id;
          return (
            <button
              key={t.id}
              ref={(node) => {
                tabRefs.current[i] = node;
              }}
              type="button"
              role="tab"
              id={`contact-tab-${t.id}`}
              aria-selected={on}
              aria-controls={`contact-panel-${t.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => setTab(t.id)}
              onKeyDown={(event) => onKeyDown(event, i)}
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
      {TABS.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`contact-panel-${t.id}`}
          aria-labelledby={`contact-tab-${t.id}`}
          hidden={tab !== t.id}
        >
          {t.id === "enquiry" ? <EnquiryForm compact /> : <ShowroomVisitForm />}
        </div>
      ))}
    </div>
  );
}
