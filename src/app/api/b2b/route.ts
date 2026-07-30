import { NextResponse } from "next/server";
import { b2bSchema } from "@/lib/leads/schema";
import { recordLead } from "@/lib/leads/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = b2bSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  try {
    await recordLead("b2b_bulk_order", parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not send your enquiry right now. Please try again." },
      { status: 500 },
    );
  }
}
