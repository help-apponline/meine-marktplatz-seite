import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const BASE_PRICE = 79.90;
const MAX_LOGO = 2 * 1024 * 1024;
const YEAR_MS = 365 * 24 * 60 * 60 * 1000;

function moneyDE(n) {
  try { return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(Number(n || 0)); }
  catch { return (Number(n || 0).toFixed(2).replace(".", ",") + " €"); }
}

function readFile(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export default function Werbepartner() {
  const { loadPartners, savePartners, loggedIn, userEmail, uid } = useAuth();

  const [title, setTitle] = useState("");
  const [website, setWebsite] = useState("");
  const [text, setText] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [terms, setTerms] = useState(false);
  const [editId, setEditId] = useState("");
  const [partners, setPartners] = useState([]);
  const [toast, setToast] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => { setPartners(loadPartners()); }, []);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function handleLogoChange(file) {
    if (!file) return;
    if (file.size > MAX_LOGO) { showToast("Logo zu groß (max. 2 MB)."); return; }
    const url = await readFile(file);
    setLogoDataUrl(url);
  }

  function getDraft(existing) {
    if (!title.trim() && !text.trim()) return null;
    const now = Date.now();
    return {
      id: editId || uid(),
      title: title.trim(),
      website: website.trim() ? (website.startsWith("http") ? website.trim() : "https://" + website.trim()) : "",
      text: text.trim(),
      logoDataUrl,
      owner: userEmail || "guest",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      expiresAt: existing?.expiresAt || (now + YEAR_MS),
      views: existing?.views || 0,
      clicks: existing?.clicks || 0,
    };
  }

  function saveDraft(status) {
    const list = loadPartners();
    const existing = editId ? list.find(x => x.id === editId) : null;
    const draft = getDraft(existing);
    if (!draft) { showToast("Bitte Überschrift und Beschreibung ausfüllen."); return; }
    draft.status = status;
    const idx = list.findIndex(x => x.id === draft.id);
    if (idx >= 0) list[idx] = { ...list[idx], ...draft };
    else list.push(draft);
    savePartners(list);
    setPartners([...list]);
    setEditId(draft.id);
    showToast(status === "active" ? "Eintrag veröffentlicht (Prototyp)." : "Entwurf gespeichert.");
  }

  function toggleStatus(id) {
    const list = loadPartners();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].status = list[idx].status === "active" ? "draft" : "active";
    savePartners(list);
    setPartners([...list]);
  }

  function extend(id) {
    const list = loadPartners();
    const idx = list.findIndex(x => x.id === id);
    if (idx < 0) return;
    list[idx].expiresAt = (list[idx].expiresAt || Date.now()) + YEAR_MS;
    savePartners(list);
    setPartners([...list]);
    showToast("+12 Monate verlängert (Prototyp).");
  }

  function remove(id) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    const list = loadPartners().filter(x => x.id !== id);
    savePartners(list);
    setPartners([...list]);
  }

  function loadIntoForm(p) {
    setEditId(p.id);
    setTitle(p.title || "");
    setWebsite(p.website || "");
    setText(p.text || "");
    setLogoDataUrl(p.logoDataUrl || "");
    showToast("Eintrag geladen (Bearbeiten).");
  }

  const myPartners = partners.filter(p => p.owner === (userEmail || "guest"));
  const activePartners = partners.filter(p => p.status === "active" && (p.expiresAt || 0) > Date.now());

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-6xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Werbepartner-Bereich</h2>
      <p className="text-gray-500 text-base mb-10 leading-relaxed">
        Firmen können hier ihr Logo, eine Überschrift, Kontaktdaten und einen Link veröffentlichen.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
        {/* Form */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-xs">
          <h3 className="font-bold text-gray-900 mb-1">Eintrag erstellen</h3>
          <p className="text-xs text-gray-400 mb-5">Tipp: Kurze, klare Überschrift und 2–4 Zeilen was du anbietest.</p>

          {/* Logo drop */}
          <div
            className="border border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-gray-400 transition-colors mb-4"
            onClick={() => fileRef.current?.click()}
          >
            <div>
              <div className="font-semibold text-sm text-gray-800">Firmenlogo</div>
              <div className="text-xs text-gray-400">Klicken · max. 2 MB</div>
            </div>
            <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
              {logoDataUrl ? <img src={logoDataUrl} alt="Logo" className="w-full h-full object-cover" /> : <span className="text-xs text-gray-400">Logo</span>}
            </div>
          </div>
          <input type="file" accept="image/*" ref={fileRef} className="hidden" onChange={e => handleLogoChange(e.target.files?.[0])} />

          <div className="flex flex-col gap-3">
            <div>
              <input type="text" placeholder="Überschrift (z.B. Müller Gartenservice GmbH)" value={title} onChange={e => setTitle(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <div className="text-xs text-gray-400 text-right mt-1">{title.length}/60</div>
            </div>

            <input type="url" placeholder="https://www.firma.de (optional)" value={website} onChange={e => setWebsite(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />

            <div>
              <textarea placeholder="Beschreibung / Kontaktdaten" value={text} onChange={e => setText(e.target.value)}
                rows={4} maxLength={280}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors resize-y" />
              <div className="text-xs text-gray-400 text-right mt-1">{text.length}/280</div>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 accent-gray-900" />
              <span>Ich akzeptiere die <span className="underline">AGB</span> und bestätige, dass mein Eintrag korrekt ist.</span>
            </label>

            <div className="flex gap-3 flex-wrap mt-1">
              <button onClick={() => setPreviewOpen(true)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Vorschau
              </button>
              <button onClick={() => saveDraft("draft")}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Entwurf speichern
              </button>
              <button
                onClick={() => { if (!terms) { showToast("Bitte AGB akzeptieren."); return; } showToast("Zahlungen kommen bald 🙂"); }}
                className="px-5 py-2.5 bg-[#ff8a00] text-white font-bold rounded-xl text-sm hover:bg-[#e67600] transition-colors"
              >
                Veröffentlichen · {moneyDE(BASE_PRICE)}/Jahr
              </button>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-4">
          <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="font-bold text-gray-900 mb-4">Preise & Leistungen</h3>
            <div className="text-4xl font-extrabold text-gray-900 tracking-tight">{moneyDE(BASE_PRICE)}</div>
            <div className="text-sm text-gray-400 mt-0.5 mb-5">pro Jahr · zzgl. MwSt.</div>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {["Logo + Überschrift + Beschreibung", "Direktlink zur eigenen Website", "Rotation in allen Werbebanners", "Klick-Tracking (anonym)", "12 Monate Laufzeit"].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-[#ff8a00] font-bold">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">So funktioniert's</h4>
            <div className="flex flex-col gap-3">
              {[
                { n: 1, b: "Eintrag erstellen", s: "Logo, Text und Website eintragen" },
                { n: 2, b: "Veröffentlichen", s: "Nach Zahlung sofort sichtbar" },
                { n: 3, b: "Sichtbarkeit", s: "Banner auf allen Seiten der App" },
              ].map(({ n, b, s }) => (
                <div key={n} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-bold shrink-0">{n}</div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{b}</div>
                    <div className="text-xs text-gray-500">{s}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My entries */}
      {myPartners.length > 0 && (
        <div className="mt-12">
          <h3 className="font-bold text-gray-800 mb-4">Meine Einträge</h3>
          <div className="flex flex-col gap-4">
            {myPartners.map(p => (
              <div key={p.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex items-start gap-4 mb-4">
                  {p.logoDataUrl && (
                    <div className="w-14 h-14 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                      <img src={p.logoDataUrl} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900">{p.title}</div>
                    <div className="text-sm text-gray-500 mt-0.5 line-clamp-2">{p.text}</div>
                    {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff8a00] mt-1 block">{p.website}</a>}
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${p.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status === "active" ? "Aktiv" : "Entwurf"}
                    </span>
                    <span className="text-[11px] text-gray-400">{p.views || 0} Views · {p.clicks || 0} Klicks</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => loadIntoForm(p)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Bearbeiten</button>
                  <button onClick={() => toggleStatus(p.id)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">{p.status === "active" ? "Pausieren" : "Aktivieren"}</button>
                  <button onClick={() => extend(p.id)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">+12 Monate</button>
                  <button onClick={() => remove(p.id)} className="text-xs px-3 py-1.5 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Löschen</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active partners list */}
      {activePartners.length > 0 && (
        <div className="mt-12">
          <h3 className="font-bold text-gray-800 mb-4">Aktive Werbepartner</h3>
          <div className="flex flex-col gap-3">
            {activePartners.map(p => (
              <div key={p.id} className="flex items-center gap-4 border border-gray-100 rounded-xl p-4 bg-white">
                {p.logoDataUrl ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                    <img src={p.logoDataUrl} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">Logo</div>}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-gray-900 text-sm">{p.title}</div>
                  <div className="text-xs text-gray-500">{p.text?.slice(0, 100)}</div>
                </div>
                {p.website && <a href={p.website} target="_blank" rel="noopener noreferrer" className="text-xs text-[#ff8a00] shrink-0">Website →</a>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={e => { if (e.target === e.currentTarget) setPreviewOpen(false); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-4">Vorschau</h3>
            <div className="flex items-center gap-4 border border-gray-100 rounded-xl p-4">
              {logoDataUrl ? (
                <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                  <img src={logoDataUrl} alt="Logo" className="w-full h-full object-cover" />
                </div>
              ) : <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">Logo</div>}
              <div>
                <div className="font-bold text-gray-900">{title || "Dein Unternehmensname"}</div>
                <div className="text-sm text-gray-500 mt-0.5">{text?.slice(0, 140) || "Deine Beschreibung…"}</div>
                {website && <div className="text-xs text-[#ff8a00] mt-1">Mehr erfahren →</div>}
              </div>
            </div>
            <button onClick={() => setPreviewOpen(false)}
              className="mt-4 w-full py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-sm rounded-xl px-4 py-3 shadow-xl max-w-xs">
          {toast}
        </div>
      )}
    </section>
  );
}
