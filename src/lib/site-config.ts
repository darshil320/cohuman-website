// PARTLY CONFIRMED — the two email addresses and the office contacts below are real and
// supplied by the client. Everything still marked `TODO: confirm` is a placeholder that
// must be replaced before launch.

/**
 * Canonical origin, used for `metadataBase`, every `canonical`/`og:url`, the sitemap,
 * robots.txt and llms.txt.
 *
 * `cohuman.in` is the live domain (it matches the confirmed `Jigar@cohuman.in` inbox).
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
  founder: "Tushar Shah",
  url: resolveSiteUrl(),
  /** General inbox. Every website lead lands here — see `emails` for the full set. */
  email: "sales.cohuman@gmail.com",
  emails: [
    {
      address: "sales.cohuman@gmail.com",
      label: "Sales & enquiries",
      note: "Quotes, product questions and showroom bookings.",
    },
    {
      address: "Jigar@cohuman.in",
      label: "Jigar",
      note: "Projects and specification.",
    },
  ],
  phoneDisplay: "+91 98251 43360", // TODO: confirm — assumed to be the Surat line
  phoneE164: "919825143360",
  whatsappE164: "919825143360",
  address: {
    line1: "376-378 RJD Integrated Textile Park, Hazira Rd",
    line2: "Ichchhapor, Surat, Gujarat 394510",
    country: "India",
  },
  hours: "Open · Closes 8 pm",
  mapEmbedUrl: "", // TODO: paste Google Maps embed URL once address is confirmed
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
      contact: { name: "Tushar Shah", title: "Founder" },
      phoneDisplay: "+91 98251 43360", // TODO: confirm this is Tushar's line
      phoneE164: "919825143360",
      address: ["376-378 RJD Integrated Textile Park, Hazira Rd", "Ichchhapor, Surat, Gujarat 394510"],
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
   * Photographs of the Surat showroom. Drop the files into `public/site/` under these
   * names and they appear; anything missing is simply not rendered, so the page never
   * ships a broken image.
   */
  suratPhotos: [
    {
      src: "/site/surat-storefront.jpg",
      alt: "The Cohuman showroom on Hazira Road, Surat, seen from the street",
      caption: "Hazira Road, Surat",
    },
  ],
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
