import { useState, useEffect } from "react";
import { pb } from "../lib/pb.js";

function normalizePartner(p) {
  if (!p || typeof p !== "object") return null;
  const title = (p.title || "").trim();
  const text = (p.text || "").trim();
  const website = (p.website || "").trim();
  const logo = (p.logo_data_url || "").trim();
  const status = (p.status || "").toLowerCase();
  const expiresAt = Number(p.expires_at || 0);
  if (p.paused) return null;
  if (status && status !== "active") return null;
  if (expiresAt && expiresAt < Date.now()) return null;
  if (!title && !text && !logo) return null;
  return { id: p.id || title, title, text, website, logo };
}

// Also support localStorage fallback for partners entered via the Werbepartner form
function loadLocalPartners() {
  try {
    const v2 = JSON.parse(localStorage.getItem("helpapp_partners_v2") || "[]");
    return Array.isArray(v2) ? v2 : [];
  } catch { return []; }
}

export default function PartnerBanner() {
  const [partner, setPartner] = useState(null);

  function pick() {
    // Merge local partners (from Werbepartner form) for now
    const local = loadLocalPartners().map(p => ({
      ...p,
      logo_data_url: p.logoDataUrl || "",
      expires_at: p.expiresAt || 0,
    })).map(normalizePartner).filter(Boolean);

    if (!local.length) { setPartner(null); return; }
    setPartner(local[Math.floor(Math.random() * local.length)]);
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
        {partner.logo ? <img src={partner.logo} alt={partner.title} className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Logo</span>}
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
      <a href={partner.website} target="_blank" rel="noopener noreferrer"
        className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow transition-shadow"
        style={{ textDecoration: "none" }}>
        {inner}
      </a>
    );
  }

  return <div className="bg-white border border-gray-200 rounded-xl p-4">{inner}</div>;
}
