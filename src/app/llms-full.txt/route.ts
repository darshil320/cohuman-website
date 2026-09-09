import { buildLlmsFullTxt } from "@/lib/llms/build";

/*
  llms-full.txt — the conventional companion to llms.txt: the same site with its content
  inlined rather than linked, so a model answering "what depths does STRETCH come in" or
  "what is the lead time on a task chair" has the answer without fetching a page per
  question. Both files come out of one builder module, so the index and the full text
  always describe the same catalog.
*/
export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  return new Response(await buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
