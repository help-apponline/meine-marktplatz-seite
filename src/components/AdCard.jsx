import { Link } from "react-router";

export default function AdCard({ ad, seedItem }) {
  if (ad) {
    return (
      <Link
        to={`/detail/${ad.id}`}
        className="bg-gray-50 rounded-xl px-5 py-4 flex justify-between items-center gap-4 hover:-translate-y-0.5 hover:shadow transition-all"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div>
          <div className="font-bold text-gray-900">{ad.title}</div>
          <div className="text-sm text-gray-500 mt-0.5">{ad.city} · {ad.when || "—"}</div>
        </div>
        <span className="bg-[#2b2b2b] text-white text-xs font-semibold px-3 py-1.5 rounded-full shrink-0">
          {ad.priceLabel || ad.price || "—"}
        </span>
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
