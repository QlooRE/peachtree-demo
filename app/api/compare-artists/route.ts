import { NextRequest, NextResponse } from "next/server";
import { compareArtists, withQlooTracking } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const idA = searchParams.get("idA") ?? "";
  const idB = searchParams.get("idB") ?? "";
  if (!idA || !idB) return NextResponse.json({ error: "idA and idB required" }, { status: 400 });
  try {
    const { result, calls } = await withQlooTracking(() => compareArtists(idA, idB));
    return NextResponse.json({ ...result, _qloo_calls: calls });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
