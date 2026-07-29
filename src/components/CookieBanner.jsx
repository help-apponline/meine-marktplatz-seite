import { useState, useEffect } from "react";
import { Link } from "react-router";
import Shield from "icon:shield";
import ChevronDown from "icon:chevron-down";
import ChevronUp from "icon:chevron-up";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [statistics, setStatistics] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  function acceptAll() {
    localStorage.setItem("cookie_statistics", "1");
    localStorage.setItem("cookie_marketing", "1");
    setVisible(false);
  }

  function acceptSelected() {
    localStorage.setItem("cookie_statistics", statistics ? "1" : "0");
    localStorage.setItem("cookie_marketing", "0");
    setVisible(false);
  }

  function acceptNecessary() {
    localStorage.setItem("cookie_statistics", "0");
    localStorage.setItem("cookie_marketing", "0");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4"
      style={{ animation: "slideUp 0.4s ease-out" }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-xl shadow-2xl px-4 py-3">

        {/* Hauptzeile */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-start gap-2 flex-1">
            <Shield size={16} className="text-[#ff8a00] shrink-0 mt-0.5" />
            <p className="text-xs text-gray-300 leading-relaxed">
              Wir verwenden notwendige Cookies und — mit deiner Zustimmung — Besucher-Statistiken (z. B. Google Analytics, geplant).{" "}
              <Link to="/datenschutz" className="text-[#ff8a00] underline underline-offset-2 hover:text-orange-400 transition-colors">
                Mehr erfahren
              </Link>
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Auswählen
              {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            <button
              onClick={acceptNecessary}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Nur notwendige
            </button>
            <button
              onClick={acceptAll}
              className="px-3 py-1.5 bg-[#ff8a00] hover:bg-[#e67a00] text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>

        {/* Ausklappbare Auswahl */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-3">Wähle aus, welche Cookies du erlaubst:</p>
            <div className="space-y-2 mb-3">

              {/* Notwendige — immer an */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-4 bg-[#ff8a00] rounded-full flex items-center justify-end px-0.5 mt-0.5 shrink-0">
                  <div className="w-3 h-3 bg-white rounded-full" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Notwendige Cookies</p>
                  <p className="text-xs text-gray-400">Für den Betrieb der Plattform erforderlich — können nicht deaktiviert werden.</p>
                </div>
              </div>

              {/* Statistiken */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => setStatistics(!statistics)}
                  className={`w-8 h-4 rounded-full flex items-center px-0.5 mt-0.5 shrink-0 transition-colors ${statistics ? "bg-[#ff8a00] justify-end" : "bg-gray-600 justify-start"}`}
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                </button>
                <div>
                  <p className="text-xs font-semibold text-white">Besucher-Statistiken <span className="text-gray-500 font-normal">(geplant)</span></p>
                  <p className="text-xs text-gray-400">Hilft uns zu verstehen, wie die Seite genutzt wird — z. B. über Google Analytics. Noch nicht aktiv, aber bereits vorgemerkt.</p>
                </div>
              </div>

            </div>
            <button
              onClick={acceptSelected}
              className="px-4 py-1.5 bg-[#ff8a00] hover:bg-[#e67a00] text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Auswahl speichern
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
