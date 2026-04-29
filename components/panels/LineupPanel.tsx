"use client";
import { useState } from "react";
import { PRESEEDED_ARTISTS } from "@/lib/constants";
import { QlooTag } from "@/lib/qloo";
import { trackedFetch } from "@/lib/api-stream";
import { TagGroup } from "@/components/TagGroup";
import { SectionLabel, SectionCaption, NotFound, SuccessBadge, Spinner, Select, Input, Button, InsightBox } from "@/components/ui";

export function LineupPanel() {
  const [artistA, setArtistA] = useState("");
  const [customA, setCustomA] = useState("");
  const [artistB, setArtistB] = useState("");
  const [customB, setCustomB] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    nameA: string; nameB: string;
    shared: QlooTag[]; onlyA: QlooTag[]; onlyB: QlooTag[];
  } | null>(null);
  const [notFound, setNotFound] = useState<string[]>([]);

  const effectiveA = artistA === "__custom__" ? customA : artistA;
  const effectiveB = artistB === "__custom__" ? customB : artistB;

  async function run() {
    if (!effectiveA || !effectiveB) return;
    setLoading(true); setResult(null); setNotFound([]);
    try {
      const [resA, resB] = await Promise.all([
        trackedFetch<{ found: boolean; id?: string; name?: string }>(`/api/search-artist?name=${encodeURIComponent(effectiveA)}`),
        trackedFetch<{ found: boolean; id?: string; name?: string }>(`/api/search-artist?name=${encodeURIComponent(effectiveB)}`),
      ]);
      const missing = [!resA.found && effectiveA, !resB.found && effectiveB].filter(Boolean) as string[];
      if (missing.length) { setNotFound(missing); setLoading(false); return; }

      const compareRes = await trackedFetch<{ shared: QlooTag[]; onlyA: QlooTag[]; onlyB: QlooTag[] }>(`/api/compare-artists?idA=${resA.id}&idB=${resB.id}`);
      setResult({ nameA: resA.name!, nameB: resB.name!, ...compareRes });
    } finally { setLoading(false); }
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)", maxWidth: 600 }}>
        Compare two artists' cultural fingerprints to validate co-headlining strategy and identify the crossover DNA.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <Select label="Artist A" value={artistA} onChange={setArtistA} options={PRESEEDED_ARTISTS} />
          {artistA === "__custom__" && <div className="mt-2"><Input label="" value={customA} onChange={setCustomA} placeholder="Artist A name" /></div>}
        </div>
        <div>
          <Select label="Artist B" value={artistB} onChange={setArtistB} options={PRESEEDED_ARTISTS} />
          {artistB === "__custom__" && <div className="mt-2"><Input label="" value={customB} onChange={setCustomB} placeholder="Artist B name" /></div>}
        </div>
        <div className="flex items-end">
          <Button onClick={run} disabled={loading || !effectiveA || !effectiveB}>
            {loading ? "Comparing…" : "Compare Fan Bases"}
          </Button>
        </div>
      </div>

      {loading && <Spinner />}
      {notFound.map((n) => <NotFound key={n} name={n} />)}

      {result && (
        <>
          <SuccessBadge>{result.nameA} vs {result.nameB}</SuccessBadge>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-2">
            <div>
              <SectionLabel>{result.nameA} Signature</SectionLabel>
              <SectionCaption>Traits unique to this fanbase</SectionCaption>
              {result.onlyA.length ? <TagGroup tags={result.onlyA} /> : <p className="text-sm" style={{ color: "var(--muted)" }}>No unique traits found.</p>}
            </div>
            <div>
              <SectionLabel accent>Shared DNA</SectionLabel>
              <SectionCaption>Cultural common ground — the crossover audience</SectionCaption>
              {result.shared.length ? <TagGroup tags={result.shared} /> : <p className="text-sm" style={{ color: "var(--muted)" }}>No shared traits found.</p>}
            </div>
            <div>
              <SectionLabel>{result.nameB} Signature</SectionLabel>
              <SectionCaption>Traits unique to this fanbase</SectionCaption>
              {result.onlyB.length ? <TagGroup tags={result.onlyB} /> : <p className="text-sm" style={{ color: "var(--muted)" }}>No unique traits found.</p>}
            </div>
          </div>

          <InsightBox label="🎯 Booking Intelligence">
            {result.shared.length > 0
              ? <>Both fanbases share <strong style={{ color: "#fff" }}>{result.shared.slice(0, 5).map(t => t.name).join(", ")}</strong>. This is your positioning brief for the co-bill and the first slide for sponsor conversations.</>
              : <>{result.nameA} and {result.nameB} carry distinct cultural profiles — a co-bill maximizes reach into new segments rather than reinforcing the same crowd.</>
            }
          </InsightBox>
        </>
      )}
    </div>
  );
}
