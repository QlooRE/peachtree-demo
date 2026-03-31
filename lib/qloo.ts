const QLOO_BASE = "https://api.qloo.com";

function getKey() {
  const key = process.env.QLOO_API_KEY;
  if (!key) throw new Error("QLOO_API_KEY not set");
  return key;
}

async function qlooGet(path: string, params: Record<string, string>) {
  const url = new URL(`${QLOO_BASE}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    headers: { "X-Api-Key": getKey() },
    next: { revalidate: 0 },
  });
  if (!res.ok) throw new Error(`Qloo ${path} → ${res.status}`);
  return res.json();
}

function similarity(a: string, b: string): number {
  const al = a.toLowerCase(), bl = b.toLowerCase();
  if (al === bl) return 1;
  const longer = Math.max(al.length, bl.length);
  if (longer === 0) return 1;
  let matches = 0;
  for (let i = 0; i < Math.min(al.length, bl.length); i++) {
    if (al[i] === bl[i]) matches++;
  }
  return (matches * 2) / (al.length + bl.length);
}

export async function searchArtist(name: string): Promise<{ id: string; name: string } | null> {
  const data = await qlooGet("/search", { query: name, "filter.type": "urn:entity:artist", take: "5" });
  const results: { entity_id: string; name: string }[] = data.results ?? [];
  if (!results.length) return null;
  const best = results[0];
  if (similarity(name, best.name) >= 0.70) return { id: best.entity_id, name: best.name };
  return null;
}

export async function getSimilarArtists(entityId: string, locationQuery: string, take = 8) {
  const data = await qlooGet("/v2/insights", {
    "filter.type": "urn:entity:artist",
    "signal.interests.entities": entityId,
    "signal.location.query": locationQuery,
    take: String(take),
  });
  return (data.results?.entities ?? []) as QlooEntity[];
}

export async function getBrandAffinities(entityId: string, locationQuery: string, take = 10) {
  const data = await qlooGet("/v2/insights", {
    "filter.type": "urn:entity:brand",
    "signal.interests.entities": entityId,
    "signal.location.query": locationQuery,
    take: String(take),
  });
  return (data.results?.entities ?? []) as QlooEntity[];
}

export async function compareArtists(idA: string, idB: string, take = 12) {
  const data = await qlooGet("/v2/analysis/compare", {
    "a.signal.interests.entities": idA,
    "b.signal.interests.entities": idB,
    "filter.type": "urn:entity:artist",
    take: String(take),
  });
  const results = data.results ?? {};
  return {
    shared: (results.tags ?? []) as QlooTag[],
    onlyA: (results.a ?? []) as QlooTag[],
    onlyB: (results.b ?? []) as QlooTag[],
  };
}

export interface QlooEntity {
  entity_id: string;
  name: string;
  properties?: {
    image?: { url: string };
    short_description?: string;
  };
  query?: { affinity?: number };
  tags?: { name: string; tag_id: string; type: string }[];
}

export interface QlooTag {
  tag_id: string;
  name: string;
  subtype?: string;
  query?: { score?: number };
}
