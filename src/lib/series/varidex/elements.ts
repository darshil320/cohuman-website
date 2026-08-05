import type { SeriesElement } from "../types";

/**
 * The eight part numbers on the VARIDEX element page, reference numbers and codes
 * exactly as printed in `VARIDEX.pdf`.
 */
export const VARIDEX_ELEMENTS: SeriesElement[] = [
  {
    ref: "1",
    kind: "Legs",
    name: "4 legs package",
    code: "VARI-4FLEG072-PC",
    note: "A full leg set at 720mm working height. Every freestanding table starts here.",
  },
  {
    ref: "2",
    kind: "Legs",
    name: "Single in line mid leg",
    code: "VARI-SLMLEG-PC",
    note: "Intermediate leg for desks run in line, so two tops share one support.",
  },
  {
    ref: "3.1",
    kind: "Beam",
    name: "Horizontal beam · short",
    code: "VARI-2B120140-PC",
    note: "Spans 1200 to 1400mm tops — single desks, returns, short benches.",
  },
  {
    ref: "3.2",
    kind: "Beam",
    name: "Horizontal beam · medium",
    code: "VARI-2B150180-PC",
    note: "1500 to 1800mm tops. The beam most face-to-face benches are built on.",
  },
  {
    ref: "3.3",
    kind: "Beam",
    name: "Horizontal beam · long",
    code: "VARI-2B190240-PC",
    note: "1900 to 2400mm, through to the meeting tables.",
  },
  {
    ref: "4",
    kind: "Legs",
    name: "2 legs package",
    code: "VARI-2FLEG072-PC",
    note: "One pair at 720mm. Returns and the small square meeting tops.",
  },
  {
    ref: "5",
    kind: "Legs",
    name: "Bench legs, one pair",
    code: "VARI-2BLEG-PC",
    note: "End legs for back-to-back benching. Takes the beam load across the run.",
  },
  {
    ref: "6",
    kind: "Legs",
    name: "Bench mid leg",
    code: "VARI-BMLEG-PC",
    note: "Mid support between bench positions, added once a run passes two seats.",
  },
];

export const VARIDEX_BEAM_NOTE =
  "Beams are specified by the top they carry, not by the table: the same short beam sits under a 1200mm desk, a return and a face-to-face bench. Pick the top, and the beam follows.";
