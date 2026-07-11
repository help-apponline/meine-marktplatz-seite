import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Inbox() {
  const { loggedIn, userEmail, loadChats } = useAuth();

  if (!loggedIn) {
    return (
      <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Meine Chats</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-amber-800 text-sm">
          Bitte <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um deine Chats zu sehen.")} className="underline font-semibold bg-transparent border-none p-0 cursor-pointer text-amber-800">anmelden</button>, um deine Chats zu sehen.
        </div>
      </section>
    );
  }

  const chats = Object.values(loadChats()).filter(c => (c.participants || []).includes(userEmail));
  const sorted = [...chats].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Meine Chats</h2>
      <p className="text-gray-500 text-base mb-8">Alle laufenden Unterhaltungen zu deinen Anzeigen.</p>

      {sorted.length === 0 ? (
        <div className="bg-gray-50 rounded-xl px-5 py-6 text-gray-500 text-sm">
          Noch keine Chats. Sobald du Kontakt aufnimmst, erscheint hier ein Chat.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map(c => {
            const last = (c.messages || []).slice(-1)[0];
            return (
              <Link key={c.id} to={`/chat/${c.id}`}
                className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:shadow hover:-translate-y-0.5 transition-all"
                style={{ textDecoration: "none", color: "inherit" }}>
                <div>
                  <div className="font-bold text-gray-900">Chat zu: {c.adTitle || "Anzeige"}</div>
                  <div className="text-sm text-gray-500 mt-0.5">
                    Letzte Nachricht: {last ? new Date(last.ts || last.at).toLocaleString("de-DE") : "—"}
                  </div>
                </div>
                <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
                  {(c.messages || []).length}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
