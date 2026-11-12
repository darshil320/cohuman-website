import categoriesData from "@/data/categories.json";
import collectionsData from "@/data/collections.json";
import foundersData from "@/data/founders.json";
import piecesData from "@/data/pieces.json";
import productsData from "@/data/products.json";
import projectsData from "@/data/projects.json";
import sectorsData from "@/data/sectors.json";
import servicesData from "@/data/services.json";
import spacesData from "@/data/spaces.json";
import { collectionsSchema } from "./collection-schema";
import { foundersSchema } from "./founder-schema";
import { piecesSchema, type Piece } from "./piece-schema";
import type { CatalogRepository } from "./repository";
import type {
  Category,
  Collection,
  Founder,
  PriceBand,
  Product,
  ProductFilters,
  Project,
  Sector,
  Service,
  Space,
} from "./types";

const categories = categoriesData as Category[];
// Parsed, not cast, for the same reason as founders: a photographed collection names
// files and must not ship a missing caption or a hero that is not a scene.
const collections: Collection[] = collectionsSchema.parse(collectionsData);
const products = productsData as Product[];
/** Published projects only; an entry flagged `hidden` stays in the JSON for later. */
const projects = (projectsData as Project[]).filter((p) => !p.hidden);
const sectors = sectorsData as Sector[];
const services = servicesData as Service[];
const spaces = spacesData as Space[];
// Parsed, not cast: founders.json is hand-edited, and a bad entry should fail the build
// with a readable message rather than render a broken card.
const founders: Founder[] = foundersSchema.parse(foundersData);
// Parsed, not cast: pieces name image files and catalogue sizes quoted to customers.
const pieces: Piece[] = piecesSchema.parse(piecesData);

export class LocalCatalogRepository implements CatalogRepository {
  async getCategories(): Promise<Category[]> {
    return categories;
  }

  async getCollections(): Promise<Collection[]> {
    return collections;
  }

  async getCollection(slug: string): Promise<Collection | null> {
    return collections.find((c) => c.slug === slug) ?? null;
  }

  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    return products.filter((p) => {
      if (filters?.cat && p.cat !== filters.cat) return false;
      if (filters?.band && p.band !== (filters.band as PriceBand)) return false;
      return true;
    });
  }

  async getProduct(slug: string): Promise<Product | null> {
    return products.find((p) => p.slug === slug) ?? null;
  }

  async getRelatedProducts(product: Product, limit = 3): Promise<Product[]> {
    return products
      .filter((p) => p.slug !== product.slug && p.cat === product.cat)
      .slice(0, limit);
  }

  async getProjects(): Promise<Project[]> {
    return projects;
  }

  async getProject(slug: string): Promise<Project | null> {
    return projects.find((p) => p.slug === slug) ?? null;
  }

  async getSectors(): Promise<Sector[]> {
    return sectors;
  }

  async getSector(slug: string): Promise<Sector | null> {
    return sectors.find((s) => s.slug === slug) ?? null;
  }

  async getSpaces(): Promise<Space[]> {
    return spaces;
  }

  async getServices(): Promise<Service[]> {
    return services;
  }

  async getFounders(): Promise<Founder[]> {
    return founders;
  }

  async getPieces(): Promise<Piece[]> {
    return pieces;
  }

  async getPiece(slug: string): Promise<Piece | null> {
    return pieces.find((p) => p.slug === slug) ?? null;
  }
}
