import type { Category, Collection } from "./types";

export function resolveCatLabel(categories: Category[], catId: string): string {
  return categories.find((c) => c.id === catId)?.shortLabel ?? catId;
}

export function resolveColName(collections: Collection[], colSlug: string): string {
  return collections.find((c) => c.slug === colSlug)?.name ?? colSlug;
}
