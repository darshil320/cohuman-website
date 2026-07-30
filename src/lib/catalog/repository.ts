import type {
  Category,
  Collection,
  Product,
  ProductFilters,
  Project,
  Service,
  Space,
} from "./types";

// Swappable seam: today `LocalCatalogRepository` (src/lib/catalog/local-repository.ts)
// reads the JSON files in src/data/*.json. If the client wants self-serve editing later,
// implement this same interface against a headless CMS (e.g. Sanity) and swap the export
// in src/lib/catalog/index.ts — nothing that calls `catalog` needs to change.
export interface CatalogRepository {
  getCategories(): Promise<Category[]>;
  getCollections(): Promise<Collection[]>;
  getCollection(slug: string): Promise<Collection | null>;
  getProducts(filters?: ProductFilters): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  getRelatedProducts(product: Product, limit?: number): Promise<Product[]>;
  getProductsByCollection(collectionSlug: string): Promise<Product[]>;
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  getSpaces(): Promise<Space[]>;
  getServices(): Promise<Service[]>;
}
