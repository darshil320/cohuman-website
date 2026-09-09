import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

/*
  404. Previously this route fell back to Next's built-in page, which serves an unstyled
  black-on-white "404 | This page could not be found" with no header, no footer and no
  way onward — a dead end on a site whose entire purpose is to route a visitor to an
  enquiry.

  `robots` has to be restated. Next emits its own `noindex` for this route, but the
  root layout's `index, follow` still merges down on top of it — leaving the head with
  one tag saying index and another saying not. Overriding it here makes both tags agree.
*/
export const metadata: Metadata = {
  title: "Page not found",
  description:
    "That page does not exist. Browse the catalog, the desking series, or ask for a quote.",
  robots: { index: false, follow: true },
};

const ROUTES = [
  { href: "/catalog", label: "Catalog", note: "Every product, by category and price band." },
  { href: "/collections", label: "Desking series", note: "Configure a size, then enquire." },
  { href: "/sectors", label: "Sectors", note: "Executive, healthcare and residential work." },
  { href: "/contact", label: "Contact", note: "Ask a specifier, or book a showroom visit." },
];

export default function NotFound() {
  return (
    <section className="mx-auto max-w-[1320px] px-[18px] py-[clamp(56px,8vw,110px)] sm:px-6 lg:px-11">
      <p className="mb-3 text-[11.5px] font-semibold uppercase tracking-[0.2em] text-co-faint">
        404
      </p>
      <h1 className="mb-4 max-w-[20ch] font-display text-[clamp(32px,4.6vw,56px)] font-medium leading-[1.04] tracking-tight">
        That page is not here.
      </h1>
      <p className="mb-[clamp(28px,4vw,44px)] max-w-[52ch] text-[clamp(16px,1.4vw,19px)] font-light leading-relaxed text-co-muted">
        The link may be out of date, or the page may have moved in the rebrand. Everything
        below still works — or write to{" "}
        <a href={`mailto:${siteConfig.email}`} className="underline hover:text-co-ink">
          {siteConfig.email}
        </a>{" "}
        and someone will point you at the right place.
      </p>

      <ul className="grid gap-px border border-co-border bg-co-border sm:grid-cols-2">
        {ROUTES.map((route) => (
          <li key={route.href} className="bg-co-bg">
            <Link
              href={route.href}
              className="group flex h-full flex-col justify-between gap-3 p-[clamp(20px,2.4vw,32px)] transition-colors hover:bg-co-bg-alt"
            >
              <span className="flex items-center gap-2 font-display text-[19px] font-semibold">
                {route.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
              <span className="text-[14.5px] font-light leading-relaxed text-co-muted">
                {route.note}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
