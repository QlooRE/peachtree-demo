import { QlooEntity } from "@/lib/qloo";

export function BrandCard({ entity }: { entity: QlooEntity }) {
  const img = entity.properties?.image?.url;
  const desc = entity.properties?.short_description ?? "";
  const affinity = entity.query?.affinity ?? 0;
  return (
    <div className="flex gap-3 items-start py-3 border-b" style={{ borderColor: "var(--border)" }}>
      {img ? (
        <img src={img} alt={entity.name} className="w-12 h-12 rounded object-contain shrink-0 p-1" style={{ background: "var(--surface2)" }} />
      ) : (
        <div className="w-12 h-12 rounded shrink-0" style={{ background: "var(--surface2)" }} />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-white">{entity.name}</div>
        {desc && <div className="text-xs mt-1 leading-relaxed" style={{ color: "var(--muted)" }}>{desc.slice(0, 90)}{desc.length > 90 ? "…" : ""}</div>}
        {affinity > 0 && (
          <span className="inline-block mt-1.5 text-xs font-bold px-2 py-0.5 rounded text-white" style={{ background: "var(--accent)", letterSpacing: "0.05em" }}>
            AFFINITY {Math.round(affinity * 100)}%
          </span>
        )}
      </div>
    </div>
  );
}
