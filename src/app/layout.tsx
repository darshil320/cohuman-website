import type { Metadata } from "next";
import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { HEADER_HEIGHT } from "@/lib/layout";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { QuoteDialogProvider } from "@/components/providers/quote-dialog-provider";
import { siteConfig } from "@/lib/site-config";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description:
    "Office furniture designed around the people who use it — desking, ergonomic seating, conference tables, storage and reception furniture, manufactured in Surat since 1989.",
  alternates: { canonical: "/" },
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
    // Dimensions are the file's real ones (3168×1344). Declaring the conventional
    // 1200×630 for a 2.36:1 image makes scrapers letterbox or crop to a ratio the file
    // does not have.
    images: [
      {
        url: "/hero-1.png",
        width: 3168,
        height: 1344,
        alt: "A completed Cohuman office fit-out — executive desk, credenza and meeting setting",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Office furniture designed around the people who use it. Request a quote for your space.",
    images: ["/hero-1.png"],
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "FurnitureStore",
  name: siteConfig.name,
  legalName: siteConfig.legalName,
  foundingDate: String(siteConfig.foundedYear),
  founder: { "@type": "Person", name: siteConfig.founder },
  telephone: siteConfig.phoneDisplay,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.address.line1,
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  url: siteConfig.url,
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <QuoteDialogProvider>
          <SiteHeader />
          <main className="flex-1" style={{ paddingTop: HEADER_HEIGHT }}>
            {children}
          </main>
          <SiteFooter />
          <WhatsAppButton />
        </QuoteDialogProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
