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
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-xl shadow-2xl px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-start gap-2 flex-1">
          <Shield size={16} className="text-[#ff8a00] shrink-0 mt-0.5" />
          <p className="text-xs text-gray-300 leading-relaxed">
            Wir verwenden notwendige Cookies und — mit deiner Zustimmung — Besucher-Statistiken.{" "}
            <Link to="/datenschutz" className="text-[#ff8a00] underline underline-offset-2 hover:text-orange-400 transition-colors">
              Mehr erfahren
            </Link>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
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
    </div>
  );
}
