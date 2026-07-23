import { useState } from "react";
import { Link, useNavigate } from "react-router";
import PartnerBanner from "../components/PartnerBanner.jsx";
import Search from "icon:search";
import Share2 from "icon:share-2";
import Mail from "icon:mail";
import X from "icon:x";

export default function Home() {
  const [searchInput, setSearchInput] = useState("");
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const shareUrl = "https://www.help-app.online";
  const shareText = "Finde Hilfe oder werde Helfer in deiner Nähe – kostenlos auf help-app.online!";

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title: "help-app.online", text: shareText, url: shareUrl });
    } else {
      setShareOpen(v => !v);
    }
  }

  function copyLink() {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleSearch(e) {
    e.preventDefault();
    const q = searchInput.trim();
    if (!q) return;
    // Navigate to Angebote with city pre-filled via query string
    navigate(`/suche?q=${encodeURIComponent(q)}`);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-white text-center px-6 pt-0 pb-10">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/static/logo.jpg"
            alt="help-app.online"
            className="h-60 md:h-72 w-auto object-contain mb-3"
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Finde Hilfe. Werde Helfer.
          </h1>
        </div>
        <p className="text-lg text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
          help-app.online verbindet Menschen, die Unterstützung suchen, mit Helfern aus der Nähe – schnell und unkompliziert.
        </p>

        {/* Quick search */}
        <form onSubmit={handleSearch} className="flex gap-0 max-w-sm mx-auto rounded-xl overflow-hidden border border-gray-200 shadow-sm focus-within:border-gray-400 transition-colors">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Stichwort, Ort oder PLZ…"
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

      {/* Weiterempfehlen */}
      <section className="px-5 max-w-6xl mx-auto w-full mb-6">
        <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 text-base">help-app.online weiterempfehlen</p>
            <p className="text-sm text-gray-500 mt-0.5">Teile die Plattform mit Freunden, Familie oder Bekannten.</p>
          </div>
          <div className="relative flex gap-2 flex-wrap justify-center sm:justify-end">
            {/* Mobil: natives Teilen */}
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-2 px-4 py-2 bg-[#ff8a00] text-white font-semibold text-sm rounded-xl hover:bg-[#e67a00] transition-colors"
            >
              <Share2 size={15} /> Teilen
            </button>

            {/* Desktop: Menü aufklappen */}
            <button
              onClick={() => setShareOpen(v => !v)}
              className="sm:hidden hidden items-center gap-2 px-4 py-2 bg-[#ff8a00] text-white font-semibold text-sm rounded-xl hover:bg-[#e67a00] transition-colors"
            >
              Weitere
            </button>

            {/* Direktlinks immer sichtbar auf Desktop */}
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white font-semibold text-sm rounded-xl hover:bg-green-600 transition-colors"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
            <a
              href={`mailto:?subject=${encodeURIComponent("Schau mal: help-app.online")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Mail size={14} /> E-Mail
            </a>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 font-semibold text-sm rounded-xl hover:bg-gray-50 transition-colors"
            >
              {copied ? "✓ Kopiert!" : "Link kopieren"}
            </button>
          </div>
        </div>
      </section>

      <div className="px-5 max-w-6xl mx-auto w-full mb-10">
        <PartnerBanner />
      </div>
    </>
  );
}
