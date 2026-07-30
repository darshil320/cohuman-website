import { LocalCatalogRepository } from "./local-repository";

// Single call site for the active repository implementation. Swap this line
// (and only this line) when moving to a headless CMS.
export const catalog = new LocalCatalogRepository();

export * from "./types";
export type { CatalogRepository } from "./repository";
