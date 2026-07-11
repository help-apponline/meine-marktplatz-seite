import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import ExternalLink from "icon:external-link";
import ArrowLeft from "icon:arrow-left";
import Globe from "icon:globe";
import X from "icon:x";

const PARTNERS_KEY = "helpapp_partners_v2";

function loadPartner(id) {
  try {
    const list = JSON.parse(localStorage.getItem(PARTNERS_KEY) || "[]");
    return list.find(p => p.id === id) || null;
  } catch { return null; }
}

export default function PartnerProfil() {
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  useEffect(() => {
    const p = loadPartner(id);
    if (p) {
      setPartner(p);
    } else {
      setNotFound(true);
    }
  }, [id]);

  if (notFound) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-3xl mx-auto w-full flex flex-col items-center justify-center gap-4">
        <Globe size={40} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">Partner nicht gefunden</h2>
        <p className="text-gray-500 text-sm text-center">Dieser Werbepartner existiert nicht oder ist nicht mehr aktiv.</p>
        <Link to="/" className="mt-2 text-sm text-[#ff8a00] underline">Zur Startseite</Link>
      </section>
    );
  }

  if (!partner) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-10 max-w-3xl mx-auto w-full">

      {/* Back link */}
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors mb-8"
        style={{ textDecoration: "none" }}>
        <ArrowLeft size={14} /> Zurück zur Startseite
      </Link>

      {/* Header */}
      <div className="flex items-start gap-5 mb-8">
        {partner.logoDataUrl ? (
          <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100 shrink-0">
            <img src={partner.logoDataUrl} alt={partner.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-2xl bg-gray-100 shrink-0 flex items-center justify-center">
            <Globe size={28} className="text-gray-400" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{partner.title}</h1>
          {partner.website && (
            <a
              href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-[#ff8a00] hover:underline"
            >
              <Globe size={13} />
              {partner.website.replace(/^https?:\/\//, "")}
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      {partner.text && (
        <div className="bg-gray-50 rounded-2xl px-6 py-5 mb-8">
          <h2 className="font-bold text-gray-900 mb-2 text-sm">Über uns</h2>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{partner.text}</p>
        </div>
      )}

      {/* Photos gallery */}
      {partner.photos?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-8">
          {partner.photos.map((url, i) => (
            <button key={i} onClick={() => setLightboxUrl(url)}
              className="rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center hover:opacity-90 hover:scale-[1.02] transition-all cursor-zoom-in"
              style={{ height: "140px" }}>
              <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-contain" />
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      {partner.website && (
        <div className="border border-orange-100 bg-orange-50 rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="font-bold text-gray-900 text-sm">Website besuchen</div>
            <div className="text-xs text-gray-500 mt-0.5">Du verlässt jetzt die Help App und wirst zur Website des Partners weitergeleitet.</div>
          </div>
          <a
            href={partner.website.startsWith("http") ? partner.website : `https://${partner.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#ff8a00] text-white font-bold rounded-xl text-sm hover:bg-[#e67a00] transition-colors shrink-0"
          >
            Zur Website <ExternalLink size={14} />
          </a>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}>
          <img src={lightboxUrl} alt="Vergrößert"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()} />
          <button onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Label + Affiliate Banner */}
      <p className="text-xs text-gray-400 mt-6 text-center">
        Werbepartner-Eintrag · <Link to="/werbepartner" className="underline hover:text-gray-600">Selbst Werbepartner werden</Link>
      </p>

      {/* Affiliate Banner */}
      <div className="mt-4">
        <p className="text-[10px] text-gray-400 mb-1.5 text-center tracking-wide uppercase">Werbeanzeige</p>
        <Link to="/werbepartner" style={{ textDecoration: "none" }}>
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff8a00]/10 flex items-center justify-center shrink-0 text-xl">📢</div>
              <div>
                <div className="font-bold text-gray-800 text-sm">Auch hier werben?</div>
                <div className="text-xs text-gray-500 mt-0.5">Erreichen Sie täglich neue Kunden — ab 19,99 € / Monat</div>
              </div>
            </div>
            <span className="text-xs font-bold text-white bg-[#ff8a00] px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap">
              Jetzt buchen →
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
