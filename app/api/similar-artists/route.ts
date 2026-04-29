import { NextRequest, NextResponse } from "next/server";
import { getSimilarArtists, withQlooTracking } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const entityId = searchParams.get("entityId") ?? "";
  const location = searchParams.get("location") ?? "";
  if (!entityId || !location) return NextResponse.json({ error: "entityId and location required" }, { status: 400 });
  try {
    const { result: entities, calls } = await withQlooTracking(() => getSimilarArtists(entityId, location));
    return NextResponse.json({ entities, _qloo_calls: calls });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
