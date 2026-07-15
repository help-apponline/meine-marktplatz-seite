import Search from "icon:search";
import X from "icon:x";
import { CATEGORIES } from "../lib/categories.js";

export default function AdFilter({ query, setQuery, city, setCity, maxPrice, setMaxPrice, category, setCategory, onReset }) {
  const hasFilters = query || city || maxPrice || category;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 flex flex-col gap-3">
      {/* Search */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Stichwort suchen…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && e.currentTarget.blur()}
            className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 transition-colors bg-white"
          />
        </div>
        <button
          type="button"
          onClick={() => {}}
          className="flex items-center gap-1.5 px-4 py-3 bg-[#ff8a00] text-white font-semibold rounded-xl text-sm hover:bg-[#e67a00] transition-colors shrink-0"
        >
          <Search size={14} /> Suchen
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* City filter */}
        <input
          type="text"
          placeholder="Ort / PLZ filtern…"
          value={city}
          onChange={e => setCity(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 transition-colors bg-white"
        />

        {/* Max price */}
        <input
          type="number"
          placeholder="Max. Preis (€)"
          value={maxPrice}
          min={0}
          onChange={e => setMaxPrice(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 transition-colors bg-white"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            type="button"
            onClick={() => setCategory(category === c.value ? "" : c.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
              category === c.value
                ? "bg-gray-900 text-white border-gray-900"
                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}
          >
            <span>{c.emoji}</span>
            {c.label}
          </button>
        ))}
      </div>

      {hasFilters && (
        <button
          onClick={onReset}
          className="self-start flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
        >
          <X size={12} /> Filter zurücksetzen
        </button>
      )}
    </div>
  );
}
