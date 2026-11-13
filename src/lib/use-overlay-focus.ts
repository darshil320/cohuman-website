"use client";

import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function focusables(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => !el.closest("[inert]") && el.getClientRects().length > 0,
  );
}

/**
 * Keyboard and focus for a non-Radix overlay (the header's mobile menu and Collections
 * panel), so they behave like every other top layer:
 *
 * - on open, focus moves to the first control in the panel;
 * - Tab and Shift+Tab cycle through the trigger and the panel only;
 * - Escape closes it;
 * - on close, focus goes back to the trigger — unless the visitor has already put it
 *   somewhere else (a link that navigated, a click outside).
 *
 * The trigger stays in the cycle on purpose: it is the visible close control.
 */
export function useOverlayFocus(
  open: boolean,
  panelRef: RefObject<HTMLElement | null>,
  triggerRef: RefObject<HTMLElement | null>,
  onClose: () => void,
): void {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const panel = panelRef.current;
    if (!open || !panel) return;
    const trigger = triggerRef.current;

    focusables(panel)[0]?.focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const cycle = [...(trigger ? [trigger] : []), ...focusables(panel)];
      if (cycle.length === 0) return;
      const index = cycle.indexOf(document.activeElement as HTMLElement);
      const nextIndex = event.shiftKey
        ? index <= 0
          ? cycle.length - 1
          : index - 1
        : index === -1 || index === cycle.length - 1
          ? 0
          : index + 1;
      event.preventDefault();
      cycle[nextIndex].focus();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      const active = document.activeElement;
      if (trigger && (active === document.body || panel.contains(active))) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, [open, panelRef, triggerRef]);
}
