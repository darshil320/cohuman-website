import type { SeriesElement } from "../types";

/** The seven part numbers every PROS table is assembled from. */
export const PROS_ELEMENTS: SeriesElement[] = [
  {
    ref: "3.1",
    kind: "Beam",
    name: "Short beam",
    code: "PRO-SB110-PC",
    note: "For tops from 800 to 1000mm. Carries single tables and short benches.",
  },
  {
    ref: "3.2",
    kind: "Beam",
    name: "Medium beam",
    code: "PRO-SB160-PC",
    note: "1200 to 1600mm tops. The most specified beam in the range.",
  },
  {
    ref: "3.3",
    kind: "Beam",
    name: "Long beam",
    code: "PRO-SB200-PC",
    note: "1800mm and up, through to the 4000mm boardroom top.",
  },
  {
    ref: "1",
    kind: "Legs",
    name: "Four-leg package",
    code: "PROS-4FLEG072-PC",
    note: "A full A-frame set at 720mm working height. Freestanding tables.",
  },
  {
    ref: "2",
    kind: "Legs",
    name: "Two-leg package",
    code: "PROS-2FLEG072-PC",
    note: "One pair, 720mm. Returns, connectors, small meeting tops.",
  },
  {
    ref: "4",
    kind: "Legs",
    name: "Bench legs, one pair",
    code: "PROS-2BLEG-PC",
    note: "End legs for back-to-back benching. Takes the beam load.",
  },
  {
    ref: "5",
    kind: "Legs",
    name: "Bench mid leg",
    code: "PROS-BMLEG-PC",
    note: "Intermediate support between bench positions. Two to four per run.",
  },
];

export const PROS_SUPPORT_BEAM_NOTE =
  "Where a top exceeds 1200mm across, a supportive beam is added to the chassis. It is not an option — it ships with the configuration.";
