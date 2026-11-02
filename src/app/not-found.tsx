import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeading } from "@/components/common/section-heading";
import { Button } from "@/components/ui/button";
import { DimensionLine } from "@/components/ui/dimension-line";
import { HairlineGrid } from "@/components/ui/hairline-grid";
import { KineticHeading } from "@/components/ui/kinetic-heading";
import { Reveal } from "@/components/ui/scroll-reveal";
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

/** The index grid, as `IndexRow` draws it, with the route path in the range column. */
const ROW_GRID =
  "grid grid-cols-[40px_minmax(0,1fr)_24px] items-center gap-x-4 md:grid-cols-[64px_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,0.8fr)_48px] lg:grid-cols-[90px_minmax(0,360px)_minmax(0,1fr)_260px_60px]";

export default function NotFound() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-co-ink">
        <HairlineGrid />
        <div className="co-shell relative pb-[clamp(48px,6vw,96px)] pt-[clamp(48px,7vw,104px)]">
          <p className="co-data">Error 404</p>
          <h1 className="co-display mt-[clamp(20px,2.6vw,36px)] max-w-[14ch] text-[clamp(40px,7vw,104px)]">
            <KineticHeading>That page is not here.</KineticHeading>
          </h1>
          <DimensionLine label="0 mm — page not found" className="mt-10 w-full max-w-[560px]" />
          <p className="co-lead mt-10 max-w-[52ch]">
            The link may be out of date, or the page may have moved in the rebrand. Everything
            below still works — or write to{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-co-ink underline decoration-co-border underline-offset-4 hover:decoration-co-ink"
            >
              {siteConfig.email}
            </a>{" "}
            and someone will point you at the right place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/">Back to the homepage</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/contact">Ask a specifier</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="co-shell co-section">
        <SectionHeading eyebrow="01 / Routes" title="Everything below still works." className="mb-0" />
        <Reveal>
          <div aria-hidden className={`${ROW_GRID} co-eyebrow border-b border-co-border py-3.5`}>
            <span>No.</span>
            <span>Page</span>
            <span className="hidden md:block">What is there</span>
            <span className="hidden md:block">Route</span>
            <span />
          </div>
          <ul>
            {ROUTES.map((route, i) => (
              <li key={route.href}>
                <Link
                  href={route.href}
                  className={`${ROW_GRID} group min-h-[84px] border-b border-co-border py-4 transition-colors duration-150 hover:bg-co-bg-alt focus-visible:bg-co-bg-alt md:min-h-[96px]`}
                >
                  <span className="co-data">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-[clamp(24px,2.8vw,40px)] font-semibold leading-[0.9] tracking-[-0.02em]">
                      {route.label}
                    </span>
                    <span className="mt-1.5 block text-[14px] text-co-muted md:hidden">{route.note}</span>
                  </span>
                  <span className="hidden min-w-0 text-[16px] text-co-ink-soft md:block">{route.note}</span>
                  <span className="co-data hidden min-w-0 normal-case md:block">{route.href}</span>
                  <span
                    aria-hidden
                    className="justify-self-end text-[18px] leading-none transition-transform duration-150 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
