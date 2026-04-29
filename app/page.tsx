"use client";
import { useState } from "react";
import { UniversityPanel } from "@/components/panels/UniversityPanel";
import { ExperiencePanel } from "@/components/panels/ExperiencePanel";
import { LineupPanel } from "@/components/panels/LineupPanel";
import { ApiStream } from "@/components/ApiStream";

const TABS = [
  { id: "university", label: "🎓  University Partnership" },
  { id: "experience", label: "✨  Experience Branding" },
  { id: "lineup",     label: "🎚️  Lineup Overlap" },
];

export default function Home() {
  const [active, setActive] = useState("university");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(160deg, #111 0%, #1a0808 60%, #111 100%)",
        borderBottom: "3px solid var(--accent)",
        padding: "3.5rem 2.5rem 2.5rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "radial-gradient(ellipse at 80% 50%, rgba(232,82,74,0.13) 0%, transparent 55%)",
        }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.18em", color: "var(--accent)", textTransform: "uppercase", marginBottom: "0.6rem" }}>
            Powered by Qloo Cultural Intelligence + Claude AI
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: "clamp(2.8rem, 6vw, 5rem)",
            fontWeight: 900,
            textTransform: "uppercase",
            color: "#fff",
            lineHeight: 0.92,
            margin: 0,
          }}>
            Peachtree<br />
            <span style={{ background: "var(--accent)", padding: "0 0.15em 0.04em", display: "inline-block" }}>Intelligence</span>
            {" "}Hub
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#888", marginTop: "1.2rem", maxWidth: 520, lineHeight: 1.6 }}>
            Real-time cultural data for smarter venue activation, sponsor alignment, and experience branding.
          </p>
          <div style={{ display: "flex", gap: 10, marginTop: "1.4rem", flexWrap: "wrap" }}>
            {["3.7B Entities", "10T Signals", "Zero PII", "Live API"].map(b => (
              <span key={b} style={{
                background: "var(--surface)", border: "1px solid var(--border)",
                color: "#aaa", fontSize: "0.72rem", fontWeight: 600,
                letterSpacing: "0.08em", textTransform: "uppercase",
                padding: "5px 12px", borderRadius: 3,
              }}>{b}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid var(--border)", paddingLeft: "2.5rem", display: "flex" }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: active === tab.id ? "3px solid var(--accent)" : "3px solid transparent",
              color: active === tab.id ? "#fff" : "var(--muted)",
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "1rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "0.85rem 1.5rem",
              cursor: "pointer",
              marginBottom: -1,
              transition: "color 0.15s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div style={{ padding: "2rem 2.5rem", maxWidth: 1400 }}>
        {active === "university" && <UniversityPanel />}
        {active === "experience" && <ExperiencePanel />}
        {active === "lineup"     && <LineupPanel />}
      </div>

      {/* Qloo API Stream */}
      <ApiStream />
    </div>
  );
}
