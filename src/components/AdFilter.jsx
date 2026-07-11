import Search from "icon:search";
import X from "icon:x";

export default function AdFilter({ query, setQuery, city, setCity, maxPrice, setMaxPrice, onReset }) {
  const hasFilters = query || city || maxPrice;

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 mb-8 flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Stichwort suchen…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 transition-colors bg-white"
        />
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
        <div className="relative">
          <input
            type="number"
            placeholder="Max. Preis (€)"
            value={maxPrice}
            min={0}
            onChange={e => setMaxPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:border-gray-700 transition-colors bg-white"
          />
        </div>
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
