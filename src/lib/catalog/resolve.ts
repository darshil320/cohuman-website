import type { Category } from "./types";

export function resolveCatLabel(categories: Category[], catId: string): string {
  return categories.find((c) => c.id === catId)?.shortLabel ?? catId;
}

