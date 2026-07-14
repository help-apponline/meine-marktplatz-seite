import { Link } from "react-router";
import { categoryLabel } from "../lib/categories.js";
import FavoriteButton from "./FavoriteButton.jsx";

export default function AdCard({ ad, seedItem }) {
  if (ad) {
    const thumb = ad.photos?.[0];
    const cat = ad.category ? categoryLabel(ad.category) : null;
    return (
      <Link
        to={`/detail/${ad.id}`}
        className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:-translate-y-0.5 hover:shadow transition-all"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {thumb && (
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
              <img src={thumb} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-bold text-gray-900 truncate">{ad.title}</div>
            <div className="flex items-center gap-2 flex-wrap mt-0.5">
              <span className="text-sm text-gray-500">{ad.city} · {ad.when || "—"}</span>
              {cat && (
                <span className="text-xs px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-700 rounded-full font-medium">
                  {cat.emoji} {cat.label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-[#2b2b2b] text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {ad.priceLabel || ad.price || "—"}
          </span>
          <FavoriteButton adId={ad.id} size="sm" />
        </div>
      </Link>
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
