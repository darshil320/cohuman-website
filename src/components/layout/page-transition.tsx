"use client";

import { usePathname } from "next/navigation";
import { ViewTransition, type ReactNode } from "react";

/**
 * Route change as a drawn sheet (see "Route change" in globals.css).
 *
 * Keyed by pathname, so the boundary only enters and exits when the route itself changes:
 * a hash jump, a configurator pick or a lazy chunk resolving inside the page is an update
 * of the same boundary, and `default="none"` keeps those still. React names the element
 * only for the length of the transition, so nothing here changes how the page lays out.
 * Browsers without the View Transitions API, and reduced motion, just swap pages.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <ViewTransition
      key={pathname}
      enter="co-page-in"
      exit="co-page-out"
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
