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

export interface Project {
  slug: string;
  name: string;
  sector: string;
  city: string;
  meta: string;
  scope: string;
  collections: string;
  quote: string;
  slotHint: string;
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
