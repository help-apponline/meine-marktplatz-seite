import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import { trackPageView, loadAdViews } from "../lib/pageviews.js";
import AdCard from "../components/AdCard.jsx";
import Flag from "icon:flag";
import Trash2 from "icon:trash-2";
import Share2 from "icon:share-2";
import StarDisplay from "../components/StarDisplay.jsx";
import FavoriteButton from "../components/FavoriteButton.jsx";
import User from "icon:user";

export default function Detail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { getAd, getOrCreateChat, loggedIn, verified, userId, deleteAd } = useAuth();
  const navigate = useNavigate();

  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [contacting, setContacting] = useState(false);
  const [reported, setReported] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [shared, setShared] = useState(false);
  const [ownerRating, setOwnerRating] = useState(null); // { avg, count }
  const [adViews, setAdViews] = useState(null);
  const [similarAds, setSimilarAds] = useState([]);

  // Seed item via query params (for demo links that have no DB id)
  const seedTitle = searchParams.get("title");
  const seedPlace = searchParams.get("place");
  const seedPrice = searchParams.get("price");
  const seedMeta = searchParams.get("meta");
  const seedDesc = searchParams.get("desc");

  useEffect(() => {
    if (!id) return;
    trackPageView(`ad:${id}`);
    getAd(id).then(a => {
      setAd(a);
      setLoading(false);
      // Load view count for this ad
      loadAdViews(id).then(v => setAdViews(v)).catch(() => {});
      // Load similar ads — same category & role, same city first, fallback to same PLZ prefix (region)
      if (a?.category && a?.role) {
        function adaptSimilar(r) {
          const photoUrls = (r.photos || []).map(f => pb.files.getURL(r, f, { thumb: "400x300" }));
          return {
            id: r.id, title: r.title, city: r.city, when: r.when_time,
            priceLabel: r.price_label || r.price || "—",
            category: r.category || "", role: r.role, status: r.status,
            ownerId: r.owner, photos: photoUrls,
            createdAt: new Date(r.created).getTime(),
            expiresAt: r.expires_at ? new Date(r.expires_at).getTime() : null,
          };
        }
        const baseFilter = `category = "${a.category}" && role = "${a.role}" && status = "offen" && id != "${id}"`;
        const cityFilter = a.city ? `${baseFilter} && city = "${a.city.replace(/"/g, '')}"` : null;
        const zipPrefix = a.zip ? a.zip.slice(0, 2) : null;
        const regionFilter = zipPrefix ? `${baseFilter} && zip ~ "${zipPrefix}"` : null;

        const tryFetch = (filter) =>
          pb.collection("ads").getList(1, 4, { filter, sort: "-created" })
            .then(res => res.items.map(adaptSimilar));

        (cityFilter ? tryFetch(cityFilter) : Promise.resolve([]))
          .then(items => {
            if (items.length >= 2) return items;
            // not enough in same city — try region (zip prefix)
            if (regionFilter) return tryFetch(regionFilter).then(regional => {
              const seen = new Set(items.map(i => i.id));
              const merged = [...items, ...regional.filter(r => !seen.has(r.id))].slice(0, 4);
              return merged;
            });
            return items;
          })
          .then(items => setSimilarAds(items.slice(0, 4)))
          .catch(() => {});
      }
      // Load owner ratings
      if (a?.owner) {
        const ownerId = typeof a.owner === "object" ? a.owner.id : a.owner;
        pb.collection("ratings").getList(1, 200, {
          filter: `ratee = "${ownerId}"`,
          sort: "-created",
        }).then(res => {
          if (res.totalItems > 0) {
            const avg = res.items.reduce((s, r) => s + (r.stars || 0), 0) / res.totalItems;
            setOwnerRating({ avg, count: res.totalItems });
          }
        }).catch(() => {});
      }
    });
  }, [id]);

  async function handleShare() {
    const title = ad?.title || seedTitle || "Anzeige";
    const url = window.location.href;
    const text = `${title} – auf der Help App`;
    if (navigator.share) {
      try { await navigator.share({ title, text, url }); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch {
        window.open(`https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`, "_blank");
      }
    }
  }

  async function handleDelete() {
    if (!ad?.id) return;
    if (!confirm("Anzeige wirklich löschen? Das kann nicht rückgängig gemacht werden.")) return;
    setDeleting(true);
    try {
      await deleteAd(ad.id);
      navigate("/anzeige");
    } catch {
      setDeleting(false);
      alert("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  async function handleReport() {
    if (!ad?.id) return;
    setReporting(true);
    try {
      await pb.collection("ads").update(ad.id, { flagged: true });
      setReported(true);
    } catch {}
    setReporting(false);
  }

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
      <div className="flex flex-wrap gap-2 mb-5 items-center">
        <span className="bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full">{priceLabel}</span>
        <span className="bg-gray-800 text-white text-xs font-semibold px-3 py-1.5 rounded-full">Status: {status}</span>
        {createdAt && <span className="bg-gray-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full">erstellt: {createdAt}</span>}
        {ownerRating && (
          <span className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 px-3 py-1.5 rounded-full">
            <StarDisplay stars={ownerRating.avg} count={ownerRating.count} size={14} />
          </span>
        )}
        {ad?.ownerId && userId && ad.ownerId === userId && adViews !== null && (
          <span className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            👁 {adViews} {adViews === 1 ? "Aufruf" : "Aufrufe"}
          </span>
        )}
      </div>
      <p className="text-gray-600 leading-relaxed max-w-2xl mb-6">{desc}</p>

      {ad?.photos?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-2xl mb-8">
          {ad.photos.map((url, i) => (
            <a key={i} href={url.replace(/\?.*/, "")} target="_blank" rel="noopener noreferrer"
              className="block aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-50 hover:opacity-90 transition-opacity">
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
            </a>
          ))}
        </div>
      )}
      <div className="flex gap-3 flex-wrap items-center">
        {ad?.id && <FavoriteButton adId={ad.id} />}
        {ad?.role === "helper" && ad?.ownerId && (
          <Link
            to={`/helfer/${ad.ownerId}`}
            className="inline-flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm"
            style={{ textDecoration: "none" }}
          >
            <User size={14} /> Helfer-Profil
          </Link>
        )}
        <button onClick={handleKontakt} disabled={contacting}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm disabled:opacity-60">
          {contacting ? "Wird geöffnet…" : "Kontakt aufnehmen"}
        </button>
        <Link to="/" className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm" style={{ textDecoration: "none" }}>
          ← Zur Übersicht
        </Link>
        <button onClick={handleShare}
          className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-gray-600 hover:border-gray-400 font-semibold rounded-xl transition-colors text-sm">
          <Share2 size={14} />
          {shared ? "Link kopiert!" : "Teilen"}
        </button>
        {/* Owner sees delete; others see report */}
        {ad?.id && userId && ad?.ownerId && ad.ownerId === userId ? (
          <button onClick={handleDelete} disabled={deleting}
            className="flex items-center gap-1.5 px-4 py-3 border border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 font-semibold rounded-xl transition-colors text-xs disabled:opacity-50 ml-auto">
            <Trash2 size={13} />
            {deleting ? "Wird gelöscht…" : "Anzeige löschen"}
          </button>
        ) : ad?.id ? (
          <button onClick={handleReport} disabled={reporting || reported}
            className="flex items-center gap-1.5 px-4 py-3 border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 font-semibold rounded-xl transition-colors text-xs disabled:opacity-50 ml-auto">
            <Flag size={13} />
            {reported ? "Gemeldet" : "Anzeige melden"}
          </button>
        ) : null}
      </div>

      {/* Similar ads */}
      {similarAds.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h3 className="text-lg font-extrabold text-gray-900 mb-4">Ähnliche Anzeigen</h3>
          <div className="flex flex-col gap-3">
            {similarAds.map(a => <AdCard key={a.id} ad={a} />)}
          </div>
        </div>
      )}
    </section>
  );
}
