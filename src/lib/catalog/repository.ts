import type {
  Category,
  Collection,
  Founder,
  Product,
  ProductFilters,
  Project,
  Sector,
  Service,
  Space,
} from "./types";
import type { Piece } from "./piece-schema";

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
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | null>;
  getSectors(): Promise<Sector[]>;
  getSector(slug: string): Promise<Sector | null>;
  getSpaces(): Promise<Space[]>;
  getServices(): Promise<Service[]>;
  getFounders(): Promise<Founder[]>;
  /** Single products with their own page: PM x Cohuman and seating. */
  getPieces(): Promise<Piece[]>;
  getPiece(slug: string): Promise<Piece | null>;
}
