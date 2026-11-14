"use client";

import Link from "next/link";
import { LocalTime } from "@/components/common/local-time";
import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { footerColumns } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

/**
 * Site footer — on ink.
 *
 * The one solid ink band on every page, so it reads as a deliberate close. The reversed
 * master logo, a claim in display caps, mono columns on hairlines, and the quote action
 * as an outline button (the header already carries the dots).
 */
export function SiteFooter() {
  const { openQuote } = useQuoteDialog();
  const year = new Date().getFullYear();

  return (
    <footer data-print="hide" className="bg-co-panel text-co-panel-muted">
      <div className="co-shell">
        {/* Phones: the two link lists sit side by side, so the footer is one screen, not two. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 border-b border-co-panel-border py-[clamp(56px,7vw,104px)] lg:grid-cols-[1.6fr_repeat(3,1fr)] lg:gap-x-[clamp(32px,4vw,72px)]">
          <div className="col-span-2 lg:col-span-1">
            <Logo tone="light" className="mb-9 w-[168px]" sizes="168px" />
            <p className="co-h3 mb-9 max-w-[18ch] text-co-panel-fg">
              Precision-made modular office furniture, built in Surat.
            </p>
            <Button type="button" variant="secondaryOnDark" onClick={() => openQuote()}>
              Get a quote
            </Button>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="co-eyebrow mb-5 text-co-panel-faint">{col.title}</p>
              <ul className="grid border-t border-co-panel-border">
                {col.links.map((link) => (
                  <li key={link.href} className="border-b border-co-panel-border">
                    <Link
                      href={link.href}
                      className="co-data flex min-h-11 items-center text-co-panel-muted transition-colors hover:text-co-panel-fg"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="col-span-2 sm:col-span-1">
            <p className="co-eyebrow mb-5 text-co-panel-faint">Get in touch</p>
            <address className="grid gap-3 border-t border-co-panel-border pt-3.5 text-[14px] not-italic leading-relaxed">
              <span className="text-co-panel-fg">{siteConfig.address.line1}</span>
              <span className="text-co-panel-muted">{siteConfig.address.line2}</span>
              <a
                href={`tel:+${siteConfig.phoneE164}`}
                className="co-data flex min-h-11 items-center text-co-panel-muted transition-colors hover:text-co-panel-fg"
              >
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.social.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="co-data flex min-h-11 items-center normal-case text-co-panel-muted transition-colors hover:text-co-panel-fg"
              >
                Instagram {siteConfig.social.instagram.handle}
              </a>
              {siteConfig.emails.map((inbox) => (
                <a
                  key={inbox.address}
                  href={`mailto:${inbox.address}`}
                  className="co-data flex min-h-11 items-center break-all normal-case text-co-panel-muted transition-colors hover:text-co-panel-fg"
                >
                  {inbox.address}
                </a>
              ))}
              <Button asChild variant="linkOnDark" arrow className="mt-2 justify-self-start">
                <Link href="/contact">Enquiry form</Link>
              </Button>
            </address>
          </div>
        </div>

        <div className="co-data flex flex-wrap items-center justify-between gap-4 py-6 text-co-panel-faint">
          <span>
            © {year} Cohuman · {siteConfig.legalName}, Surat
          </span>
          <span>{siteConfig.cities.join(" · ")}</span>
          <span>{siteConfig.coordinates.label}</span>
          <LocalTime />
          <span>Founded by {siteConfig.founder}</span>
        </div>
      </div>
    </footer>
  );
}
