import { NextResponse } from "next/server";
import { parseSlip } from "@/lib/parser/parseSlip";

export async function POST(req: Request) {
  const { slipText } = await req.json();

  const parsed = parseSlip(String(slipText ?? ""));

  return NextResponse.json({
    ok: true,
    receivedChars: String(slipText ?? "").length,
    legsFound: parsed.length,
    parsed,
  });
}
