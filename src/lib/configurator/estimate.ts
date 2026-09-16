import type { ResolvedSpecification } from "./options";

/**
 * Pricing seam.
 *
 * The client has not supplied rates yet, and the rest of the site deliberately says
 * "Price on request" rather than publishing a number nobody has approved — so this
 * returns an unpriced result and the configurator shows the specification instead of a
 * total.
 *
 * WHEN THE RATE CARD ARRIVES this is the only file that changes: fill in `estimate()`
 * to return `{ priced: true, … }` and the summary step renders the figures with no
 * further edits. Nothing else in the app computes money.
 */

export interface UnpricedEstimate {
  priced: false;
  /** Why no figure is shown, quoted to the customer. */
  reason: string;
}

export interface EstimateLine {
  label: string;
  code?: string;
  qty: number;
  /** Minor units (paise), to keep arithmetic off floating point. */
  amount: number;
}

export interface PricedEstimate {
  priced: true;
  currency: "INR";
  lines: EstimateLine[];
  /** Minor units (paise). */
  subtotal: number;
  total: number;
}

export type Estimate = UnpricedEstimate | PricedEstimate;

const PRICE_ON_REQUEST =
  "Quantity, finish and installation move the number, so we quote rather than list.";

/**
 * Returns the estimate for a resolved specification.
 *
 * `spec` is unused while pricing is unpriced — it is in the signature so the call sites
 * already pass everything a rate card needs, and dropping in real pricing does not have
 * to touch any component.
 */
export function estimate(spec: ResolvedSpecification): Estimate {
  void spec;
  return { priced: false, reason: PRICE_ON_REQUEST };
}
