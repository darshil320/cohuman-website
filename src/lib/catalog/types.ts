export type PriceBand = "budget" | "value" | "premium";

export const PRICE_BAND_LABEL: Record<PriceBand, string> = {
  budget: "Value",
  value: "Mid",
  premium: "Premium",
};

export interface Category {
  id: string;
  label: string;
  shortLabel: string;
}

export interface Collection {
  slug: string;
  name: string;
  kicker: string;
  blurb: string;
  slotHint: string;
}

export interface Product {
  slug: string;
  name: string;
  cat: string;
  band: PriceBand;
  tagline: string;
  materials: string;
  sizes: string;
  features: string[];
  lead: string;
  warranty: string;
}

/**
 * A completed fit-out. Only fields the client has actually confirmed are present —
 * seat counts, sectors and testimonial quotes are deliberately absent rather than
 * estimated, and `city`/`name` carry a real client name only where one was shared.
 */
export interface Project {
  slug: string;
  /** Client name where shared, otherwise the unit the job is known by. */
  name: string;
  city?: string;
  /** What was supplied and installed, described from the photography. */
  delivered: string;
  /** Photographs of the finished install; the first is the lead image. */
  images: string[];
}

/**
 * A market Cohuman sells into — healthcare, private residence, executive.
 *
 * Everything the client has not supplied yet is an empty array rather than invented
 * content: `ranges` waits on real product names and specs, `photos` on real photography,
 * `projectSlugs` on installs cleared for publication. Each section renders only when its
 * array has entries, so the page is honest at every stage of being filled in.
 */
export interface Sector {
  slug: string;
  /** Nav/card name, e.g. "Healthcare". */
  name: string;
  /** One line under the name, e.g. "Hospitals, clinics and diagnostic centres". */
  kicker: string;
  /** Hero paragraph — what Cohuman does for this market. */
  blurb: string;
  /** What makes specifying for this sector different. Structural, not promotional. */
  considerations: { title: string; detail: string }[];
  /** Named ranges with their specs. Empty until the client supplies real ones. */
  ranges: { name: string; note: string; spec?: string }[];
  /** Photographs; each renders only once the file is in `public/`. */
  photos: { src: string; alt: string; caption?: string }[];
  /** Slugs from projects.json to show as proof. */
  projectSlugs: string[];
  /** Subject line the enquiry dialog opens with. */
  enquirySubject: string;
}

export interface Space {
  slug: string;
  num: string;
  name: string;
  blurb: string;
  includes: string;
  slotHint: string;
}

export interface Service {
  num: string;
  name: string;
  blurb: string;
  detail: string;
  deliverables: string[];
}

export interface ProductFilters {
  cat?: string;
  band?: PriceBand;
}
