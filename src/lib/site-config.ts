// PARTLY CONFIRMED — the two email addresses and the office contacts below are real and
// supplied by the client. Everything still marked `TODO: confirm` is a placeholder that
// must be replaced before launch.
export const siteConfig = {
  name: "Cohuman",
  legalName: "Cohuman Modularr LLP",
  tagline: "People-first office furniture, crafted since 1989",
  founder: "Tushar Shah",
  foundedYear: 1989,
  url: "https://cohuman.example.com", // TODO: confirm production domain
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
  brandsRepresented: ["Herman Miller", "Steelcase", "Humanscale", "Bristol", "Hunter Douglas"],
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
