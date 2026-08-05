import type { Category, Collection } from "./types";

export function resolveCatLabel(categories: Category[], catId: string): string {
  return categories.find((c) => c.id === catId)?.shortLabel ?? catId;
}

/**
 * `null` when the slug matches no collection. Products carried over from the original
 * demo reference collections that no longer exist, and showing a raw slug to a customer
 * is worse than showing nothing — callers omit the line instead.
 */
export function resolveColName(collections: Collection[], colSlug: string): string | null {
  return collections.find((c) => c.slug === colSlug)?.name ?? null;
}
