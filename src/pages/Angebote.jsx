import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import AdCard from "../components/AdCard.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";

const SEED = [
  { type: "angebot", title: "Gartenhilfe", place: "München", price: "15€/Stunde", meta: "Heute", desc: "Ich biete Unterstützung bei Gartenarbeiten wie Rasen mähen, Unkraut jäten und kleinere Pflegearbeiten an." },
  { type: "angebot", title: "Einkaufshilfe", place: "Hamburg", price: "Festpreis", meta: "Diese Woche", desc: "Einkäufe erledigen, Besorgungen, Begleitung – zuverlässig und freundlich." },
  { type: "angebot", title: "Hund ausführen", place: "Köln", price: "10€/Stunde", meta: "Morgen", desc: "Gassi gehen, Füttern, kurze Betreuung. Erfahrung mit Hunden vorhanden." },
];

export default function Angebote() {
  const { loadAds } = useAuth();
  const [query, setQuery] = useState("");

  const dbAds = useMemo(() => loadAds().filter(a => a.role === "helper"), []);

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
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Anzeigen Angebote</h2>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">Hier finden Sie die Aufgaben, die andere Nutzer anbieten.</p>

      <input
        type="text"
        placeholder="Suchen…"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full max-w-xl px-4 py-3.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 mb-8 transition-colors"
      />

      <h3 className="font-bold text-gray-800 mb-3">Neueste Angebote</h3>
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
