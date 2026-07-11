import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import AdCard from "../components/AdCard.jsx";
import AdFilter from "../components/AdFilter.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";

export default function Angebote() {
  const { loadAds } = useAuth();
  const [ads, setAds] = useState([]);
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    loadAds('role = "helper"')
      .then(items => { if (!controller.signal.aborted) { setAds(items); setLoading(false); } })
      .catch(e => { if (!e?.isAbort) setLoading(false); });
    return () => controller.abort();
  }, []);

  function parsePrice(str) {
    if (!str) return null;
    const n = parseFloat(String(str).replace(/[^\d.,]/g, "").replace(",", "."));
    return isNaN(n) ? null : n;
  }

  const filtered = ads.filter(a => {
    const q = query.trim().toLowerCase();
    if (q && !(a.title + " " + a.city + " " + a.when + " " + a.desc).toLowerCase().includes(q)) return false;
    if (city.trim() && !(a.city + " " + a.zip).toLowerCase().includes(city.trim().toLowerCase())) return false;
    if (maxPrice) {
      const adPrice = parsePrice(a.price);
      const cap = parseFloat(maxPrice);
      if (!isNaN(cap) && adPrice !== null && adPrice > cap) return false;
    }
    return true;
  });

  function reset() { setQuery(""); setCity(""); setMaxPrice(""); }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Angebote</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">Hier findest du die Hilfeangebote anderer Nutzer.</p>

      {/* Fester Hinweis-Banner */}
      <Link to="/anzeige" style={{ textDecoration: "none" }}>
        <div className="flex items-center justify-between gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-6 hover:shadow-sm transition-shadow">
          <span className="text-sm text-gray-700">
            Kein passendes Angebot gefunden? <span className="font-semibold text-[#ff8a00]">Gib kostenlos ein Gesuch auf →</span>
          </span>
        </div>
      </Link>

      <AdFilter
        query={query} setQuery={setQuery}
        city={city} setCity={setCity}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        onReset={reset}
      />

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Neueste Angebote</h3>
        {!loading && <span className="text-xs text-gray-400">{filtered.length} Treffer</span>}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-5 py-6 text-gray-500 text-sm">
          {query || city || maxPrice
            ? <span>Keine Treffer für diese Filter. <button onClick={reset} className="underline">Zurücksetzen</button></span>
            : "Noch keine Angebote vorhanden."}
        </div>
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
