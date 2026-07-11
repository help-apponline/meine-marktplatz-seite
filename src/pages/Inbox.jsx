import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Inbox() {
  const { loggedIn, loadChats } = useAuth();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loggedIn) return;
    setLoading(true);
    loadChats().then(c => { setChats(c); setLoading(false); }).catch(() => setLoading(false));
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Meine Chats</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
          Bitte{" "}
          <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um deine Chats zu sehen.")}
            className="underline font-semibold bg-transparent border-none p-0 cursor-pointer text-amber-800">
            anmelden
          </button>
          , um deine Chats zu sehen.
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Meine Chats</h2>
      <p className="text-gray-500 text-base mb-8">Alle laufenden Unterhaltungen zu deinen Anzeigen.</p>

      {loading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : chats.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-5 py-6 text-gray-500 text-sm">
          Noch keine Chats. Sobald du Kontakt aufnimmst, erscheint hier ein Chat.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {chats.map(c => (
            <Link key={c.id} to={`/chat/${c.id}`}
              className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:shadow hover:-translate-y-0.5 transition-all"
              style={{ textDecoration: "none", color: "inherit" }}>
              <div>
                <div className="font-bold text-gray-900">Chat zu: {c.ad_title || "Anzeige"}</div>
                <div className="text-sm text-gray-500 mt-0.5">
                  Zuletzt: {c.updated ? new Date(c.updated).toLocaleString("de-DE") : "—"}
                </div>
              </div>
              <span className="text-xs text-gray-400 shrink-0">→</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
