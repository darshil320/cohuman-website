"use client";

import { useCallback, useRef, useState } from "react";
import { PENDING_DELAY_MS, PENDING_MIN_MS } from "@/lib/motion";

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Submit timing for a final submit (the Doherty threshold, as the skill's async-button
 * recipe has it):
 *
 * - `busy` turns on the moment the form is sent, so the button disables at once and a
 *   second press or a double Enter cannot send the lead twice.
 * - `pending` (the visible "Sending…") only appears if the request is still out after
 *   300ms, and once shown it is held for at least 500ms — a fast reply never flashes a
 *   spinner, and a slow one never flickers.
 *
 * `run` returns whatever the action returns; a second call while one is in flight is
 * ignored and resolves to `null`.
 */
export function usePendingSubmit() {
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(false);
  const inFlight = useRef(false);

  const run = useCallback(async <T>(action: () => Promise<T>): Promise<T | null> => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setBusy(true);

    let shownAt = 0;
    const timer = window.setTimeout(() => {
      shownAt = performance.now();
      setPending(true);
    }, PENDING_DELAY_MS);

    try {
      return await action();
    } finally {
      window.clearTimeout(timer);
      if (shownAt) await wait(Math.max(0, PENDING_MIN_MS - (performance.now() - shownAt)));
      inFlight.current = false;
      setPending(false);
      setBusy(false);
    }
  }, []);

  return { busy, pending, run };
}
