import type { MetadataRoute } from "next";
import { catalog } from "@/lib/catalog";
import { CONTENT_REVISED } from "@/lib/seo/content-revised";
import { siteConfig } from "@/lib/site-config";

const STATIC_ROUTES = [
  "",
  "/collections",
  "/sectors",
  "/catalog",
  "/b2b",
  "/solutions",
  "/services",
  "/projects",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, sectors] = await Promise.all([
    catalog.getProducts(),
    catalog.getCollections(),
    catalog.getSectors(),
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

  /*
    Product pages carry their own photography, so an entry advertises it: `images` is
    what puts a URL into Google Images and image-rich Discover cards. Products without
    shots — which is all sixteen demo records today — simply omit the field.
  */
  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/catalog/${p.slug}`,
    lastModified: CONTENT_REVISED.products,
    changeFrequency: "monthly",
    priority: 0.5,
    ...(p.images?.length
      ? { images: p.images.map((image) => `${siteConfig.url}${image.src}`) }
      : {}),
  }));

  return [...staticEntries, ...collectionEntries, ...sectorEntries, ...productEntries];
}
