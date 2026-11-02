import type { Metadata } from "next";
import { Archivo, Martian_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { HEADER_HEIGHT } from "@/lib/layout";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { QuoteDialogProvider } from "@/components/providers/quote-dialog-provider";
import { ORGANIZATION_ID } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";
import { ALL_SERIES } from "@/lib/series";
import { collectionPhoto } from "@/lib/photos";
import type { DrawerRange, DrawerSeries } from "@/components/layout/nav-drawer";
import { catalog, isPhotographed } from "@/lib/catalog";

/*
  Two variable families cover the whole site.

  - Archivo carries both display and body. `axes: ["wdth"]` adds the width axis (62–125)
    to the default weight axis, so Archivo Expanded — the display face — is this same
    file at `font-stretch: 125%`, not a second download. Body text sits at the default
    width of 100.
  - Martian Mono carries every measured value, code, size and label, at
    `font-stretch: 87.5%`.

  `weight` is deliberately absent: on a variable font it would make Next fetch one
  static instance per value instead of the single variable file. `display`, `preload`
  and `adjustFontFallback` stay at their defaults; `subsets` is what makes Next inject
  the preload link.
*/
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Office furniture designed around the people who use it — desking, ergonomic seating, conference tables, storage and reception furniture, designed and manufactured in Surat.",
  /*
    No `alternates` here on purpose. Metadata merges down from the layout, so a
    `canonical: "/"` at this level was inherited by every route that did not set its
    own — /about, /catalog, /projects and the rest all emitted a canonical pointing at
    the homepage, which asks crawlers to drop them from the index. Each page declares
    its own canonical instead; `metadataBase` above resolves the relative paths.
  */
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.legalName, url: siteConfig.url }],
  creator: siteConfig.legalName,
  publisher: siteConfig.legalName,
  category: "Office furniture",
  /*
    Keywords carry almost no weight with Google, but answer engines and the crawlers
    behind them do read them, and this is a lead-gen site whose entire job is to be
    found for "office furniture Surat"-shaped queries. Kept short and literal — a
    padded list reads as spam to the same models it is meant to inform.
  */
  keywords: [
    "office furniture Surat",
    "office furniture manufacturer Gujarat",
    "modular workstations India",
    "height adjustable desk India",
    "ergonomic office chairs Surat",
    "conference table manufacturer",
    "office fit-out contractor Surat",
    "corporate furniture bulk order",
    siteConfig.legalName,
  ],
  // The site should be indexed in full; `max-image-preview: large` is what lets Google
  // show the photography in image and Discover results rather than a thumbnail.
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  // Safari and some Android browsers linkify anything digit-shaped — dimensions, part
  // numbers and price bands all turn into tel: links without this.
  formatDetection: { telephone: false, address: false, email: false },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Office furniture designed around the people who use it. Request a quote for your space.",
    // No `images` here: `src/app/opengraph-image.tsx` is the site-wide share card, and
    // file-based metadata takes priority over this object anyway. Listing a second image
    // here would only invite the two to drift apart.
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Office furniture designed around the people who use it. Request a quote for your space.",
  },
};

/*
  Structured data. Three nodes in one `@graph` rather than three separate script tags,
  so `@id` references resolve between them:

  - Organization  — the company. `brand`/`areaServed`/`knowsAbout` are what answer
                    engines read when asked "who is Cohuman"; the `@id` is the stable
                    identity every other node points at. No `sameAs`: the client has
                    not confirmed any social or directory profile, and pointing it at a
                    guessed handle would attach someone else's account to this company.
  - WebSite       — the site itself, with `publisher` pointing back at the Organization.
                    No `SearchAction`: the site has no /search route, and declaring a
                    search endpoint that 404s is worse than declaring none.
  - FurnitureStore — the physical Surat showroom and factory, which is the node that can
                    win a local pack. Kept distinct from Organization because the company
                    also sells through Mumbai and Ahmedabad, which are not this address.

  Everything derives from `siteConfig`, so a corrected phone number or a new office
  updates the markup without a second edit here.
*/
/*
  The Collections drawer's plates, read off the series specifications rather than written
  as copy: the configuration count and the millimetre span in the header can never drift
  from what /collections/<slug> actually offers.
*/
const DRAWER_SERIES: DrawerSeries[] = ALL_SERIES.map((series) => {
  const lens = series.configs.flatMap((config) => config.lens);
  return {
    slug: series.slug,
    wordmark: series.wordmark,
    name: series.name,
    kicker: series.eyebrow,
    blurb: series.promise,
    image: collectionPhoto[series.slug],
    configs: series.configs.length,
    span: `${Math.min(...lens)}–${Math.max(...lens)}\u00A0mm`,
  };
});

const WEBSITE_ID = `${siteConfig.url}/#website`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      alternateName: "Cohuman Modularr",
      url: siteConfig.url,
      // The master wordmark, not a photograph: `logo` is what search engines use for the
      // knowledge panel, and it must be the supplied artwork rather than a crop of a room.
      logo: `${siteConfig.url}/brand/logo-black.png`,
      image: `${siteConfig.url}/opengraph-image`,
      description:
        "Office furniture manufacturer and fit-out contractor in Surat, Gujarat. Desking systems, ergonomic seating, conference tables, storage and reception furniture, supplied on quotation.",
      founder: siteConfig.founders.map((name) => ({ "@type": "Person", name })),
      email: siteConfig.email,
      telephone: siteConfig.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.line1,
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        postalCode: "394510",
        addressCountry: "IN",
      },
      areaServed: [
        { "@type": "State", name: "Gujarat" },
        { "@type": "State", name: "Maharashtra" },
        { "@type": "Country", name: "India" },
      ],
      contactPoint: siteConfig.emails.map((inbox) => ({
        "@type": "ContactPoint",
        contactType: inbox.label,
        email: inbox.address,
        areaServed: "IN",
        availableLanguage: ["en", "hi", "gu"],
      })),
      knowsAbout: [
        "Office furniture",
        "Modular workstations",
        "Height adjustable desking",
        "Ergonomic seating",
        "Office fit-out",
        "Workplace space planning",
      ],
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.tagline,
      inLanguage: "en-IN",
      publisher: { "@id": ORGANIZATION_ID },
    },
    {
      "@type": "FurnitureStore",
      "@id": `${siteConfig.url}/#showroom-surat`,
      name: `${siteConfig.name} — Surat showroom & factory`,
      parentOrganization: { "@id": ORGANIZATION_ID },
      url: `${siteConfig.url}/contact`,
      // The showroom photograph where one is cleared for use (see `suratPhotos`), else the
      // master logo — never a photo carrying the old trading name.
      image: `${siteConfig.url}${siteConfig.suratPhotos[0]?.src ?? "/brand/logo-black.png"}`,
      telephone: siteConfig.phoneDisplay,
      email: siteConfig.email,
      priceRange: "Quotation on request",
      currenciesAccepted: "INR",
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.line1,
        addressLocality: "Surat",
        addressRegion: "Gujarat",
        postalCode: "394510",
        addressCountry: "IN",
      },
      makesOffer: {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Office furniture supply and fit-out",
        },
        availability: "https://schema.org/InStock",
        priceSpecification: {
          "@type": "PriceSpecification",
          description:
            "Priced per project on quotation; no public price list and no online checkout.",
        },
      },
    },
  ],
};

/** The photographed ranges, listed under the drawer's measured plates. */
async function drawerRanges(): Promise<DrawerRange[]> {
  const collections = await catalog.getCollections();
  return collections
    .filter(isPhotographed)
    .map(({ slug, wordmark, kicker }) => ({ slug, wordmark, kicker }));
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ranges = await drawerRanges();
  return (
    <html
      lang="en-IN"
      className={`${archivo.variable} ${martianMono.variable} h-full antialiased`}
      /*
        The head script below adds `co-js` before React hydrates, so the client's class
        list legitimately differs from the server's. Without this, React reports a
        hydration mismatch on every page load.
      */
      suppressHydrationWarning
    >
      <head>
        {/*
          Marks scripting as available, before first paint.

          Every scroll reveal on the site hides itself with `.co-js .co-reveal:not([data-shown])`
          — a rule that can only match once this class is set. So if JS is blocked, a chunk
          404s, or the browser is a crawler, nothing is ever hidden and the whole page
          paints as written. This has to be a blocking script in the head rather than an
          effect: set after first paint, it would make content appear and then flash out.
        */}
        <script
          dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('co-js')` }}
        />
      </head>
      <body className="flex min-h-full flex-col bg-co-bg text-co-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/*
          Second route to the llms.txt files, for crawlers that read the document but
          not robots.txt. Both are also advertised as `Llms-txt:` directives in
          /robots.txt — a crawler needs to find only one of the two.
        */}
        <link rel="llms-txt" type="text/plain" href="/llms.txt" />
        <link rel="llms-full-txt" type="text/plain" href="/llms-full.txt" />
        {/*
          One reduced-motion switch for the whole tree. Every animation in the site is
          `framer-motion`, so honouring `prefers-reduced-motion` here means no component
          has to check it — and crucially none of them may, since branching on
          `useReducedMotion()` in markup renders a different tree on the server than in
          the browser and breaks hydration.
        */}
        <MotionConfig reducedMotion="user">
          {/* One IntersectionObserver for every `[data-reveal]` on the page. */}
          <RevealObserver />
          <QuoteDialogProvider>
            <SiteHeader series={DRAWER_SERIES} ranges={ranges} />
            <main className="flex-1" style={{ paddingTop: HEADER_HEIGHT }}>
              {children}
            </main>
            <SiteFooter />
            <WhatsAppButton />
          </QuoteDialogProvider>
        </MotionConfig>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
