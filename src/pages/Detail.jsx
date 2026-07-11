import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { getAd, getOrCreateChat, loggedIn, verified } = useAuth();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [contacting, setContacting] = useState(false);

  // Seed item via query params (for demo links that have no DB id)
  const seedTitle = searchParams.get("title");
  const seedPlace = searchParams.get("place");
  const seedPrice = searchParams.get("price");
  const seedMeta = searchParams.get("meta");
  const seedDesc = searchParams.get("desc");

  useEffect(() => {
    if (!id) return;
    getAd(id).then(a => { setAd(a); setLoading(false); });
  }, [id]);

  async function handleKontakt() {
    if (!loggedIn) {
      window.__helpAppRequireLogin?.("Bitte anmelden, um Kontakt aufzunehmen.");
      return;
    }
    if (!verified) {
      window.__helpAppRequireLogin?.("Bitte bestätige zuerst deine E-Mail-Adresse, um Kontakt aufnehmen zu können.");
      return;
    }
    setContacting(true);
    const adId = ad?.id || "";
    const adTitle = ad?.title || seedTitle || "Anzeige";
    const chatId = await getOrCreateChat(adId, adTitle);
    setContacting(false);
    if (chatId) navigate(`/chat/${chatId}`);
  }

  if (loading) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      </section>
    );
  }

  const title = ad?.title || seedTitle;
  const meta = ad ? `${ad.city || "—"} · ${ad.when || "—"}` : `${seedPlace || "—"} · ${seedMeta || "—"}`;
  const priceLabel = ad?.priceLabel || seedPrice || "—";
  const desc = ad?.desc || seedDesc || "Keine Beschreibung vorhanden.";
  const status = ad?.status || "offen";
  const createdAt = ad?.createdAt ? new Date(ad.createdAt).toLocaleDateString("de-DE") : null;

  if (!title) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Anzeige nicht gefunden</h2>
        <Link to="/" className="text-gray-600 hover:text-gray-900 underline text-sm">← Zur Startseite</Link>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 mb-5">{meta}</p>
      <div className="flex flex-wrap gap-2 mb-5">
        <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{priceLabel}</span>
        <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Status: {status}</span>
        {createdAt && <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">erstellt: {createdAt}</span>}
      </div>
      <p className="text-gray-600 leading-relaxed max-w-2xl mb-8">{desc}</p>
      <div className="flex gap-3 flex-wrap">
        <button onClick={handleKontakt} disabled={contacting}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm disabled:opacity-60">
          {contacting ? "Wird geöffnet…" : "Kontakt aufnehmen"}
        </button>
        <Link to="/" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ textDecoration: "none" }}>
          ← Zur Übersicht
        </Link>
      </div>
    </section>
  );
}
