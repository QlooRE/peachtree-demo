"use client";

export function SectionLabel({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-1" style={{ margin: "1.5rem 0 0.4rem" }}>
      <div
        className="font-display text-xl font-black uppercase tracking-wide"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", color: accent ? "var(--accent)" : "#fff" }}
      >
        {children}
      </div>
      <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
    </div>
  );
}

export function SectionCaption({ children }: { children: React.ReactNode }) {
  return <div className="text-xs mb-3" style={{ color: "var(--muted)" }}>{children}</div>;
}

export function NotFound({ name }: { name: string }) {
  return (
    <div className="rounded px-4 py-3 border-l-4 my-4" style={{ background: "var(--surface)", borderColor: "var(--accent)" }}>
      <div className="font-semibold text-sm text-white">📋 {name} is currently being cataloged by Qloo.</div>
      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>Try one of the pre-seeded artists or check back soon.</div>
    </div>
  );
}

export function SuccessBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border mb-4 text-sm" style={{ background: "#0f2010", borderColor: "#2a5a2a", color: "#ccc" }}>
      <span style={{ color: "#4caf50" }}>✓</span>
      {children}
    </div>
  );
}

export function InsightBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded px-5 py-4 border border-l-4 mt-6" style={{ background: "var(--surface)", borderColor: "var(--border)", borderLeftColor: "var(--accent)" }}>
      <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "var(--accent)" }}>{label}</div>
      <div className="text-sm leading-relaxed" style={{ color: "#ccc" }}>{children}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex items-center gap-2 py-6 text-sm" style={{ color: "var(--muted)" }}>
      <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
      Loading…
    </div>
  );
}

export function Select({ label, value, onChange, options }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded px-3 py-2 text-sm outline-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
      >
        <option value="">— select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        <option value="__custom__">Custom…</option>
      </select>
    </div>
  );
}

export function Input({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="rounded px-3 py-2 text-sm outline-none"
        style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)" }}
      />
    </div>
  );
}

export function Button({ children, onClick, disabled }: {
  children: React.ReactNode; onClick: () => void; disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2 rounded text-white font-black uppercase tracking-widest text-sm transition-all"
      style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        background: disabled ? "#444" : "var(--accent)",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {children}
    </button>
  );
}
