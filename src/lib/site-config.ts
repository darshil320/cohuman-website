// PLACEHOLDER — every value below must be confirmed with Tushar/Vaibhav before launch.
// None of these are real; they exist so the layout/forms/structured-data have something
// to render. Swap them for the confirmed values and remove this comment.
export const siteConfig = {
  name: "Cohuman",
  legalName: "Cohuman Modularr LLP",
  tagline: "People-first office furniture, crafted since 1989",
  founder: "Tushar Shah",
  foundedYear: 1989,
  url: "https://cohuman.example.com", // TODO: confirm production domain
  email: "hello@cohuman.example.com", // TODO: confirm current inbox
  phoneDisplay: "+91 00000 00000", // TODO: confirm current showroom number
  phoneE164: "910000000000", // TODO: confirm — digits only, country code first, no leading +
  whatsappE164: "910000000000", // TODO: confirm — usually same as phoneE164
  address: {
    line1: "376-378 RJD Integrated Textile Park, Hazira Rd",
    line2: "Ichchhapor, Surat, Gujarat 394510",
    country: "India",
  },
  hours: "Open · Closes 8 pm",
  mapEmbedUrl: "", // TODO: paste Google Maps embed URL once address is confirmed
  enquiryTurnaround: "two working days",
  brandsRepresented: ["Herman Miller", "Steelcase", "Humanscale", "Bristol", "Hunter Douglas"],
  locations: [
    { city: "Surat", role: "Head office & manufacturing", detail: "Gujarat" },
    { city: "Mumbai", role: "Showroom", detail: "Maharashtra" },
    { city: "Ahmedabad", role: "Representative office", detail: "Gujarat" },
  ],
} as const;

export function whatsappHref(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsappE164}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

export function telHref() {
  return `tel:+${siteConfig.phoneE164}`;
}
