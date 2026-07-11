import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";

const INTERVAL = 10000; // 10 seconds per slide

// Fixed partners — always in the rotation, not visible in any list or admin view
const FIXED_PARTNERS = [
  {
    id: "__kiddy_smile__",
    title: "Kiddy-Smile",
    text: "Liebevolle Kinderbetreuung und pädagogische Förderung — für glückliche Kinder und entspannte Eltern.",
    website: "",
    logo: "",
  },
];

// Promotional slot shown when no paid partners are booked
const PROMO_PARTNER = {
  id: "__helpapp_promo__",
  title: "Hier könnte Ihre Werbung stehen",
  text: "Erreichen Sie täglich neue Kunden in Ihrer Region. Jetzt Werbepartner werden und sichtbar sein.",
  website: "",
  logo: "",
  isPromo: true,
};

function loadLocalPartners() {
  try {
    const v2 = JSON.parse(localStorage.getItem("helpapp_partners_v2") || "[]");
    return Array.isArray(v2) ? v2 : [];
  } catch { return []; }
}

function normalizePartner(p) {
  if (!p || typeof p !== "object") return null;
  const title = (p.title || "").trim();
  const text = (p.text || "").trim();
  const website = (p.website || p.website_url || "").trim();
  const logo = (p.logoDataUrl || p.logo_data_url || "").trim();
  const status = (p.status || "").toLowerCase();
  if (p.paused) return null;
  if (status && status !== "active") return null;
  if (!title && !text && !logo) return null;
  return { id: p.id || title, title, text, website, logo };
}

export default function PartnerBanner() {
  const [partners, setPartners] = useState([]);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  const loadAll = useCallback(() => {
    const real = loadLocalPartners().map(normalizePartner).filter(Boolean);
    // Order: 1. Kiddy-Smile (always), 2. "Hier Werben" (always), 3. real paid partners
    setPartners([...FIXED_PARTNERS, PROMO_PARTNER, ...real]);
  }, []);

  useEffect(() => {
    loadAll();
  }, []);

  // Rotate every 10 seconds
  useEffect(() => {
    if (partners.length <= 1) return;
    const t = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx(i => (i + 1) % partners.length);
        setFade(true);
      }, 300);
    }, INTERVAL);
    return () => clearInterval(t);
  }, [partners.length]);

  if (!partners.length) return null;

  const p = partners[idx % partners.length];
  const isPromo = !!p.isPromo;

  const inner = (
    <div
      className="flex items-center gap-4"
      style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {p.logo ? (
        <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={p.logo} alt={p.title} className="w-full h-full object-cover" />
        </div>
      ) : isPromo ? (
        <div className="w-10 h-10 rounded-lg bg-[#ff8a00]/10 flex items-center justify-center shrink-0 text-lg">📢</div>
      ) : (
        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-lg">🤝</div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 truncate">{p.title}</div>
        {p.text && <div className="text-sm text-gray-500 leading-snug line-clamp-2 mt-0.5">{p.text}</div>}
        <div className="text-xs text-[#ff8a00] mt-1 font-medium">
          {isPromo ? "Jetzt Werbepartner werden →" : "Mehr erfahren →"}
        </div>
      </div>
      {/* Dot indicators */}
      {partners.length > 1 && (
        <div className="flex gap-1 shrink-0">
          {partners.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setFade(false);
                setTimeout(() => { setIdx(i); setFade(true); }, 200);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx % partners.length ? "bg-[#ff8a00]" : "bg-gray-200"}`}
              aria-label={`Eintrag ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  // Promo card links to werbepartner page
  if (isPromo) {
    return (
      <Link
        to="/werbepartner"
        className="block w-full bg-gradient-to-r from-gray-50 to-orange-50 border border-orange-100 rounded-xl p-4 hover:shadow-sm transition-shadow"
        style={{ textDecoration: "none" }}
      >
        {inner}
      </Link>
    );
  }

  // Real partner or Kiddy-Smile → internal profile page (or just display if no real id)
  if (p.id && !p.id.startsWith("__")) {
    return (
      <button
        type="button"
        onClick={() => navigate(`/partner/${p.id}`)}
        className="w-full text-left bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer"
      >
        {inner}
      </button>
    );
  }

  // Kiddy-Smile demo (no profile page yet) — non-clickable display
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {inner}
    </div>
  );
}
