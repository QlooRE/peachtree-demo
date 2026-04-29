import { NextRequest, NextResponse } from "next/server";
import { getBrandAffinities, withQlooTracking } from "@/lib/qloo";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const entityId = searchParams.get("entityId") ?? "";
  const location = searchParams.get("location") ?? "";
  const take = Number(searchParams.get("take") ?? "10");
  if (!entityId || !location) return NextResponse.json({ error: "entityId and location required" }, { status: 400 });
  try {
    const { result: entities, calls } = await withQlooTracking(() => getBrandAffinities(entityId, location, take));
    return NextResponse.json({ entities, _qloo_calls: calls });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
