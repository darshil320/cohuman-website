// PARTLY CONFIRMED — the cohuman.in email addresses, the founders and the office contacts
// below are real and supplied by the client. Everything still marked `TODO: confirm` is a placeholder that
// must be replaced before launch.

/**
 * Canonical origin, used for `metadataBase`, every `canonical`/`og:url`, the sitemap,
 * robots.txt and llms.txt.
 *
 * `cohuman.in` is the live domain (it matches the confirmed `@cohuman.in` inboxes).
 * `NEXT_PUBLIC_SITE_URL` overrides it so preview deployments advertise their own origin
 * instead of pointing every crawler and social scraper at production — set it to
 * `https://$VERCEL_URL` on preview environments. Trailing slashes are stripped because
 * every consumer concatenates a path onto this value.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return "https://cohuman.in";

  const withScheme = /^https?:\/\//.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL is not a valid URL: ${raw}. Use an origin like https://cohuman.in.`,
    );
  }
}

export const siteConfig = {
  name: "Cohuman",
  legalName: "Cohuman Modularr LLP",
  tagline: "Precision-made modular office furniture",
  /** Co-founders, in the order the client gave them. Also on /about from founders.json. */
  founders: ["Tushar Shah", "Jigar Rathod"],
  /** The founders as prose — "Tushar Shah and Jigar Rathod". */
  founder: "Tushar Shah and Jigar Rathod",
  url: resolveSiteUrl(),
  /**
   * Lead inbox. Every website lead (quote, B2B, showroom visit) is emailed here — see
   * `recordLead` in src/lib/leads/store.ts — and it is the first address shown publicly.
   */
  email: "tushar@cohuman.in",
  emails: [
    {
      address: "tushar@cohuman.in",
      label: "Sales & enquiries",
      note: "Quotes, product questions and showroom bookings.",
    },
    {
      address: "jigar@cohuman.in",
      label: "Jigar",
      note: "Projects, production and installation.",
    },
    {
      // Forwards to devan@officeideas.in at the mail server; nothing to do here.
      address: "devan@cohuman.in",
      label: "Devan",
      note: "Projects and specification.",
    },
    {
      address: "accounts@cohuman.in",
      label: "Accounts",
      note: "Invoices and payments.",
    },
  ],
  // From the back page of the 2026 catalogue (v18), which the client confirmed replaces
  // the earlier Hazira Road address and number. WhatsApp assumed to be the same line.
  phoneDisplay: "+91 90811 29000",
  phoneE164: "919081129000",
  whatsappE164: "919081129000", // TODO: confirm the WhatsApp line is the catalogue number
  address: {
    line1: "G, Shree Arc 2, Udhana–Magdalla Road",
    line2: "Opp. Shanidev Temple, near Sosyo Circle, Udhana, Surat, Gujarat 395002",
    locality: "Surat",
    region: "Gujarat",
    postalCode: "395002",
    country: "India",
  },
  /** Social profiles, as printed in the catalogue. Also the Organization's `sameAs`. */
  social: {
    instagram: { handle: "@cohuman.india", href: "https://www.instagram.com/cohuman.india/" },
  },
  /** Cities the catalogue lists the company in, in its order. */
  cities: ["Surat", "Mumbai", "Ahmedabad"],
  hours: "Open · Closes 8 pm",
  /**
   * Printed beside the hero render and in the footer, the way a drawing set carries a
   * site datum. TODO: confirm — these are Surat's city-centre coordinates, not the
   * Udhana showroom's; replace them with the showroom's own once surveyed.
   *
   * The label's spaces are no-break (U+00A0): HTML collapses an ordinary double space to
   * one, so the gap between the two coordinates never rendered, and a plain space let
   * "N" or "E" wrap away from its figure.
   */
  coordinates: {
    lat: 21.1702,
    lng: 72.8311,
    label: "21.1702° N  72.8311° E",
  },
  /**
   * OFF ON PURPOSE. Google's listing at the catalogue address is still named "FURNITURE
   * CONCEPTS 2.0" — the previous trading name, which the site must never show (CLAUDE.md,
   * "No heritage claims"), and a keyless embed cannot hide it. Once the Google Business
   * Profile is renamed to Cohuman, set this to:
   *   "https://www.google.com/maps?q=Shree+Arc+2,+Udhana-Magdalla+Road,+near+Sosyo+Circle,+Udhana,+Surat,+Gujarat+395002&output=embed"
   * and the map appears on the homepage's visit section and on /contact.
   */
  mapEmbedUrl: "",
  enquiryTurnaround: "two working days",
  /**
   * Offices, each with the person who actually answers for it. `phoneDisplay`/`phoneE164`
   * are omitted where the number has not been supplied yet — the UI drops the call link
   * rather than showing a number nobody answers.
   */
  offices: [
    {
      city: "Surat",
      state: "Gujarat",
      role: "Showroom & factory",
      contact: { name: "Tushar Shah", title: "Co-founder & CEO" },
      phoneDisplay: "+91 90811 29000",
      phoneE164: "919081129000",
      address: [
        "G, Shree Arc 2, Udhana–Magdalla Road",
        "Opp. Shanidev Temple, near Sosyo Circle, Udhana, Surat, Gujarat 395002",
      ],
      hours: "Open · Closes 8 pm",
    },
    {
      city: "Mumbai",
      state: "Maharashtra",
      role: "Showroom & project office",
      contact: { name: "Kirti Desai", title: "Mumbai lead" },
      phoneDisplay: null, // TODO: Kirti Desai's number — not supplied yet
      phoneE164: null,
      address: [],
      hours: null,
    },
    {
      city: "Ahmedabad",
      state: "Gujarat",
      role: "Representative engineer",
      contact: null,
      phoneDisplay: null,
      phoneE164: null,
      address: [],
      hours: null,
    },
  ],
  /**
   * Photographs of the Surat showroom. Drop the files into `public/site/` and list them
   * here; anything missing is simply not rendered, so the page never ships a broken image.
   *
   * EMPTY ON PURPOSE. The only photo on file, `public/site/surat-storefront.jpg`, shows the
   * shop sign "FURNITURE CONCEPTS-2.0" — the previous trading name, which the site must
   * never show (CLAUDE.md, "No heritage claims"). It stays on disk but is not listed. Add
   * a showroom photo without the old signage — interior, or the façade once re-signed:
   *
   *   { src: "/site/<file>.jpg", alt: "…", caption: "Udhana, Surat" },
   */
  suratPhotos: [] as readonly { src: string; alt: string; caption: string }[],
} as const;

export function whatsappHref(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsappE164}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

export function telHref(e164: string = siteConfig.phoneE164) {
  return `tel:+${e164}`;
}

export function mailtoHref(address: string, subject?: string) {
  return subject ? `mailto:${address}?subject=${encodeURIComponent(subject)}` : `mailto:${address}`;
}
