"use client";
import { useState } from "react";
import { PRESEEDED_ARTISTS, UNIVERSITY_MAP, resolveUniversity } from "@/lib/constants";
import { QlooEntity } from "@/lib/qloo";
import { BrandCard } from "@/components/BrandCard";
import { SectionLabel, SectionCaption, NotFound, SuccessBadge, Spinner, Select, Input, Button } from "@/components/ui";

function renderConcepts(text: string) {
  // Bold **text** and line breaks
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const bold = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    return <p key={i} className="mb-2 text-sm leading-relaxed" style={{ color: "#ccc" }} dangerouslySetInnerHTML={{ __html: bold }} />;
  });
}

export function ExperiencePanel() {
  const [artist, setArtist] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [market, setMarket] = useState("");
  const [customMarket, setCustomMarket] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ canonicalName: string; locality: string; brands: QlooEntity[]; concepts: string } | null>(null);
  const [notFound, setNotFound] = useState("");

  const effectiveArtist = artist === "__custom__" ? customArtist : artist;
  const effectiveMarket = market === "__custom__" ? customMarket : market;

  async function run() {
    if (!effectiveArtist || !effectiveMarket) return;
    setLoading(true); setResult(null); setNotFound("");
    try {
      const locality = resolveUniversity(effectiveMarket);
      const searchRes = await fetch(`/api/search-artist?name=${encodeURIComponent(effectiveArtist)}`).then(r => r.json());
      if (!searchRes.found) { setNotFound(effectiveArtist); setLoading(false); return; }

      const brandRes = await fetch(`/api/brand-affinities?entityId=${searchRes.id}&location=${encodeURIComponent(locality)}&take=12`).then(r => r.json());
      const brands: QlooEntity[] = brandRes.entities ?? [];

      const conceptRes = await fetch("/api/experience-concepts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistName: searchRes.name, location: locality, brands }),
      }).then(r => r.json());

      setResult({ canonicalName: searchRes.name, locality, brands, concepts: conceptRes.concepts ?? "" });
    } finally { setLoading(false); }
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)", maxWidth: 600 }}>
        Surface the lifestyle and cultural DNA of a fanbase, then let Claude synthesize Qloo signals into concrete, sponsor-ready experience concepts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select label="Artist" value={artist} onChange={setArtist} options={PRESEEDED_ARTISTS} />
        {artist === "__custom__" && <Input label="Artist name" value={customArtist} onChange={setCustomArtist} placeholder="e.g. Morgan Wallen" />}
        <Select label="Market / University" value={market} onChange={setMarket} options={Object.keys(UNIVERSITY_MAP)} />
        {market === "__custom__" && <Input label="City or university" value={customMarket} onChange={setCustomMarket} placeholder="e.g. Nashville" />}
        <div className="flex items-end">
          <Button onClick={run} disabled={loading || !effectiveArtist || !effectiveMarket}>
            {loading ? "Generating…" : "Generate Concepts"}
          </Button>
        </div>
      </div>

      {loading && <Spinner />}
      {notFound && <NotFound name={notFound} />}

      {result && (
        <>
          <SuccessBadge>{result.canonicalName} · {result.locality}</SuccessBadge>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mt-2">
            <div className="md:col-span-2">
              <SectionLabel>Cultural Brand Signals</SectionLabel>
              <SectionCaption>Lifestyle brands this fanbase over-indexes for</SectionCaption>
              {result.brands.slice(0, 8).map((b) => <BrandCard key={b.entity_id} entity={b} />)}
            </div>
            <div className="md:col-span-3">
              <SectionLabel>Experience Concepts</SectionLabel>
              <SectionCaption>Claude synthesizes Qloo signals into actionable ideas</SectionCaption>
              <div className="rounded-lg p-5 border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
                {renderConcepts(result.concepts)}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
