"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { footerColumns } from "@/lib/nav";
import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

export function SiteFooter() {
  const { openQuote } = useQuoteDialog();

  return (
    <footer className="bg-co-panel pt-12 text-co-panel-muted sm:pt-16">
      <div className="mx-auto max-w-[1320px] px-[18px] sm:px-6 lg:px-11">
        <div className="grid grid-cols-1 gap-8 pb-10 sm:grid-cols-2 sm:gap-14 lg:grid-cols-4 lg:pb-16">
          <div className="sm:col-span-2">
            <div className="mb-4 flex items-center gap-2.5">
              <Image
                src="/logo.jpg"
                alt="CoHuman Modularr LLP"
                width={200}
                height={50}
                className="h-8 w-auto object-contain mix-blend-screen"
              />
            </div>
            <p className="mb-5 max-w-[34ch] text-[15px] font-light leading-relaxed">
              People-first office furniture, made in Surat. A {siteConfig.legalName} brand,
              crafting spaces since {siteConfig.foundedYear}.
            </p>
            <Button variant="outlineOnDark" size="sm" onClick={() => openQuote()}>
              Request a Quote
            </Button>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-co-panel-faint">
                {col.title}
              </p>
              <div className="grid gap-2.5">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[14.5px] font-light text-co-panel-muted hover:text-co-panel-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-co-panel-faint">
              Get in touch
            </p>
            <div className="grid gap-2.5 text-[14.5px] font-light">
              <span className="text-co-panel-muted">Showroom · {siteConfig.address.line2}</span>
              <span className="text-[13px] text-co-panel-faint">{siteConfig.address.line1}</span>
              <span className="text-[13px] text-co-panel-faint">{siteConfig.phoneDisplay}</span>
              {siteConfig.emails.map((inbox) => (
                <a
                  key={inbox.address}
                  href={`mailto:${inbox.address}`}
                  className="break-all text-[13px] text-co-panel-faint hover:text-co-panel-fg"
                >
                  {inbox.address}
                </a>
              ))}
              <Link href="/contact" className="mt-1 font-medium text-co-green-pale">
                Enquiry form →
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-co-panel-border py-[22px] text-[13px] text-co-panel-faint">
          <span>
            © {new Date().getFullYear()} Cohuman · {siteConfig.legalName}, Surat
          </span>
          <span>
            Founded by {siteConfig.founder}, {siteConfig.foundedYear}
          </span>
        </div>
      </div>
    </footer>
  );
}
