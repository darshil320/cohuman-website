import type { Metadata } from "next";
import localFont from "next/font/local";
import { RevealObserver } from "@/components/ui/reveal-observer";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { PageTransition } from "@/components/layout/page-transition";
import { PrintMasthead } from "@/components/layout/print-masthead";
import { SiteHeader } from "@/components/layout/site-header";
import { HEADER_HEIGHT } from "@/lib/layout";
import { SiteFooter } from "@/components/layout/site-footer";
import { OrgatecPopup } from "@/components/common/orgatec-popup";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { QuoteDialogProvider } from "@/components/providers/quote-dialog-provider";
import { ORGANIZATION_ID } from "@/lib/seo/structured-data";
import { siteConfig } from "@/lib/site-config";
import { ALL_SERIES } from "@/lib/series";
import { catalog } from "@/lib/catalog";
import { buildCollectionMenu } from "@/lib/catalog/collection-menu";

/*
  Sequel Sans, in the three optical cuts the family ships — each drawn for a size range,
  so each role gets the cut made for it rather than one file scaled across all of them:

  - Disp — display and h1 claims (Semi Bold).
  - Head — h2, h3 and index-row names (Semi Bold).
  - Body — reading text, buttons, labels and every measured value (Roman, Medium,
    Semi Bold). Measured values switch on its tabular figures (`tnum`) instead of a
    separate monospace family.

  The family is static, not variable, so each weight the site sets is its own file;
  weights the site never sets are not shipped. Sequel Sans has no arrows (→ ← ↑ ↓), so
  those fall through to the system stack in `--font-*`.
*/
const sequelBody = localFont({
  variable: "--font-sequel-body",
  src: [
    { path: "./fonts/sequel-sans/sequel-sans-body-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/sequel-sans/sequel-sans-body-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/sequel-sans/sequel-sans-body-600.woff2", weight: "600", style: "normal" },
  ],
});

const sequelHead = localFont({
  variable: "--font-sequel-head",
  src: [{ path: "./fonts/sequel-sans/sequel-sans-head-600.woff2", weight: "600", style: "normal" }],
});

const sequelDisp = localFont({
  variable: "--font-sequel-disp",
  src: [{ path: "./fonts/sequel-sans/sequel-sans-disp-600.woff2", weight: "600", style: "normal" }],
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
                    identity every other node points at. `sameAs` carries only the
                    profiles printed in the client's catalogue (Instagram today) — never
                    a guessed handle, which would attach someone else's account here.
  - WebSite       — the site itself, with `publisher` pointing back at the Organization.
                    No `SearchAction`: the site has no /search route, and declaring a
                    search endpoint that 404s is worse than declaring none.
  - FurnitureStore — the physical Surat showroom and factory, which is the node that can
                    win a local pack. Kept distinct from Organization because the company
                    also sells through Mumbai and Ahmedabad, which are not this address.

  Everything derives from `siteConfig`, so a corrected phone number or a new office
  updates the markup without a second edit here.
*/
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
      sameAs: [siteConfig.social.instagram.href],
      email: siteConfig.email,
      telephone: siteConfig.phoneDisplay,
      address: {
        "@type": "PostalAddress",
        streetAddress: siteConfig.address.line1,
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        postalCode: siteConfig.address.postalCode,
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
        addressLocality: siteConfig.address.locality,
        addressRegion: siteConfig.address.region,
        postalCode: siteConfig.address.postalCode,
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

/** The header's Collections panel: every group and product, in the catalogue's order. */
async function collectionGroups() {
  const [collections, pieces] = await Promise.all([catalog.getCollections(), catalog.getPieces()]);
  return buildCollectionMenu({ collections, pieces, series: ALL_SERIES });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const groups = await collectionGroups();
  return (
    <html
      lang="en-IN"
      className={`${sequelBody.variable} ${sequelHead.variable} ${sequelDisp.variable} h-full antialiased`}
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
          No framer at the root: the header's overlays and the site-wide chrome are CSS, so
          the animation library only loads on the routes that use it (the series pages and
          the lightbox), each under its own `MotionConfig reducedMotion="user"`. Reduced
          motion for everything else is the global layer in globals.css.
        */}
        {/* One IntersectionObserver for every `[data-reveal]` on the page. */}
        <RevealObserver />
        <QuoteDialogProvider>
          <SiteHeader groups={groups} />
          <main className="flex-1" style={{ paddingTop: HEADER_HEIGHT }}>
            <PrintMasthead />
            <PageTransition>{children}</PageTransition>
          </main>
          <SiteFooter />
          <WhatsAppButton />
          <OrgatecPopup />
        </QuoteDialogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
