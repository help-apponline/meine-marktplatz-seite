import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useFavoritesContext } from "../context/FavoritesContext.jsx";
import { categoryLabel } from "../lib/categories.js";
import FavoriteButton from "../components/FavoriteButton.jsx";
import { pb } from "../lib/pb.js";

export default function Merkliste() {
  const ctx = useFavoritesContext();
  const isLoggedIn = pb.authStore.isValid;
  const [ads, setAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(false);

  // Whenever favoriteRecords changes, fetch the expanded ad data
  useEffect(() => {
    if (!ctx || !isLoggedIn) return;
    if (ctx.loading) return;

    const favRecs = ctx.favoriteRecords;
    if (favRecs.length === 0) { setAds([]); return; }

    setLoadingAds(true);
    const ids = favRecs.map(r => r.ad).filter(Boolean);
    if (ids.length === 0) { setAds([]); setLoadingAds(false); return; }

    const filterStr = ids.map(id => `id = "${id}"`).join(" || ");
    pb.collection("ads").getList(1, 200, { filter: filterStr, sort: "-created" })
      .then(result => {
        const adapted = result.items.map(r => {
          const photoUrls = (r.photos || []).map(f => pb.files.getURL(r, f, { thumb: "400x300" }));
          return {
            id: r.id,
            title: r.title,
            city: r.city,
            when: r.when_time,
            priceLabel: r.price_label || r.price || "—",
            category: r.category || "",
            status: r.status,
            photos: photoUrls,
          };
        });
        setAds(adapted);
      })
      .catch(() => {})
      .finally(() => setLoadingAds(false));
  }, [ctx?.favoriteRecords, ctx?.loading, isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-3xl mx-auto w-full flex flex-col items-center justify-center gap-4">
        <div className="text-5xl">♡</div>
        <h2 className="text-2xl font-extrabold text-gray-900">Deine Merkliste</h2>
        <p className="text-gray-500 text-sm text-center max-w-xs">
          Melde dich an, um interessante Anzeigen zu speichern und hier wiederzufinden.
        </p>
        <button
          onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um deine Merkliste zu sehen.")}
          className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm"
        >
          Anmelden
        </button>
      </section>
    );
  }

  const isLoading = ctx?.loading || loadingAds;

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-3xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">♥</span>
        <h2 className="text-3xl font-extrabold text-gray-900">Merkliste</h2>
      </div>
      <p className="text-gray-500 text-base mb-8 leading-relaxed">
        Anzeigen, die du gespeichert hast — immer griffbereit.
      </p>

      {isLoading ? (
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      ) : ads.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <span className="text-6xl text-gray-200">♡</span>
          <p className="text-gray-500 text-sm max-w-xs">
            Noch nichts gespeichert. Klicke auf das Herz-Symbol bei einer Anzeige, um sie hier zu merken.
          </p>
          <div className="flex gap-3 flex-wrap justify-center mt-2">
            <Link to="/angebote"
              className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors"
              style={{ textDecoration: "none" }}>
              Angebote entdecken
            </Link>
            <Link to="/gesuche"
              className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              style={{ textDecoration: "none" }}>
              Gesuche entdecken
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ads.map(ad => {
            const thumb = ad.photos?.[0];
            const cat = ad.category ? categoryLabel(ad.category) : null;
            return (
              <div key={ad.id} className="group relative bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <Link
                  to={`/detail/${ad.id}`}
                  className="flex items-center gap-4 px-5 py-4"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {thumb && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <img src={thumb} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{ad.title}</div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <span className="text-sm text-gray-500">{ad.city || "—"} · {ad.when || "—"}</span>
                      {cat && (
                        <span className="text-xs px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-full font-medium">
                          {cat.emoji} {cat.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="bg-[#2b2b2b] text-white text-xs font-semibold px-3 py-1.5 rounded-full hidden sm:block">
                      {ad.priceLabel}
                    </span>
                  </div>
                </Link>
                {/* Favorite toggle — remove from list */}
                <div className="absolute top-3 right-3">
                  <FavoriteButton adId={ad.id} size="sm" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
