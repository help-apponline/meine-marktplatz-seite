import { useState } from "react";
import { useFavoritesContext } from "../context/FavoritesContext.jsx";

export default function FavoriteButton({ adId, size = "md", className = "" }) {
  const ctx = useFavoritesContext();
  const [busy, setBusy] = useState(false);

  if (!ctx) return null;
  const { favoriteIds, toggle } = ctx;
  const isFav = favoriteIds.has(adId);

  const sizeClasses = size === "sm"
    ? "w-8 h-8 text-[18px]"
    : "w-10 h-10 text-[22px]";

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (busy) return;
    if (!window.__pb_is_valid?.()) {
      window.__helpAppRequireLogin?.("Bitte anmelden, um Anzeigen zu speichern.");
      return;
    }
    setBusy(true);
    await toggle(adId);
    setBusy(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label={isFav ? "Aus Merkliste entfernen" : "Zur Merkliste hinzufügen"}
      title={isFav ? "Aus Merkliste entfernen" : "Merken"}
      className={`flex items-center justify-center rounded-full transition-all ${sizeClasses} ${
        isFav
          ? "text-[#ff8a00] bg-orange-50 border border-orange-200 hover:bg-orange-100"
          : "text-gray-400 bg-white border border-gray-200 hover:text-[#ff8a00] hover:border-orange-200"
      } disabled:opacity-50 ${className}`}
    >
      <span style={{ lineHeight: 1 }}>
        {isFav ? "♥" : "♡"}
      </span>
    </button>
  );
}
