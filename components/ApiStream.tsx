"use client";

import { useSyncExternalStore } from "react";
import { subscribe, getSnapshot, getServerSnapshot, type QlooCall } from "@/lib/api-stream";

const MONO = "'JetBrains Mono', 'SF Mono', Menlo, monospace";

function CallRow({ call }: { call: QlooCall }) {
  const isOk = call.status === "OK";
  const statusColor = isOk ? "#4caf50" : "#E8524A";
  const params = Object.entries(call.summary);

  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        padding: "7px 14px",
        borderBottom: "1px solid #1a1a1a",
        fontFamily: MONO,
        fontSize: "0.72rem",
      }}
    >
      <span style={{ color: "#555", width: 62, flexShrink: 0 }}>{call.ts}</span>
      <span style={{ color: statusColor, width: 60, flexShrink: 0, fontWeight: 700 }}>{call.status}</span>
      <span style={{ color: "#fff", width: 220, flexShrink: 0, fontWeight: 600 }}>GET {call.path}</span>
      <span
        style={{
          color: "#888",
          flex: 1,
          minWidth: 0,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {params.length === 0 ? (
          <span style={{ color: "#555" }}>—</span>
        ) : (
          params.map(([k, v], i) => (
            <span key={k}>
              {i > 0 && " · "}
              {k}=<span style={{ color: "#ddd" }}>{String(v).slice(0, 32)}</span>
            </span>
          ))
        )}
      </span>
      <span style={{ color: "#666", width: 64, flexShrink: 0, textAlign: "right" }}>{call.latency_ms} ms</span>
    </div>
  );
}

export function ApiStream() {
  const calls = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const total = calls.length;
  const recent = calls.slice(-12).reverse();

  return (
    <div
      style={{
        marginTop: "3rem",
        padding: "1.5rem 2.5rem 2rem",
        background: "#0a0a0a",
        borderTop: "2px solid var(--accent)",
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginBottom: "1rem" }}>
        <div
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "1.1rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "#fff",
          }}
        >
          Qloo API Stream
        </div>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#4caf50",
              boxShadow: "0 0 8px #4caf50",
              display: "inline-block",
              animation: "pih-pulse 1.4s ease-in-out infinite",
            }}
          />
          <span
            style={{
              color: "#888",
              fontSize: "0.7rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Live
          </span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 18, alignItems: "baseline" }}>
          <span
            style={{
              color: "#666",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Calls this session
          </span>
          <span
            style={{
              color: "#fff",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1.4rem",
              fontWeight: 800,
            }}
          >
            {total}
          </span>
        </div>
      </div>
      <div style={{ background: "#0d0d0d", border: "1px solid #1f1f1f", borderRadius: 4, overflow: "hidden" }}>
        {recent.length === 0 ? (
          <div style={{ padding: "18px 14px", color: "#555", fontSize: "0.78rem", fontStyle: "italic" }}>
            No Qloo API calls yet — run an analysis above to see the stream populate.
          </div>
        ) : (
          recent.map((c, i) => <CallRow key={`${c.ts}-${i}-${c.path}`} call={c} />)
        )}
      </div>
      <style>{`
        @keyframes pih-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
