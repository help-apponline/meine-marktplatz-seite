import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { pb } from "../lib/pb.js";
import { useAuth } from "../context/AuthContext.jsx";
import { categoryLabel } from "../lib/categories.js";
import StarDisplay from "../components/StarDisplay.jsx";
import AdCard from "../components/AdCard.jsx";
import ArrowLeft from "icon:arrow-left";
import MapPin from "icon:map-pin";
import MessageCircle from "icon:message-circle";

export default function HelferProfil() {
  const { userId: profileId } = useParams();
  const { loggedIn, verified, getOrCreateChat } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [ads, setAds] = useState([]);
  const [rating, setRating] = useState(null); // { avg, count }
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    async function load() {
      try {
        // Load user
        const u = await pb.collection("users").getOne(profileId, { signal: controller.signal });
        if (controller.signal.aborted) return;

        // Only show helper profiles publicly
        if (u.role !== "helper") { setNotFound(true); setLoading(false); return; }
        setUser(u);

        // Load their active ads
        const adsRes = await pb.collection("ads").getList(1, 50, {
          filter: `owner = "${profileId}" && status = "offen" && role = "helper"`,
          sort: "-created",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const adapted = adsRes.items.map(r => {
          const photoUrls = (r.photos || []).map(f => pb.files.getURL(r, f, { thumb: "400x300" }));
          return {
            id: r.id, title: r.title, city: r.city, when: r.when_time,
            priceLabel: r.price_label || r.price || "—",
            category: r.category || "", status: r.status, photos: photoUrls,
          };
        });
        setAds(adapted);

        // Load ratings
        const ratRes = await pb.collection("ratings").getList(1, 200, {
          filter: `ratee = "${profileId}"`,
          sort: "-created",
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        if (ratRes.totalItems > 0) {
          const avg = ratRes.items.reduce((s, r) => s + (r.stars || 0), 0) / ratRes.totalItems;
          setRating({ avg, count: ratRes.totalItems, items: ratRes.items });
        }

        setLoading(false);
      } catch (e) {
        if (e?.isAbort) return;
        setNotFound(true);
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [profileId]);

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
    const chatId = await getOrCreateChat("", user?.name || user?.email || "Helfer");
    setContacting(false);
    if (chatId) navigate(`/chat/${chatId}`);
  }

  if (loading) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-3xl mx-auto w-full">
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      </section>
    );
  }

  if (notFound || !user) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-3xl mx-auto w-full flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">👤</div>
        <h2 className="text-xl font-bold text-gray-900">Profil nicht gefunden</h2>
        <p className="text-gray-500 text-sm text-center">Dieses Profil existiert nicht oder ist nicht öffentlich.</p>
        <Link to="/angebote" className="text-sm text-[#ff8a00] underline">Alle Angebote ansehen</Link>
      </section>
    );
  }

  const displayName = user.name || user.email?.split("@")[0] || "Helfer";
  const initials = displayName[0].toUpperCase();
  const avatarUrl = user.avatar
    ? pb.files.getURL(user, user.avatar, { thumb: "200x200" })
    : "";

  // Collect unique categories from ads
  const cats = [...new Set(ads.map(a => a.category).filter(Boolean))].map(categoryLabel).filter(Boolean);

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-10 max-w-3xl mx-auto w-full">

      {/* Back */}
      <Link to="/angebote"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
        style={{ textDecoration: "none" }}>
        <ArrowLeft size={14} /> Zurück zu den Angeboten
      </Link>

      {/* Profile header */}
      <div className="flex items-start gap-5 mb-8 flex-wrap">
        {/* Avatar */}
        <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-100 bg-gray-900 flex items-center justify-center shrink-0 shadow-sm">
          {avatarUrl
            ? <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
            : <span className="text-white font-extrabold text-3xl">{initials}</span>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap mb-1">
            <h1 className="text-2xl font-extrabold text-gray-900">{displayName}</h1>
            <span className="text-xs bg-[#ff8a00]/10 text-[#ff8a00] font-semibold px-2.5 py-1 rounded-full border border-[#ff8a00]/20">
              Auftragnehmer
            </span>
          </div>

          {rating && (
            <div className="flex items-center gap-2 mb-2">
              <StarDisplay stars={rating.avg} count={rating.count} size={16} />
            </div>
          )}

          {cats.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {cats.map(c => (
                <span key={c.value} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                  {c.emoji} {c.label}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleKontakt}
            disabled={contacting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 mt-1"
          >
            <MessageCircle size={15} />
            {contacting ? "Wird geöffnet…" : "Kontakt aufnehmen"}
          </button>
        </div>
      </div>

      {/* Active ads */}
      <div className="mb-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-4">
          Angebote von {displayName}
        </h2>
        {ads.length === 0 ? (
          <div className="bg-gray-50 rounded-xl px-5 py-6 text-gray-500 text-sm">
            Dieser Helfer hat aktuell keine aktiven Angebote.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {ads.map(ad => <AdCard key={ad.id} ad={ad} />)}
          </div>
        )}
      </div>

      {/* Ratings */}
      {rating && rating.items?.length > 0 && (
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 mb-4">
            Bewertungen ({rating.count})
          </h2>
          <div className="flex flex-col gap-3">
            {rating.items.slice(0, 10).map(r => (
              <div key={r.id} className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4">
                <div className="flex items-center gap-2 mb-1">
                  <StarDisplay stars={r.stars} size={14} />
                  <span className="text-xs text-gray-400">
                    {new Date(r.created).toLocaleDateString("de-DE")}
                  </span>
                </div>
                {r.comment && (
                  <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
