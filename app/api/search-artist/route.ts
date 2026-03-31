import { NextRequest, NextResponse } from "next/server";
import { searchArtist } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  try {
    const result = await searchArtist(name);
    if (!result) return NextResponse.json({ found: false });
    return NextResponse.json({ found: true, ...result });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
