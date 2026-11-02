/*
  The assembly animation's build order, kept apart from the scene.

  The section chrome lists these parts alongside the 3D stage. When they lived in
  assembly-scene.tsx, that static import pulled the whole scene — and with it `three` —
  into the page's main chunk, defeating the lazy `dynamic()` import of the scene. This
  module has no dependencies, so the list costs nothing to import.
*/

export interface AssemblyPart {
  key: string;
  label: string;
  /** Part number as printed on the specification's anatomy page. */
  ref: string;
  from: number;
  to: number;
}

/** Build order — the frame goes together from the floor up. */
export const ASSEMBLY_PARTS: AssemblyPart[] = [
  { key: "legs", label: "Side legs", ref: "2", from: 0.03, to: 0.30 },
  { key: "mid", label: "Bench mid leg", ref: "1", from: 0.26, to: 0.44 },
  { key: "beam", label: "Horizontal bar", ref: "4", from: 0.40, to: 0.56 },
  { key: "top", label: "Table tops", ref: "7", from: 0.52, to: 0.74 },
  { key: "modesty", label: "Modesty panel", ref: "8", from: 0.70, to: 0.84 },
  { key: "screen", label: "Desk screens", ref: "—", from: 0.80, to: 0.96 },
];
