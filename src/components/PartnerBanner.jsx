import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";

function normalizePartner(p) {
  if (!p || typeof p !== "object") return null;
  const title = (p.title || p.headline || p.name || "").toString().trim();
  const text = (p.text || p.desc || p.description || "").toString().trim();
  const website = (p.website || p.url || p.link || "").toString().trim();
  const logo = (p.logoDataUrl || p.logo || p.logoUrl || "").toString().trim();
  const status = (p.status || "").toLowerCase();
  const expiresAt = Number(p.expiresAt || p.paidUntil || 0);
  if (p.paused) return null;
  if (status && status !== "active") return null;
  if (expiresAt && expiresAt < Date.now()) return null;
  if (!title && !text && !logo) return null;
  return { id: p.id || title || Math.random().toString(36), title, text, website, logo };
}

export default function PartnerBanner() {
  const { loadPartners } = useAuth();
  const [partner, setPartner] = useState(null);

  function pick() {
    const list = loadPartners().map(normalizePartner).filter(Boolean);
    if (!list.length) { setPartner(null); return; }
    setPartner(list[Math.floor(Math.random() * list.length)]);
  }

  useEffect(() => {
    pick();
    const t = setInterval(pick, 15000);
    return () => clearInterval(t);
  }, []);

  if (!partner) {
    return (
      <div className="bg-gray-100 rounded-xl p-7 text-center text-gray-400 text-sm border border-gray-200">
        Werbebanner (Platzhalter)
      </div>
    );
  }

  const inner = (
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden">
        {partner.logo ? (
          <img src={partner.logo} alt={partner.title} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs text-gray-400">Logo</span>
        )}
      </div>
      <div>
        <div className="font-bold text-gray-900">{partner.title}</div>
        <div className="text-sm text-gray-500 leading-snug">{partner.text?.slice(0, 140)}</div>
        <div className="text-xs text-gray-400 mt-1">{partner.website ? "Mehr erfahren →" : "Werbepartner →"}</div>
      </div>
    </div>
  );

  if (partner.website) {
    return (
      <a href={partner.website} target="_blank" rel="noopener noreferrer" className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow transition-shadow" style={{ textDecoration: "none" }}>
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
