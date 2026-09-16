"use client";

import Link from "next/link";
import { Wordmark } from "@/components/common/wordmark";
import { useQuoteDialog } from "@/components/providers/quote-dialog-provider";
import { footerColumns } from "@/lib/nav";
import { siteConfig } from "@/lib/site-config";

/**
 * Site footer.
 *
 * The one dark surface on the site, so it reads as a deliberate close rather than as
 * another panel. Everything inside it is type on hairlines — the outlined button became
 * an underlined link so the footer uses the same action language as the rest of the site.
 */
export function SiteFooter() {
  const { openQuote } = useQuoteDialog();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-co-panel text-co-panel-muted">
      <div className="co-shell">
        <div className="grid grid-cols-1 gap-y-12 border-b border-co-panel-border py-[clamp(48px,6vw,92px)] sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)] lg:gap-x-[clamp(32px,4vw,72px)]">
          <div className="max-w-[38ch] sm:col-span-2 lg:col-span-1">
            {/* Text, so the dark panel needs no second asset — `text-co-panel-fg` is the
                only difference from the header's mark. The old pair of PNGs existed
                purely because a charcoal raster wordmark vanished on near-black. */}
            <Wordmark className="mb-7 block text-[22px] text-co-panel-fg" />
            <p className="mb-8 max-w-[32ch] font-display text-[clamp(20px,2vw,28px)] font-medium leading-[1.14] tracking-[-0.03em] text-co-panel-fg">
              People-first office furniture, made in Surat since {siteConfig.foundedYear}.
            </p>
            <button
              type="button"
              onClick={() => openQuote()}
              className="border-b-2 border-co-panel-fg pb-1.5 text-[14.5px] font-semibold text-co-panel-fg transition-colors hover:border-co-panel-faint hover:text-co-panel-muted"
            >
              Request a Quote
            </button>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="co-eyebrow mb-6 text-co-panel-faint">{col.title}</p>
              <div className="grid gap-3.5">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[14px] font-light text-co-panel-muted transition-colors hover:text-co-panel-fg"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          <div>
            <p className="co-eyebrow mb-6 text-co-panel-faint">Get in touch</p>
            <div className="grid gap-3.5 text-[14px] font-light">
              <span className="text-co-panel-muted">{siteConfig.address.line2}</span>
              <span className="text-[13px] leading-relaxed text-co-panel-faint">
                {siteConfig.address.line1}
              </span>
              <span className="text-[13px] text-co-panel-faint">{siteConfig.phoneDisplay}</span>
              {siteConfig.emails.map((inbox) => (
                <a
                  key={inbox.address}
                  href={`mailto:${inbox.address}`}
                  className="break-all text-[13px] text-co-panel-faint transition-colors hover:text-co-panel-fg"
                >
                  {inbox.address}
                </a>
              ))}
              <Link
                href="/contact"
                className="mt-2 border-b border-co-panel-border pb-1 text-[13.5px] font-medium text-co-panel-fg transition-colors hover:border-co-panel-fg"
              >
                Enquiry form
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 py-7 text-[11px] font-medium uppercase tracking-[0.16em] text-co-panel-faint">
          <span>
            © {year} Cohuman · {siteConfig.legalName}, Surat
          </span>
          <span>
            Founded by {siteConfig.founder}, {siteConfig.foundedYear}
          </span>
        </div>
      </div>
    </footer>
  );
}
