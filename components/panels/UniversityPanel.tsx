"use client";
import { useState } from "react";
import { PRESEEDED_ARTISTS, UNIVERSITY_MAP, resolveUniversity } from "@/lib/constants";
import { QlooEntity } from "@/lib/qloo";
import { ArtistCard } from "@/components/ArtistCard";
import { BrandCard } from "@/components/BrandCard";
import { SectionLabel, SectionCaption, NotFound, SuccessBadge, Spinner, Select, Input, Button } from "@/components/ui";

export function UniversityPanel() {
  const [artist, setArtist] = useState("");
  const [customArtist, setCustomArtist] = useState("");
  const [university, setUniversity] = useState("");
  const [customUniversity, setCustomUniversity] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    canonicalName: string; locality: string;
    similarArtists: QlooEntity[]; brands: QlooEntity[];
  } | null>(null);
  const [notFound, setNotFound] = useState("");

  const effectiveArtist = artist === "__custom__" ? customArtist : artist;
  const effectiveUniversity = university === "__custom__" ? customUniversity : university;

  async function run() {
    if (!effectiveArtist || !effectiveUniversity) return;
    setLoading(true); setResult(null); setNotFound("");
    try {
      const locality = resolveUniversity(effectiveUniversity);
      const searchRes = await fetch(`/api/search-artist?name=${encodeURIComponent(effectiveArtist)}`).then(r => r.json());
      if (!searchRes.found) { setNotFound(effectiveArtist); setLoading(false); return; }

      const [simRes, brandRes] = await Promise.all([
        fetch(`/api/similar-artists?entityId=${searchRes.id}&location=${encodeURIComponent(locality)}`).then(r => r.json()),
        fetch(`/api/brand-affinities?entityId=${searchRes.id}&location=${encodeURIComponent(locality)}`).then(r => r.json()),
      ]);
      setResult({ canonicalName: searchRes.name, locality, similarArtists: simRes.entities ?? [], brands: brandRes.entities ?? [] });
    } finally { setLoading(false); }
  }

  return (
    <div>
      <p className="text-sm mb-6" style={{ color: "var(--muted)", maxWidth: 600 }}>
        Identify which artists culturally fit a specific university market and surface sponsor brands that resonate with fans in that catchment.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <Select label="Artist" value={artist} onChange={setArtist} options={PRESEEDED_ARTISTS} />
        {artist === "__custom__" && <Input label="Artist name" value={customArtist} onChange={setCustomArtist} placeholder="e.g. Morgan Wallen" />}
        <Select label="University" value={university} onChange={setUniversity} options={Object.keys(UNIVERSITY_MAP)} />
        {university === "__custom__" && <Input label="University name" value={customUniversity} onChange={setCustomUniversity} placeholder="e.g. Florida State" />}
        <div className="flex items-end">
          <Button onClick={run} disabled={loading || !effectiveArtist || !effectiveUniversity}>
            {loading ? "Analyzing…" : "Analyze Market"}
          </Button>
        </div>
      </div>

      {loading && <Spinner />}
      {notFound && <NotFound name={notFound} />}

      {result && (
        <>
          <SuccessBadge>{result.canonicalName} · {result.locality}</SuccessBadge>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-2">
            <div>
              <SectionLabel>Fan Taste Map</SectionLabel>
              <SectionCaption>Artists fans of {result.canonicalName} also love in {result.locality}</SectionCaption>
              {result.similarArtists.map((e) => <ArtistCard key={e.entity_id} entity={e} />)}
            </div>
            <div>
              <SectionLabel>Sponsor Brand Affinities</SectionLabel>
              <SectionCaption>Brands that resonate with {result.canonicalName} fans in {result.locality}</SectionCaption>
              {result.brands.map((b) => <BrandCard key={b.entity_id} entity={b} />)}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
