import { siteConfig } from "@/lib/site-config";

/**
 * JSON-LD builders shared by the pages that need them.
 *
 * Each returns a plain object for a page to stringify into a
 * `<script type="application/ld+json">`. They live here rather than inline so that the
 * `@id` values stay consistent with the site-wide `@graph` in `src/app/layout.tsx` —
 * a breadcrumb or list that points at a different Organization node than the layout
 * declares reads as two companies to a crawler.
 */

/** The site-wide Organization node's identity, as declared in the root layout. */
export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;

export interface Crumb {
  name: string;
  /** Site-relative path. Omit on the final crumb — the current page needs no link. */
  path?: string;
}

/**
 * BreadcrumbList for a page that renders a breadcrumb trail.
 *
 * The trail is already on screen on the product and sector pages; this is the machine
 * copy of it, which is what puts the path rather than a bare URL in a search result.
 * "Home" is prepended here so no caller has to remember it.
 */
export function breadcrumbJsonLd(crumbs: Crumb[]) {
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...crumbs];

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      // `item` is omitted on the last crumb: schema.org treats a self-referencing final
      // item as redundant, and Google's breadcrumb guidance asks for it to be left off.
      ...(crumb.path && index < trail.length - 1
        ? { item: `${siteConfig.url}${crumb.path}` }
        : {}),
    })),
  };
}

export interface ListEntry {
  name: string;
  path: string;
  description?: string;
}

/**
 * ItemList for an index page — /catalog, /collections, /sectors, /projects.
 *
 * Without it, an index page is a wall of links a crawler has to guess the structure of.
 * With it, the page states what it lists and in what order, which is what allows a
 * result to carry the whole set rather than one arbitrary child.
 */
export function itemListJsonLd(name: string, path: string, entries: ListEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url: `${siteConfig.url}${path}`,
    numberOfItems: entries.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      url: `${siteConfig.url}${entry.path}`,
      ...(entry.description ? { description: entry.description } : {}),
    })),
  };
}

export interface ServiceEntry {
  name: string;
  blurb: string;
  detail: string;
  deliverables: string[];
}

/**
 * One `Service` node per service offered, wrapped in an ItemList.
 *
 * `provider` points at the layout's Organization node rather than repeating the company
 * details, and every service is explicitly quotation-priced — a `Service` with no offer
 * information invites a model to invent a figure.
 */
export function servicesJsonLd(services: ServiceEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${siteConfig.name} services`,
    url: `${siteConfig.url}/services`,
    numberOfItems: services.length,
    itemListElement: services.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: service.name,
        description: `${service.blurb} ${service.detail}`,
        serviceType: service.name,
        provider: { "@id": ORGANIZATION_ID },
        areaServed: [
          { "@type": "State", name: "Gujarat" },
          { "@type": "State", name: "Maharashtra" },
          { "@type": "Country", name: "India" },
        ],
        ...(service.deliverables.length
          ? {
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: `${service.name} deliverables`,
                itemListElement: service.deliverables.map((deliverable) => ({
                  "@type": "Offer",
                  itemOffered: { "@type": "Service", name: deliverable },
                })),
              },
            }
          : {}),
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${siteConfig.url}/services`,
          description: "Quoted per project; no public price list and no online checkout.",
        },
      },
    })),
  };
}
