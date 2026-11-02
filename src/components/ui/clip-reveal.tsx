import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * An image wipe: the frame opens left to right behind a moving ink hairline — Signal's
 * "images wipe, never fade". Pure CSS (`co-clip` in globals.css) gated on `data-shown`, so
 * this stays a server component and the resting state is fully revealed: nothing is
 * hidden when scripting is off.
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
