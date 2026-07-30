import { NextResponse } from "next/server";
import { showroomVisitSchema } from "@/lib/leads/schema";
import { recordLead } from "@/lib/leads/store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = showroomVisitSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid submission" },
      { status: 400 },
    );
  }

  try {
    await recordLead("showroom_visit", parsed.data);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Could not book your visit right now. Please try again." },
      { status: 500 },
    );
  }
}
