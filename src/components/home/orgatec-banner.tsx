"use client";

import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";

export function OrgatecBanner() {
  const { openQuote } = useQuoteDialog();

  return (
    <section className="bg-co-panel text-co-panel-fg border-b border-co-border relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-co-green/10 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-co-green/5 rounded-full blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-[1320px] px-[18px] py-[clamp(40px,5vw,60px)] sm:px-6 lg:px-11 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-[44ch]">
            <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-green-light flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-co-green animate-pulse" />
              Event Announcement
            </p>
            <h2 className="mb-4 font-display text-[clamp(28px,3.6vw,44px)] font-medium leading-[1.06] tracking-tight text-white">
              Meet Cohuman at ORGATEC
            </h2>
            <p className="mb-6 text-[15.5px] font-light leading-relaxed text-co-panel-muted">
              We are attending the leading international trade fair for the modern working world. Stop by to see our latest modular systems or discuss your next project.
            </p>
            
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-[13.5px] font-medium text-co-panel-muted mb-8 md:mb-0">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-co-green" />
                <span>Nov 19–21, 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-co-green" />
                <span>Jio World Convention Centre, Mumbai</span>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => openQuote("Meeting at ORGATEC")}
              className="group flex items-center justify-center gap-2 rounded-md bg-[#6fa82b] px-[26px] py-[14px] text-[15px] font-semibold text-[#0d140e] shadow-[0_0_15px_rgba(111,168,43,0.3)] transition-all hover:bg-[#80bc33]"
            >
              Book a Consultation
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <Link
              href="/collections"
              className="flex items-center justify-center rounded-md border border-co-panel-border bg-white/5 px-[25px] py-[14px] text-[15px] font-semibold text-white backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
            >
              See collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
