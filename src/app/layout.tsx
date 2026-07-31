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
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Office furniture designed around the people who use it. Request a quote for your space.",
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
