import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PartnerBanner from "../components/PartnerBanner.jsx";
import Search from "icon:search";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    // Navigate to Angebote with city pre-filled via query string
    navigate(`/angebote?ort=${encodeURIComponent(q)}`);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-white text-center px-6 pt-14 pb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">
          Finde Hilfe. Werde Helfer.
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          Die Help App verbindet Menschen, die Unterstützung suchen, mit Helfern aus der Nähe – schnell und unkompliziert.
        </p>

        {/* Quick search */}
        <form onSubmit={handleSearch} className="flex gap-0 max-w-sm mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm focus-within:border-gray-400 transition-colors">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Ort oder PLZ…"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-3 py-2.5 text-sm text-gray-900 focus:outline-none bg-white"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#ff8a00] text-white font-semibold text-sm hover:bg-[#e67a00] transition-colors shrink-0"
          >
            Suchen
          </button>
        </form>
      </section>

      {/* Cards */}
      <section className="px-5 md:px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto w-full">
        {[
          { emoji: "🛠️", label: "Angebote", to: "/angebote" },
          { emoji: "🔍", label: "Gesuche", to: "/gesuche" },
          { emoji: "📝", label: "Anzeige kostenlos aufgeben", to: "/anzeige" },
          { emoji: "🤝", label: "Werbepartner-Bereich", to: "/werbepartner" },
        ].map(({ emoji, label, to }) => (
          <Link
            key={to}
            to={to}
            className="bg-white rounded-2xl p-8 text-center shadow hover:shadow-lg hover:-translate-y-1 transition-all text-gray-900"
            style={{ textDecoration: "none" }}
          >
            <div className="text-5xl mb-5">{emoji}</div>
            <h3 className="text-lg font-bold">{label}</h3>
          </Link>
        ))}
      </section>

      <div className="px-5 max-w-6xl mx-auto w-full mb-10">
        <PartnerBanner />
      </div>
    </>
  );
}
