import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { siteConfig } from "@/lib/site-config";

const STATIC_ROUTES = [
  "",
  "/collections",
  "/catalog",
  "/b2b",
  "/solutions",
  "/services",
  "/projects",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    catalog.getProducts(),
    catalog.getCollections(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const collectionEntries: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${siteConfig.url}/collections/${c.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/catalog/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...collectionEntries, ...productEntries];
}
