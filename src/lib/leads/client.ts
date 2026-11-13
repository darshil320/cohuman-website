/**
 * Browser-side lead submission, shared by the three lead forms. Never throws: a network
 * failure or a refused lead comes back as `{ ok: false, error }` with a message fit to
 * show beside the submit button, and the form keeps everything the visitor typed.
 */
export type LeadResult = { ok: true } | { ok: false; error: string };

const GENERIC_ERROR = "Something went wrong. Please try again.";

export async function sendLead(endpoint: string, payload: Record<string, unknown>): Promise<LeadResult> {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result: unknown = await response.json();
    if (result && typeof result === "object" && (result as { success?: unknown }).success === true) {
      return { ok: true };
    }
    const error = (result as { error?: unknown } | null)?.error;
    return { ok: false, error: typeof error === "string" && error ? error : GENERIC_ERROR };
  } catch {
    return { ok: false, error: GENERIC_ERROR };
  }
}
