import { useState, useEffect } from "react";
import { Link } from "react-router";
import Shield from "icon:shield";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie_accepted");
    if (!accepted) {
      // Small delay so it slides in after page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  function accept() {
    localStorage.setItem("cookie_accepted", "1");
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
      <div className="max-w-4xl mx-auto bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Shield size={20} className="text-[#ff8a00] shrink-0 mt-0.5" />
          <p className="text-sm text-gray-200 leading-relaxed">
            help-app.online verwendet technisch notwendige Cookies, um die Plattform sicher und funktionsfähig bereitzustellen.{" "}
            <Link to="/datenschutz" className="text-[#ff8a00] underline underline-offset-2 hover:text-orange-400 transition-colors">
              Mehr erfahren
            </Link>
          </p>
        </div>
        <button
          onClick={accept}
          className="shrink-0 px-5 py-2 bg-[#ff8a00] hover:bg-[#e67a00] text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap"
        >
          Einwilligen
        </button>
      </div>
    </div>
  );
}
