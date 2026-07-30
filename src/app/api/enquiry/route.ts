import { NextResponse } from "next/server";
import { enquirySchema } from "@/lib/leads/schema";
import { recordLead } from "@/lib/leads/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = enquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  try {
    await recordLead("product_enquiry", parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not send your enquiry right now. Please try again." },
      { status: 500 },
    );
  }
}
