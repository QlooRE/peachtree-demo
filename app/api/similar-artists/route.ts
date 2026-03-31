import { NextRequest, NextResponse } from "next/server";
import { getSimilarArtists } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const entityId = searchParams.get("entityId") ?? "";
  const location = searchParams.get("location") ?? "";
  if (!entityId || !location) return NextResponse.json({ error: "entityId and location required" }, { status: 400 });
  try {
    const entities = await getSimilarArtists(entityId, location);
    return NextResponse.json({ entities });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
