import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A clip-path wipe for a photograph.
 *
 * The frame's `clip-path` opens upward while the image inside counter-scales down, so the
 * picture settles rather than simply appearing, and the crop never exposes an edge. Both
 * halves are CSS keyframes gated on `data-shown` — a server component, no framer, and the
 * resting state is fully revealed, so nothing is hidden when scripting is off.
 *
 * Expects a single child that fills the frame (a `next/image` with `fill`).
 */
export function ClipReveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal className={cn("co-clip relative overflow-hidden", className)}>
      {children}
    </div>
  );
}
