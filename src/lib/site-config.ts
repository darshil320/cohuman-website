// PLACEHOLDER — every value below must be confirmed with Tushar/Vaibhav before launch.
// None of these are real; they exist so the layout/forms/structured-data have something
// to render. Swap them for the confirmed values and remove this comment.
export const siteConfig = {
  name: "Cohuman",
  legalName: "Furniture Concepts 2.0",
  tagline: "People-first office furniture, crafted since 1989",
  founder: "Tushar Shah",
  foundedYear: 1989,
  url: "https://cohuman.example.com", // TODO: confirm production domain
  email: "hello@cohuman.example.com", // TODO: confirm current inbox
  phoneDisplay: "+91 00000 00000", // TODO: confirm current showroom number
  phoneE164: "910000000000", // TODO: confirm — digits only, country code first, no leading +
  whatsappE164: "910000000000", // TODO: confirm — usually same as phoneE164
  address: {
    line1: "Showroom address line 1 — TODO: confirm", // TODO: confirm
    line2: "Surat, Gujarat",
    country: "India",
  },
  hours: "Monday – Saturday, hours to be confirmed. Site visits by appointment.", // TODO: confirm
  mapEmbedUrl: "", // TODO: paste Google Maps embed URL once address is confirmed
  enquiryTurnaround: "two working days",
} as const;

export function whatsappHref(prefilledMessage?: string) {
  const base = `https://wa.me/${siteConfig.whatsappE164}`;
  if (!prefilledMessage) return base;
  return `${base}?text=${encodeURIComponent(prefilledMessage)}`;
}

export function telHref() {
  return `tel:+${siteConfig.phoneE164}`;
}
