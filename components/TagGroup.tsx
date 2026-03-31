import { QlooTag } from "@/lib/qloo";

export function TagGroup({ tags, limit = 12 }: { tags: QlooTag[]; limit?: number }) {
  const byType: Record<string, string[]> = {};
  for (const t of tags.slice(0, limit)) {
    const subtype = (t.subtype ?? "other").split(":").pop()?.replace(/_/g, " ").toUpperCase() ?? "OTHER";
    if (!byType[subtype]) byType[subtype] = [];
    byType[subtype].push(t.name);
  }
  return (
    <div className="space-y-3">
      {Object.entries(byType).map(([type, names]) => (
        <div key={type}>
          <div className="text-xs font-bold mb-1.5" style={{ color: "var(--accent)", letterSpacing: "0.1em" }}>{type}</div>
          <div className="flex flex-wrap gap-1.5">
            {names.map((n) => (
              <span key={n} className="text-xs px-2.5 py-1 rounded-full border" style={{ background: "var(--surface2)", borderColor: "var(--border)", color: "#ccc" }}>
                {n}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
