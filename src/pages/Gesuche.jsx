import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdCard from "../components/AdCard.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";

const SEED = [
  { type: "gesuch", title: "Wohnung reinigen", place: "Berlin", price: "Pauschal", meta: "Diese Woche", desc: "Suche Hilfe beim Reinigen einer 2-Zimmer-Wohnung. Putzmittel vorhanden." },
  { type: "gesuch", title: "Umzugskartons tragen", place: "Leipzig", price: "Verhandelbar", meta: "Wochenende", desc: "2–3 Stunden helfen Kartons zu tragen, Aufzug vorhanden." },
  { type: "gesuch", title: "Rasen mähen", place: "Stuttgart", price: "20€/Stunde", meta: "Morgen", desc: "Rasen mähen im kleinen Garten. Gerät vorhanden, Hilfe gesucht." },
];

export default function Gesuche() {
  const { loadAds } = useAuth();
  const [query, setQuery] = useState("");

  const dbAds = useMemo(() => loadAds().filter(a => a.role === "customer"), []);

  const filteredDb = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return dbAds;
    return dbAds.filter(a => (a.title + a.city + a.when).toLowerCase().includes(q));
  }, [dbAds, query]);

  const filteredSeed = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return SEED;
    return SEED.filter(x => (x.title + x.place + x.meta).toLowerCase().includes(q));
  }, [query]);

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Anzeigen Gesuche</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">Hier finden Sie die Hilfegesuche von Nutzern, die Unterstützung benötigen.</p>

      <input
        type="text"
        placeholder="Suchen…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 mb-8 transition-colors"
      />

      <h3 className="font-bold text-gray-800 mb-3">Neueste Gesuche</h3>
      <div className="flex flex-col gap-3">
        {filteredDb.map(ad => <AdCard key={ad.id} ad={ad} />)}
        {filteredSeed.map((item, i) => <AdCard key={i} seedItem={item} />)}
        {!filteredDb.length && !filteredSeed.length && (
          <p className="text-gray-400 text-sm">Keine Treffer für „{query}".</p>
        )}
      </div>

      <div className="mt-10">
        <PartnerBanner />
      </div>
    </section>
  );
}
