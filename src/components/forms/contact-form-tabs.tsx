"use client";

import { useState } from "react";
import { EnquiryForm } from "@/components/forms/enquiry-form";
import { ShowroomVisitForm } from "@/components/forms/showroom-visit-form";
import { cn } from "@/lib/utils";

type Tab = "enquiry" | "visit";

export function ContactFormTabs() {
  const [tab, setTab] = useState<Tab>("enquiry");

  return (
    <div className="border border-co-card-border bg-white">
      <div className="flex border-b border-co-border">
        <button
          type="button"
          onClick={() => setTab("enquiry")}
          className={cn(
            "flex-1 px-4 py-4 text-[14.5px] font-semibold",
            tab === "enquiry"
              ? "border-b-2 border-co-green bg-co-bg-alt text-co-ink"
              : "text-co-muted-2",
          )}
        >
          General enquiry
        </button>
        <button
          type="button"
          onClick={() => setTab("visit")}
          className={cn(
            "flex-1 px-4 py-4 text-[14.5px] font-semibold",
            tab === "visit"
              ? "border-b-2 border-co-green bg-co-bg-alt text-co-ink"
              : "text-co-muted-2",
          )}
        >
          Book a showroom visit
        </button>
      </div>
      {tab === "enquiry" ? <EnquiryForm compact /> : <ShowroomVisitForm />}
    </div>
  );
}
