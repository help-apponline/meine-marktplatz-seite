import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import AdCard from "../components/AdCard.jsx";
import AdFilter from "../components/AdFilter.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";
import { categoryLabel } from "../lib/categories.js";

export default function Gesuche() {
  const { loadAds } = useAuth();
  const [searchParams] = useSearchParams();
  const [ads, setAds] = useState([]);
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [city, setCity] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    loadAds('role = "customer"')
      .then(items => { if (active) { setAds(items); setLoading(false); } })
      .catch(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  function parsePrice(str) {
    if (!str) return null;
    const n = parseFloat(String(str).replace(/[^\d.,]/g, "").replace(",", "."));
    return isNaN(n) ? null : n;
  }

  const filtered = ads.filter(a => {
    const q = query.trim().toLowerCase();
    if (q) {
      const catInfo = a.category ? categoryLabel(a.category) : null;
      const haystack = [a.title, a.city, a.zip, a.when, a.desc, catInfo?.label, a.category].filter(Boolean).join(" ").toLowerCase();
      if (!q.split(/\s+/).filter(Boolean).every(word => haystack.includes(word))) return false;
    }
    if (city.trim() && !(a.city + " " + a.zip).toLowerCase().includes(city.trim().toLowerCase())) return false;
    if (maxPrice) {
      const adPrice = parsePrice(a.price);
      const cap = parseFloat(maxPrice);
      if (!isNaN(cap) && adPrice !== null && adPrice > cap) return false;
    }
    if (category && a.category !== category) return false;
    return true;
  });

  function reset() { setQuery(""); setCity(""); setMaxPrice(""); setCategory(""); }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Gesuche</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">Hier findest du Nutzer, die Hilfe suchen.</p>

      {/* Fester Hinweis-Banner für Helfer */}
      <Link to="/anzeige" style={{ textDecoration: "none" }}>
        <div className="flex items-center justify-between gap-3 bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 mb-6 hover:shadow-sm transition-shadow">
          <span className="text-sm text-gray-700">
            Du möchtest helfen? <span className="font-semibold text-[#ff8a00]">Biete kostenlos deine Hilfe an →</span>
          </span>
        </div>
      </Link>

      <AdFilter
        query={query} setQuery={setQuery}
        city={city} setCity={setCity}
        maxPrice={maxPrice} setMaxPrice={setMaxPrice}
        category={category} setCategory={setCategory}
        onReset={reset}
      />

      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-gray-800">Neueste Gesuche</h3>
        {!loading && <span className="text-xs text-gray-400">{filtered.length} Treffer</span>}
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-5 py-6 text-gray-500 text-sm">
          {query || city || maxPrice
            ? <span>Keine Treffer für diese Filter. <button onClick={reset} className="underline">Zurücksetzen</button></span>
            : "Noch keine Gesuche vorhanden."}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(ad => <AdCard key={ad.id} ad={ad} />)}
        </div>
      )}

      <div className="mt-10">
        <PartnerBanner visitorCity={city} />
      </div>
    </section>
  );
}
