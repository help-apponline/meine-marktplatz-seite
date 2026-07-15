import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import AdCard from "../components/AdCard.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";
import { categoryLabel } from "../lib/categories.js";
import Search from "icon:search";

function matchesQuery(ad, q) {
  if (!q) return true;
  const catInfo = ad.category ? categoryLabel(ad.category) : null;
  const haystack = [ad.title, ad.city, ad.zip, ad.when, ad.desc, catInfo?.label, ad.category]
    .filter(Boolean).join(" ").toLowerCase();
  const wordMatches = (word) => {
    if (haystack.includes(word)) return true;
    if (word.length >= 5 && haystack.includes(word.slice(0, word.length - 2))) return true;
    return false;
  };
  return q.trim().toLowerCase().split(/\s+/).filter(Boolean).every(wordMatches);
}

export default function Suche() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { loadAds } = useAuth();
  const [inputVal, setInputVal] = useState(() => searchParams.get("q") || "");
  const [query, setQuery] = useState(() => searchParams.get("q") || "");
  const [allAngebote, setAllAngebote] = useState([]);
  const [allGesuche, setAllGesuche] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("alle");

  // Load all ads directly — filter client-side
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    pb.collection("ads").getList(1, 200, { sort: "-created", expand: "owner" })
      .then(result => {
        if (cancelled) return;
        const all = result.items.map(r => ({
          id: r.id,
          owner: r.owner,
          ownerId: r.expand?.owner?.id || r.owner || "",
          role: r.role,
          name: r.name,
          title: r.title,
          city: r.city,
          zip: r.zip || "",
          when: r.when_time || "",
          price: r.price,
          preisart: r.preisart,
          priceLabel: r.price_label || r.price || "—",
          desc: r.desc,
          status: r.status,
          category: r.category || "",
          photos: (r.photos || []).map(f => pb.files.getURL(r, f, { thumb: "400x300" })),
          expiresAt: r.expires_at ? new Date(r.expires_at).getTime() : null,
          createdAt: new Date(r.created).getTime(),
          updatedAt: new Date(r.updated).getTime(),
        }));
        setAllAngebote(all.filter(a => a.role === "helper"));
        setAllGesuche(all.filter(a => a.role === "customer"));
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const q = inputVal.trim();
    setQuery(q);
    setSearchParams(q ? { q } : {});
  }

  const angebote = query ? allAngebote.filter(ad => matchesQuery(ad, query)) : allAngebote;
  const gesuche  = query ? allGesuche.filter(ad => matchesQuery(ad, query))  : allGesuche;
  const filteredAngebote = tab === "gesuche" ? [] : angebote;
  const filteredGesuche  = tab === "angebote" ? [] : gesuche;
  const total = filteredAngebote.length + filteredGesuche.length;

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-4xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Suche</h2>

      {/* Search bar */}
      <form onSubmit={handleSubmit} className="flex gap-0 rounded-xl overflow-hidden border border-gray-200 shadow-sm focus-within:border-gray-400 transition-colors mb-6">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Stichwort, Ort, PLZ oder Kategorie…"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            className="w-full pl-8 pr-3 py-3 text-sm text-gray-900 focus:outline-none bg-white"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-[#ff8a00] text-white font-semibold text-sm hover:bg-[#e67a00] transition-colors shrink-0"
        >
          Suchen
        </button>
      </form>

      {/* Tabs */}
      {!loading && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: "alle", label: `Alle (${angebote.length + gesuche.length})` },
            { key: "angebote", label: `Angebote (${angebote.length})` },
            { key: "gesuche", label: `Gesuche (${gesuche.length})` },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                tab === t.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : total === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-500 text-sm mb-4">
            {query ? `Keine Treffer für „${query}".` : "Gib einen Suchbegriff ein, um Angebote und Gesuche zu finden."}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/angebote" className="text-sm text-[#ff8a00]" style={{ textDecoration: "none" }}>
              Alle Angebote ansehen
            </Link>
            <Link to="/gesuche" className="text-sm text-[#ff8a00]" style={{ textDecoration: "none" }}>
              Alle Gesuche ansehen
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {filteredAngebote.length > 0 && (
            <div>
              {tab === "alle" && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Angebote</h3>
                  <span className="text-xs text-gray-400">{filteredAngebote.length} Treffer</span>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {filteredAngebote.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            </div>
          )}

          {filteredGesuche.length > 0 && (
            <div>
              {tab === "alle" && (
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">Gesuche</h3>
                  <span className="text-xs text-gray-400">{filteredGesuche.length} Treffer</span>
                </div>
              )}
              <div className="flex flex-col gap-3">
                {filteredGesuche.map(ad => <AdCard key={ad.id} ad={ad} />)}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-10">
        <PartnerBanner />
      </div>
    </section>
  );
}
