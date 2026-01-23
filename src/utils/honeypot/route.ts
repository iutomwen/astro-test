import { NextRequest, NextResponse } from "next/server";
import { scoreLead } from "@/lib/bot-detection/scoreLead";
import { LeadSubmission } from "@/lib/types/lead";

export async function POST(req: NextRequest) {
  const data = (await req.json()) as LeadSubmission;

  const result = scoreLead(data);

  if (result.isSpam) {
    console.warn("Spam lead detected", {
      score: result.score,
      reasons: result.reasons,
      email: data.email,
    });

    // Silent success — bots think they won
    return NextResponse.json({ success: true });
  }

  // TODO: process legit lead
  // await saveLead(data)
  // await sendToCRM(data)

  return NextResponse.json({ success: true });
}