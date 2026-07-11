import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";

const INTERVAL = 10000; // 10 seconds

// Placeholder shown when no partners are booked
function Placeholder() {
  return (
    <Link to="/werbepartner" style={{ textDecoration: "none" }}>
      <div className="bg-gradient-to-r from-gray-50 to-orange-50 border border-orange-100 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#ff8a00]/10 flex items-center justify-center shrink-0 text-lg">📢</div>
          <div>
            <div className="font-semibold text-gray-700 text-sm">Hier könnte Ihre Werbung stehen</div>
            <div className="text-xs text-gray-500 mt-0.5">Mehr Informationen finden Sie in unserem Werbepartner-Bereich</div>
          </div>
        </div>
        <span className="text-xs font-bold text-[#ff8a00] bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full shrink-0 whitespace-nowrap">
          Jetzt buchen →
        </span>
      </div>
    </Link>
  );
}

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
  const expiresAt = Number(p.expiresAt || p.expires_at || 0);
  if (p.paused) return null;
  if (status && status !== "active") return null;
  if (expiresAt && expiresAt < Date.now()) return null;
  if (!title && !text && !logo) return null;
  return { id: p.id || title, title, text, website, logo };
}

export default function PartnerBanner() {
  const [partners, setPartners] = useState([]);
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  const loadAll = useCallback(() => {
    const local = loadLocalPartners().map(normalizePartner).filter(Boolean);
    setPartners(local);
  }, []);

  useEffect(() => {
    loadAll();
  }, []);

  // Rotate every 10 seconds with a brief fade
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

  if (!partners.length) return <Placeholder />;

  const p = partners[idx % partners.length];

  const inner = (
    <div
      className="flex items-center gap-4"
      style={{ opacity: fade ? 1 : 0, transition: "opacity 0.3s ease" }}
    >
      {p.logo && (
        <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
          <img src={p.logo} alt={p.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold text-gray-900 truncate">{p.title}</div>
        {p.text && <div className="text-sm text-gray-500 leading-snug line-clamp-2 mt-0.5">{p.text}</div>}
        <div className="text-xs text-[#ff8a00] mt-1 font-medium">
          {p.website ? "Mehr erfahren →" : "Werbepartner"}
        </div>
      </div>
      {/* Dot indicators */}
      {partners.length > 1 && (
        <div className="flex gap-1 shrink-0">
          {partners.map((_, i) => (
            <button
              key={i}
              onClick={e => { e.preventDefault(); e.stopPropagation(); setFade(false); setTimeout(() => { setIdx(i); setFade(true); }, 200); }}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx % partners.length ? "bg-[#ff8a00]" : "bg-gray-200"}`}
              aria-label={`Partner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (p.website) {
    return (
      <a
        href={p.website}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
        style={{ textDecoration: "none" }}
      >
        {inner}
      </a>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      {inner}
    </div>
  );
}
