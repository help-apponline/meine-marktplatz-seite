import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { loadAds, loadChats, saveChats, loggedIn, userEmail, uid } = useAuth();
  const navigate = useNavigate();

  let ad = null;
  if (id) {
    ad = loadAds().find(a => a.id === id) || null;
  }

  // Seed item via query params
  const seedTitle = searchParams.get("title");
  const seedPlace = searchParams.get("place");
  const seedPrice = searchParams.get("price");
  const seedMeta = searchParams.get("meta");
  const seedDesc = searchParams.get("desc");

  function handleKontakt() {
    if (!loggedIn) {
      if (window.__helpAppRequireLogin) window.__helpAppRequireLogin("Bitte anmelden, um Kontakt aufzunehmen.");
      return;
    }
    const chats = loadChats();
    const chatId = "c_" + (ad ? ad.id : (seedTitle || "x"));
    if (!chats[chatId]) {
      chats[chatId] = {
        id: chatId,
        adId: ad ? ad.id : "",
        adTitle: ad ? ad.title : (seedTitle || "Anzeige"),
        participants: [userEmail],
        messages: [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
    } else if (!(chats[chatId].participants || []).includes(userEmail)) {
      chats[chatId].participants.push(userEmail);
    }
    saveChats(chats);
    navigate(`/chat/${chatId}`);
  }

  if (ad) {
    return (
      <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{ad.title}</h2>
        <p className="text-gray-500 mb-5">{ad.city || "—"} · {ad.when || "—"}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{ad.priceLabel || "—"}</span>
          <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Status: {ad.status || "offen"}</span>
          <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">erstellt: {new Date(ad.createdAt).toLocaleDateString("de-DE")}</span>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">{ad.desc || "Keine Beschreibung vorhanden."}</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleKontakt} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm">
            Kontakt aufnehmen
          </button>
          <Link to="/" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ textDecoration: "none" }}>
            ← Zur Übersicht
          </Link>
        </div>
      </section>
    );
  }

  if (seedTitle) {
    return (
      <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{seedTitle}</h2>
        <p className="text-gray-500 mb-5">{seedPlace || "—"} · {seedMeta || "—"}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{seedPrice || "—"}</span>
          <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Status: offen</span>
        </div>
        <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">{seedDesc || "Keine Beschreibung vorhanden."}</p>
        <div className="flex gap-3 flex-wrap">
          <button onClick={handleKontakt} className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm">
            Kontakt aufnehmen
          </button>
          <Link to="/" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ textDecoration: "none" }}>
            ← Zur Übersicht
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Anzeige nicht gefunden</h2>
      <Link to="/" className="text-gray-600 hover:text-gray-900 underline text-sm">← Zur Startseite</Link>
    </section>
  );
}
