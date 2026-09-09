import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { MotionConfig } from "framer-motion";
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

/*
  Both families are variable fonts, so `weight` is deliberately absent: it applies only
  to a font that is *not* variable, and enumerating weights made Next fetch one static
  instance per value — eight font files where two variable ones cover every weight the
  site uses (300/400/500/600/700). Omitted, each resolves to `'variable'`, the default.

  `display` ('swap'), `preload` (true) and `adjustFontFallback` (true) are all left at
  their defaults, which are already what we want; `subsets: ["latin"]` is what makes
  Next inject the `<link rel="preload">` for the font file into the head.
*/
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Office furniture designed around the people who use it — desking, ergonomic seating, conference tables, storage and reception furniture, manufactured in Surat since 1989.",
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
    // Site-wide share card. Every page that does not set its own image inherits this one;
    // without a default, a shared link from /about, /contact or a sector page renders as
    // a bare text row in WhatsApp, Slack and LinkedIn. `metadataBase` above makes it
    // absolute, which is why that value must be the real production origin.
    //
    // `og.jpg` is a purpose-built 1200×630 crop of the hero, ~80 KB. It is not the hero
    // file itself: WhatsApp silently drops preview images past a few hundred kilobytes,
    // and the hero source is 2.36:1, so declaring the conventional 1.91:1 for it made
    // scrapers letterbox or crop to a ratio the file did not have.
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "A completed Cohuman office fit-out — executive desk, credenza and meeting setting",
      },
    ],
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Office furniture designed around the people who use it. Request a quote for your space.",
    images: ["/og.jpg"],
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
      logo: `${siteConfig.url}/logo.png`,
      image: `${siteConfig.url}/og.jpg`,
      description:
        "Office furniture manufacturer and fit-out contractor in Surat, Gujarat. Desking systems, ergonomic seating, conference tables, storage and reception furniture, supplied on quotation.",
      foundingDate: String(siteConfig.foundedYear),
      founder: { "@type": "Person", name: siteConfig.founder },
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
      brand: siteConfig.brandsRepresented.map((brand) => ({
        "@type": "Brand",
        name: brand,
      })),
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
      image: `${siteConfig.url}${siteConfig.suratPhotos[0].src}`,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bricolage.variable} ${figtree.variable} h-full antialiased`}>
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
          <QuoteDialogProvider>
            <SiteHeader />
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
