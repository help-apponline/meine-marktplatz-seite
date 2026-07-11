import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { loggedIn, userEmail, userRole, loadMyAds, loadChats } = useAuth();
  const [ads, setAds] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    Promise.all([loadMyAds(), loadChats()])
      .then(([a, c]) => { setAds(a); setChats(c); setLoading(false); })
      .catch(() => setLoading(false));
  }, [loggedIn]);

  const recentAds = [...ads].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 4);

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Übersicht</h2>
      <p className="text-gray-500 text-base mb-8">Deine wichtigsten Infos auf einen Blick.</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Status", value: loggedIn ? "Angemeldet" : "Gast", sub: loggedIn ? userEmail : "" },
          { label: "Meine Anzeigen", value: ads.length, sub: "veröffentlicht" },
          { label: "Meine Chats", value: chats.length, sub: "Unterhaltungen" },
        ].map(({ label, value, sub }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-5 py-5 flex justify-between items-center gap-4 border border-gray-100">
            <div>
              <div className="font-bold text-gray-900">{label}</div>
              {sub && <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[180px]">{sub}</div>}
            </div>
            <span className="bg-gray-900 text-white text-sm font-bold px-3 py-1.5 rounded-full shrink-0">{value}</span>
          </div>
        ))}
      </div>

      <h3 className="font-bold text-gray-800 mb-3">Letzte Aktivitäten</h3>

      {!loggedIn ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
          Bitte{" "}
          <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden.")}
            className="underline font-semibold bg-transparent border-none p-0 cursor-pointer text-amber-800">
            anmelden
          </button>
          , um deine Aktivitäten zu sehen.
        </div>
      ) : loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : recentAds.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-5 py-5 text-gray-500 text-sm">
          Noch keine Aktivitäten.{" "}
          <Link to="/anzeige" className="text-gray-700 underline">Erstelle jetzt eine Anzeige</Link>.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {recentAds.map(ad => (
            <Link key={ad.id} to={`/detail/${ad.id}`}
              className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:shadow hover:-translate-y-0.5 transition-all"
              style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <div className="font-bold text-gray-900">{ad.title}</div>
                <div className="text-sm text-gray-500 mt-0.5">{ad.city} · {new Date(ad.updatedAt).toLocaleDateString("de-DE")}</div>
              </div>
              <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">{ad.status}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
