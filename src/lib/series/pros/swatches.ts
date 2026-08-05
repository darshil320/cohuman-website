import type { SeriesFinishFilter, SeriesSwatch } from "../types";

/**
 * Finish board. `fill`/`edge` are CSS colours standing in for real swatch
 * photography — they are close enough to brief a client but must not be used to
 * approve a finish. TODO: swap for photographed swatches.
 */
export const PROS_SWATCHES: SeriesSwatch[] = [
  {
    name: "Nordic Oak",
    spec: "Melamine paper on E1 particle board, 25mm",
    code: "PROS-TOP-NOK",
    fill: "linear-gradient(168deg, #E6DECC 0%, #DBD2BE 46%, #E9E2D2 100%)",
    edge: "#D3C9B3",
  },
  {
    name: "Espresso Walnut",
    spec: "Melamine paper on E1 particle board, 25mm",
    code: "PROS-TOP-EWL",
    fill: "linear-gradient(168deg, #4E4340 0%, #3D3431 48%, #554A46 100%)",
    edge: "#332B29",
  },
  {
    name: "Signal White frame",
    spec: "Powder coating, 80–120μ, on 1.5–2.0mm pipe",
    code: "PROS-FRM-SWH",
    fill: "linear-gradient(168deg, #F6F5F2 0%, #E9E7E1 100%)",
    edge: "#DCD9D1",
  },
  {
    name: "Graphite frame",
    spec: "Powder coating, 80–120μ, on 1.5–2.0mm pipe",
    code: "PROS-FRM-GRA",
    fill: "linear-gradient(168deg, #4A4D50 0%, #33373A 100%)",
    edge: "#2A2D30",
  },
  {
    name: "Light Grey screen",
    spec: "Acoustic felt desk screen, beam-mounted",
    code: "PROS-SCR-LGR",
    fill: "linear-gradient(168deg, #CFCEC9 0%, #BEBDB7 100%)",
    edge: "#B0AFA9",
  },
];

const OAK = "#DED5C1";
const WALNUT = "#453B38";

/** Chips for the viewer's top-finish filter. */
export const PROS_FINISH_FILTERS: SeriesFinishFilter[] = [
  { key: "all", label: "All", swatch: `linear-gradient(135deg, ${OAK} 50%, ${WALNUT} 50%)` },
  { key: "oak", label: "Nordic Oak", swatch: OAK },
  { key: "walnut", label: "Espresso Walnut", swatch: WALNUT },
];
