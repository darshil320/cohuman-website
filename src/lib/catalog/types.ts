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
