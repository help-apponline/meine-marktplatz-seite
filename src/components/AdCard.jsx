import { Link } from "react-router";
import { categoryLabel } from "../lib/categories.js";
import FavoriteButton from "./FavoriteButton.jsx";
import User from "icon:user";

export default function AdCard({ ad, seedItem }) {
  if (ad) {
    const thumb = ad.photos?.[0];
    const cat = ad.category ? categoryLabel(ad.category) : null;
    const isNew = ad.createdAt && (Date.now() - ad.createdAt) < 48 * 60 * 60 * 1000;
    const now = Date.now();
    const daysLeft = ad.expiresAt ? Math.ceil((ad.expiresAt - now) / (1000 * 60 * 60 * 24)) : null;
    const expiringSoon = daysLeft !== null && daysLeft <= 7 && daysLeft > 0;
    const expired = daysLeft !== null && daysLeft <= 0;

    return (
      <div className={`bg-gray-50 rounded-xl border hover:shadow-sm transition-all ${expired ? "opacity-60 border-gray-200" : "border-gray-100 hover:border-gray-200"}`}>
        <Link
          to={`/detail/${ad.id}`}
          className="flex items-center gap-4 px-5 py-4"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          {thumb && (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <span className="font-bold text-gray-900 truncate">{ad.title}</span>
              {isNew && (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 bg-[#ff8a00] text-white rounded-full uppercase tracking-wide shrink-0">
                  Neu
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className="text-sm text-gray-500">{ad.city} · {ad.when || "—"}</span>
              {cat && (
                <span className="text-xs px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-full font-medium">
                  {cat.emoji} {cat.label}
                </span>
              )}
              {ad.nutzertyp === "gewerblich" && (
                <span className="text-xs px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 rounded-full font-medium">🏢 Gewerblich</span>
              )}
              {ad.nutzertyp === "privat" && (
                <span className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-200 text-gray-500 rounded-full font-medium">👤 Privat</span>
              )}
              {expiringSoon && (
                <span className="text-xs text-amber-600 font-medium">⏳ läuft in {daysLeft} Tag{daysLeft === 1 ? "" : "en"} ab</span>
              )}
              {expired && (
                <span className="text-xs text-gray-400 font-medium">abgelaufen</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="bg-[#2b2b2b] text-white text-xs font-semibold px-3 py-1.5 rounded-full hidden sm:block">
              {ad.priceLabel || ad.price || "—"}
            </span>
            <FavoriteButton adId={ad.id} size="sm" />
          </div>
        </Link>
        {/* Helper profile link */}
        {ad.role === "helper" && ad.ownerId && (
          <div className="border-t border-gray-100 px-5 py-2">
            <Link
              to={`/helfer/${ad.ownerId}`}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-[#ff8a00] transition-colors font-medium"
              style={{ textDecoration: "none" }}
              onClick={e => e.stopPropagation()}
            >
              <User size={11} /> Helfer-Profil ansehen
            </Link>
          </div>
        )}
      </div>
    );
  }

  if (seedItem) {
    const params = new URLSearchParams({
      title: seedItem.title,
      place: seedItem.place,
      price: seedItem.price,
      meta: seedItem.meta,
      desc: seedItem.desc || "",
    });
    return (
      <Link
        to={`/detail?${params.toString()}`}
        className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:-translate-y-0.5 hover:shadow transition-all"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div>
          <div className="font-bold text-gray-900">{seedItem.title}</div>
          <div className="text-sm text-gray-500 mt-0.5">{seedItem.place} · {seedItem.meta}</div>
        </div>
        <span className="bg-[#2b2b2b] text-white text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
          {seedItem.price}
        </span>
      </Link>
    );
  }

  return null;
}
