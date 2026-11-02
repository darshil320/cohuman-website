import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Joins names as prose: "A", "A and B", "A, B and C". */
export function listLabel(names: readonly string[]): string {
  if (names.length < 2) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/** A count as a word for headlines ("Five"), falling back to digits past ten. */
export function numberWord(n: number): string {
  return NUMBER_WORDS[n] ?? String(n);
}
