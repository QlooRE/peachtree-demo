import { NextRequest, NextResponse } from "next/server";
import { searchArtist, withQlooTracking } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  if (!name) return NextResponse.json({ error: "name required" }, { status: 400 });
  try {
    const { result, calls } = await withQlooTracking(() => searchArtist(name));
    if (!result) return NextResponse.json({ found: false, _qloo_calls: calls });
    return NextResponse.json({ found: true, ...result, _qloo_calls: calls });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
