import type { MetadataRoute } from "next";
import { catalog, pieceImages } from "@/lib/catalog";
import { CONTENT_REVISED } from "@/lib/seo/content-revised";
import { siteConfig } from "@/lib/site-config";

const STATIC_ROUTES = [
  "",
  "/collections",
  "/finishes",
  "/sectors",
  "/b2b",
  "/solutions",
  "/services",
  "/projects",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [collections, sectors, pieces] = await Promise.all([
    catalog.getCollections(),
    catalog.getSectors(),
    catalog.getPieces(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: CONTENT_REVISED.site,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    lastModified: CONTENT_REVISED.collections,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sectorEntries: MetadataRoute.Sitemap = sectors.map((s) => ({
    url: `${siteConfig.url}/sectors/${s.slug}`,
    lastModified: CONTENT_REVISED.sectors,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // The demo catalog (/catalog, 16 illustrative products) is not real Cohuman product
  // data, so it is left out of the sitemap and marked noindex until real products replace it.
  // PM x Cohuman and seating: each piece has its own page and its own photographs.
  const pieceEntries: MetadataRoute.Sitemap = pieces.map((piece) => ({
    url: `${siteConfig.url}/products/${piece.slug}`,
    lastModified: CONTENT_REVISED.collections,
    changeFrequency: "monthly",
    priority: 0.6,
    images: pieceImages(piece).map((image) => `${siteConfig.url}${image.src}`),
  }));

  return [...staticEntries, ...collectionEntries, ...pieceEntries, ...sectorEntries];
}
