import type { PictureOption } from "@/lib/finishes";

/**
 * Step 4 — the VOLT & BOLT system (catalogue v31, p. 15: "Add power and data units at
 * the desk"). The units are the supplier's range, named by type only: no supplier name,
 * no part codes and no prices — the site quotes, it does not list. Each links to its
 * product page in the Accessories group.
 */
export const POWER_OPTIONS: readonly (PictureOption & { href: string })[] = [
  {
    slug: "pop-up-box",
    name: "Pop-up box",
    note: "Sockets, USB, data and HDMI that rise out of the top",
    src: "/pieces/pop-up-box/desk.jpg",
    href: "/products/pop-up-box",
  },
  {
    slug: "cable-cubby",
    name: "Cable cubby",
    note: "A flush box under a soft-close flap",
    src: "/pieces/cable-cubby/desk.jpg",
    href: "/products/cable-cubby",
  },
  {
    slug: "power-dock",
    name: "Power dock",
    note: "A round dock that lifts out at a push",
    src: "/pieces/power-dock/wireless.jpg",
    href: "/products/power-dock",
  },
  {
    slug: "power-track",
    name: "Power track",
    note: "A rail that takes sockets anywhere along it",
    src: "/pieces/power-track/desk.jpg",
    href: "/products/power-track",
  },
];
