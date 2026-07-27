import { useState, useEffect } from "react";
import { Link } from "react-router";
import Shield from "icon:shield";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  function acceptAll() {
    // Statistik-Cookies akzeptiert — hier später Google Analytics aktivieren
    localStorage.setItem("cookie_statistics", "1");
    setVisible(false);
  }

  function acceptNecessary() {
    // Nur notwendige Cookies
    localStorage.setItem("cookie_statistics", "0");
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
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-5 flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <Shield size={20} className="text-[#ff8a00] shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-white mb-1">Deine Privatsphäre</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              help-app.online verwendet technisch notwendige Cookies für den Betrieb der Plattform. Mit deiner Zustimmung nutzen wir zusätzlich Besucher-Statistiken, um die Seite zu verbessern.{" "}
              <Link to="/datenschutz" className="text-[#ff8a00] underline underline-offset-2 hover:text-orange-400 transition-colors">
                Datenschutzerklärung
              </Link>
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end">
          <button
            onClick={acceptNecessary}
            className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
          >
            Nur notwendige
          </button>
          <button
            onClick={acceptAll}
            className="px-5 py-2 bg-[#ff8a00] hover:bg-[#e67a00] text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
          >
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
