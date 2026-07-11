import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdCard from "../components/AdCard.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";

export default function Angebote() {
  const { loadAds } = useAuth();
  const [ads, setAds] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadAds('role = "helper"')
      .then(items => { if (!controller.signal.aborted) { setAds(items); setLoading(false); } })
      .catch(e => { if (!e?.isAbort) setLoading(false); });
    return () => controller.abort();
  }, []);

  const filtered = ads.filter(a => {
    const q = query.toLowerCase();
    if (!q) return true;
    return (a.title + a.city + a.when).toLowerCase().includes(q);
  });

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Anzeigen Angebote</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">Hier findest du die Hilfeangebote anderer Nutzer.</p>

      <input
        type="text"
        placeholder="Suchen…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 mb-8 transition-colors"
      />

      <h3 className="font-bold text-gray-800 mb-3">Neueste Angebote</h3>
      {loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-sm">{query ? `Keine Treffer für „${query}".` : "Noch keine Angebote vorhanden."}</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}

      <div className="mt-10">
        <PartnerBanner />
      </div>
    </section>
  );
}
