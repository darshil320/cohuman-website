/**
 * Official logo files for represented brands, sourced from each brand's own
 * domain (site header / official logo-assets page) — not third-party logo
 * repositories. Update the source if a brand refreshes its mark.
 */
export interface BrandLogo {
  name: string;
  src: string;
  /** Intrinsic file dimensions, so next/image can preserve the real aspect ratio. */
  width: number;
  height: number;
  /** True when the source file is a solid white mark, needing inversion to show on a light card. */
  invert?: boolean;
}

export const brandLogos: BrandLogo[] = [
  { name: "Herman Miller", src: "/brands/herman-miller.svg", width: 199, height: 40 },
  { name: "Steelcase", src: "/brands/steelcase.svg", width: 150, height: 29 },
  { name: "Humanscale", src: "/brands/humanscale.png", width: 1304, height: 192 },
  { name: "Bristol", src: "/brands/bristol.png", width: 183, height: 157 },
  { name: "Hunter Douglas", src: "/brands/hunter-douglas.svg", width: 181, height: 27, invert: true },
];
