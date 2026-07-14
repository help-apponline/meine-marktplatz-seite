import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import ImagePlus from "icon:image-plus";
import X from "icon:x";
import Check from "icon:check";

const PHOTOS_OPTIONS = [
  { key: "none",  label: "Keine Fotos",      maxPhotos: 0, price: 0 },
  { key: "s3",    label: "Bis zu 3 Fotos",   maxPhotos: 3, price: 6.99 },
  { key: "s5",    label: "Bis zu 6 Fotos",   maxPhotos: 6, price: 9.99 },
];
const MAX_LOGO = 2 * 1024 * 1024;
const MAX_PHOTO = 5 * 1024 * 1024;
const PARTNERS_KEY = "helpapp_partners_v2";

const PLANS = [
  {
    key: "month",
    label: "Monats-Paket",
    duration: "1 Monat",
    price: 19.99,
    ms: 30 * 24 * 60 * 60 * 1000,
    highlight: false,
    hint: "Monatlich kündbar",
  },
  {
    key: "halfyear",
    label: "6-Monats-Paket",
    duration: "6 Monate",
    price: 79.99,
    ms: 6 * 30 * 24 * 60 * 60 * 1000,
    highlight: false,
    hint: "Spare vs. Monat",
  },
  {
    key: "year",
    label: "Jahres-Paket",
    duration: "12 Monate",
    price: 99.99,
    ms: 365 * 24 * 60 * 60 * 1000,
    highlight: true,
    hint: "Bestes Preis-Leistungs-Verhältnis",
  },
];

function loadPartners() {
  try { return JSON.parse(localStorage.getItem(PARTNERS_KEY) || "[]"); } catch { return []; }
}
function savePartners(list) {
  localStorage.setItem(PARTNERS_KEY, JSON.stringify(list));
}

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
  const { loggedIn, userEmail, uid } = useAuth();

  const [selectedPlan, setSelectedPlan] = useState("year");
  const [title, setTitle] = useState("");
  const [region, setRegion] = useState("");
  const [website, setWebsite] = useState("");
  const [text, setText] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [photos, setPhotos] = useState([]);
  const [photosOption, setPhotosOption] = useState("none"); // "none" | "s3" | "s5"
  const [terms, setTerms] = useState(false);
  const [editId, setEditId] = useState("");
  const [partners, setPartners] = useState([]);
  const [toast, setToast] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState(null);
  const navigate = useNavigate();
  const logoRef = useRef(null);
  const photoRef = useRef(null);
  const formTopRef = useRef(null);

  useEffect(() => { setPartners(loadPartners()); }, []);

  const plan = PLANS.find(p => p.key === selectedPlan) || PLANS[2];
  const photoOpt = PHOTOS_OPTIONS.find(o => o.key === photosOption) || PHOTOS_OPTIONS[0];
  const maxPhotos = photoOpt.maxPhotos;
  const totalPrice = plan.price + photoOpt.price;

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }

  async function handleLogoChange(file) {
    if (!file) return;
    if (file.size > MAX_LOGO) { showToast("Logo zu groß (max. 2 MB)."); return; }
    setLogoDataUrl(await readFile(file));
  }

  async function handlePhotoAdd(files) {
    const remaining = maxPhotos - photos.length;
    if (remaining <= 0) { showToast(`Maximal ${maxPhotos} Fotos erlaubt.`); return; }
    const toAdd = Array.from(files).slice(0, remaining);
    const urls = [];
    for (const f of toAdd) {
      if (f.size > MAX_PHOTO) { showToast(`${f.name} ist zu groß (max. 5 MB).`); continue; }
      urls.push(await readFile(f));
    }
    setPhotos(prev => [...prev, ...urls]);
    // photos option stays as chosen
  }

  function removePhoto(idx) {
    setPhotos(prev => {
      const next = prev.filter((_, i) => i !== idx);
      
      return next;
    });
  }

  function getDraft(existing) {
    if (!title.trim() && !text.trim()) return null;
    const now = Date.now();
    return {
      id: editId || uid(),
      plan: plan.key,
      planLabel: plan.label,
      title: title.trim(),
      region: region.trim(),
      website: website.trim() ? (website.startsWith("http") ? website.trim() : "https://" + website.trim()) : "",
      text: text.trim(),
      logoDataUrl,
      photos,
      photosOption,
      totalPrice,
      owner: userEmail || "guest",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      expiresAt: existing?.expiresAt || (now + plan.ms),
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
    showToast(status === "active" ? "Eintrag gespeichert (Zahlung folgt)." : "Entwurf gespeichert.");
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
    list[idx].expiresAt = (list[idx].expiresAt || Date.now()) + plan.ms;
    savePartners(list);
    setPartners([...list]);
    showToast(`+${plan.duration} verlängert.`);
  }

  function remove(id) {
    if (!confirm("Eintrag wirklich löschen?")) return;
    const list = loadPartners().filter(x => x.id !== id);
    savePartners(list);
    setPartners(list);
  }

  function loadIntoForm(p) {
    setEditId(p.id);
    setSelectedPlan(p.plan || "year");
    setTitle(p.title || "");
    setRegion(p.region || "");
    setWebsite(p.website || "");
    setText(p.text || "");
    setLogoDataUrl(p.logoDataUrl || "");
    setPhotos(p.photos || []);
    setPhotosOption(p.photosOption || 'none');
    // Scroll the form into view so the user sees it loaded
    setTimeout(() => {
      formTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    showToast("Eintrag geladen — bitte oben bearbeiten und speichern.");
  }

  function handlePay() {
    if (!terms) { showToast("Bitte AGB akzeptieren."); return; }
    if (!title.trim()) { showToast("Bitte Überschrift ausfüllen."); return; }
    saveDraft("draft");
    showToast(`Zahlung über ${moneyDE(totalPrice)} wird bald über unseren Zahlungsanbieter abgewickelt.`);
  }

  const myPartners = partners.filter(p => p.owner === (userEmail || "guest"));
  // Show all active partners — expiresAt check is optional (show even if not set yet)
  const activePartners = partners.filter(p => p.status === "active");

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-6xl mx-auto w-full">
      {/* SEO highlight banner — prime position */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-5 mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="text-3xl shrink-0">🔍</div>
        <div>
          <h3 className="font-extrabold text-gray-900 text-base mb-1">Dein Unternehmen — bei Google sichtbar</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Jeder Werbepartner bekommt eine <strong>eigene Profilseite</strong> auf der Help App — 
            mit Firmenname, Region und Beschreibung, die Google als lokales Unternehmen erkennt. 
            Wenn jemand in deiner Region nach deiner Branche sucht, kann dein Eintrag direkt in den Suchergebnissen auftauchen. 
            Kein technisches Wissen nötig — wir erledigen das automatisch für dich.
          </p>
        </div>
      </div>

      <h2 ref={formTopRef} className="text-3xl font-extrabold text-gray-900 mb-2">Werbepartner-Bereich</h2>
      <p className="text-gray-500 text-base mb-10 leading-relaxed">
        Wähle dein Paket, lade dein Logo hoch und werde auf allen Seiten der Help App sichtbar.
      </p>

      {/* ── Plan Selector ── */}
      <div className="mb-8">
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Laufzeit wählen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PLANS.map(p => {
            const active = selectedPlan === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setSelectedPlan(p.key)}
                className={`relative text-left rounded-2xl border-2 p-5 transition-all ${
                  active
                    ? "border-[#ff8a00] bg-orange-50"
                    : "border-gray-100 bg-white hover:border-gray-300"
                }`}
              >
                {p.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ff8a00] text-white text-[11px] font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
                    Empfehlung
                  </span>
                )}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{p.label}</div>
                    <div className="text-xs text-gray-500">{p.hint}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    active ? "border-[#ff8a00] bg-[#ff8a00]" : "border-gray-300"
                  }`}>
                    {active && <Check size={11} className="text-white" strokeWidth={3} />}
                  </div>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">{moneyDE(p.price)}</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">inkl. MwSt. · {p.duration}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.9fr] gap-6 items-start">
        {/* ── Form ── */}
        <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-xs">
          <h3 className="font-bold text-gray-900 mb-1">Eintrag erstellen</h3>
          <p className="text-xs text-gray-400 mb-5">Kurze, klare Überschrift und 2–4 Zeilen was du anbietest.</p>

          {/* Logo */}
          <div
            className="border border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer hover:border-gray-400 transition-colors mb-4"
            onClick={() => logoRef.current?.click()}
          >
            <div>
              <div className="font-semibold text-sm text-gray-800">Firmenlogo</div>
              <div className="text-xs text-gray-400">Klicken · max. 2 MB</div>
            </div>
            <div className="w-14 h-14 rounded-xl border border-gray-100 bg-gray-50 overflow-hidden flex items-center justify-center shrink-0">
              {logoDataUrl
                ? <img src={logoDataUrl} alt="Logo" className="w-full h-full object-cover" />
                : <span className="text-xs text-gray-400">Logo</span>}
            </div>
          </div>
          <input type="file" accept="image/*" ref={logoRef} className="hidden" onChange={e => handleLogoChange(e.target.files?.[0])} />

          <div className="flex flex-col gap-3">
            <div>
              <input type="text" placeholder="Überschrift (z.B. Müller Gartenservice GmbH)" value={title}
                onChange={e => setTitle(e.target.value)} maxLength={60}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <div className="text-xs text-gray-400 text-right mt-1">{title.length}/60</div>
            </div>
            <input type="text" placeholder="Region / Ort (z.B. Hamburg, NRW, deutschlandweit)" value={region}
              onChange={e => setRegion(e.target.value)} maxLength={60}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <input type="url" placeholder="https://www.firma.de (optional)" value={website}
              onChange={e => setWebsite(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <div>
              <textarea placeholder="Beschreibung / Kontaktdaten" value={text}
                onChange={e => setText(e.target.value)} rows={4} maxLength={280}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors resize-y" />
              <div className="text-xs text-gray-400 text-right mt-1">{text.length}/280</div>
            </div>

            {/* Foto-Option */}
            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
              <p className="text-xs text-gray-500 font-medium mb-3">Foto-Erweiterung (optional)</p>
              <div className="flex flex-col gap-2">
                {PHOTOS_OPTIONS.map(opt => (
                  <label key={opt.key} className="flex items-center gap-3 cursor-pointer">
                    <input type="radio" name="photosOption" value={opt.key}
                      checked={photosOption === opt.key}
                      onChange={() => { setPhotosOption(opt.key); if (opt.maxPhotos === 0) setPhotos([]); }}
                      className="accent-[#ff8a00]" />
                    <span className="flex-1 text-sm text-gray-800">{opt.label}</span>
                    {opt.price > 0 && (
                      <span className="text-xs font-bold text-[#ff8a00] bg-orange-50 border border-orange-100 px-2 py-0.5 rounded-full shrink-0">
                        + {moneyDE(opt.price)} inkl. MwSt.
                      </span>
                    )}
                    {opt.price === 0 && <span className="text-xs text-gray-400 shrink-0">kostenlos</span>}
                  </label>
                ))}
              </div>

              {maxPhotos > 0 && (
                <div className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                    {photos.map((url, i) => (
                      <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-gray-100 bg-gray-100">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                        <button onClick={() => removePhoto(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors">
                          <X size={11} />
                        </button>
                      </div>
                    ))}
                    {photos.length < maxPhotos && (
                      <button onClick={() => photoRef.current?.click()}
                        className="aspect-video rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1.5 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-600">
                        <ImagePlus size={24} />
                        <span className="text-xs font-medium">Foto hinzufügen</span>
                      </button>
                    )}
                  </div>
                  <input type="file" accept="image/*" multiple ref={photoRef} className="hidden"
                    onChange={e => handlePhotoAdd(e.target.files)} />
                  <p className="text-xs text-gray-400">{photos.length} / {maxPhotos} Fotos hochgeladen · max. 5 MB pro Foto</p>
                </div>
              )}
            </div>

            {/* AGB */}
            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 accent-gray-900" />
              <span>Ich akzeptiere die <span className="underline">AGB</span> und bestätige, dass mein Eintrag korrekt ist.</span>
            </label>

            {/* Price summary */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-700">{plan.label} ({plan.duration})</span>
                <span className="text-sm font-semibold text-gray-900">{moneyDE(plan.price)}</span>
              </div>
              {photoOpt.price > 0 && (
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{photoOpt.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{moneyDE(photoOpt.price)}</span>
                </div>
              )}
              <div className="border-t border-orange-200 mt-2 pt-2 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">Gesamt inkl. MwSt.</span>
                <span className="text-xl font-extrabold text-[#ff8a00]">{moneyDE(totalPrice)}</span>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap mt-1">
              <button onClick={() => setPreviewOpen(true)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Vorschau
              </button>
              <button onClick={() => saveDraft("draft")}
                className="px-5 py-2.5 bg-gray-800 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors">
                Speichern
              </button>
              <button onClick={handlePay}
                className="flex-1 px-5 py-2.5 bg-[#ff8a00] text-white font-bold rounded-xl text-sm hover:bg-[#e67600] transition-colors text-center">
                Jetzt buchen · {moneyDE(totalPrice)}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center">
              Zahlung über Stripe — kommt bald. Dein Entwurf wird bis dahin gespeichert.
            </p>
            <p className="text-[11px] text-gray-400 text-center -mt-1">
              Das Abonnement verlängert sich automatisch zum Ende der Laufzeit. Jederzeit kündbar.
            </p>
          </div>
        </div>

        {/* ── Leistungen sidebar ── */}
        <div className="flex flex-col gap-4">
          <div className="border border-gray-100 rounded-2xl p-6 bg-white shadow-xs">
            <h3 className="font-bold text-gray-900 mb-4">Im Paket enthalten</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {[
                "Logo + Überschrift + Beschreibung",
                "Direktlink zur eigenen Website",
                "Rotation in allen Werbebanners",
                "Eigene Profilseite – von Google indexiert",
                "Klick-Tracking (anonym)",
                `Laufzeit: ${plan.duration}`,
              ].map(f => (
                <div key={f} className="flex items-center gap-2">
                  <span className="text-[#ff8a00] font-bold text-base">✓</span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-orange-100 rounded-2xl p-5 bg-orange-50">
            <h4 className="font-bold text-gray-900 text-sm mb-3">Foto-Erweiterungen</h4>
            <div className="flex flex-col gap-3">
              {PHOTOS_OPTIONS.filter(o => o.price > 0).map(opt => (
                <div key={opt.key} className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-sm font-semibold text-gray-900">{opt.label}</span>
                    <span className="text-xs text-gray-500 ml-1">· max. 5 MB/Foto</span>
                  </div>
                  <span className="text-xs font-bold text-[#ff8a00] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full shrink-0">
                    + {moneyDE(opt.price)}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">inkl. MwSt. · einmalig pro Laufzeit · jederzeit austauschbar</p>
          </div>

          <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
            <h4 className="font-bold text-gray-800 mb-3 text-sm">So funktioniert's</h4>
            <div className="flex flex-col gap-3">
              {[
                { n: 1, b: "Paket & Eintrag wählen", s: "Laufzeit, Logo, Text, Website" },
                { n: 2, b: "Zahlung abschließen", s: "Sicher über unseren Zahlungsanbieter" },
                { n: 3, b: "Sofort sichtbar", s: "Banner auf allen Seiten der App" },
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

      {/* ── My entries ── */}
      {myPartners.length > 0 && (
        <div className="mt-12">
          <h3 className="font-bold text-gray-800 mb-4">Meine Einträge</h3>
          <div className="flex flex-col gap-4">
            {myPartners.map(p => (
              <div key={p.id} className="border border-gray-100 rounded-2xl p-5 bg-white shadow-xs">
                <div className="flex items-start gap-4 mb-3">
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
                    <span className="text-[11px] text-gray-400">{p.planLabel || "Jahres-Paket"}</span>
                    <span className="text-[11px] text-gray-400">{p.views || 0} Views · {p.clicks || 0} Klicks</span>
                    {p.photosOption && p.photosOption !== "none" && <span className="text-[11px] text-[#ff8a00]">inkl. Fotos</span>}
                  </div>
                </div>
                {p.photos?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                    {p.photos.map((url, i) => (
                      <button key={i} onClick={() => setLightboxUrl(url)}
                        className="aspect-video rounded-lg overflow-hidden border border-gray-100 hover:opacity-90 hover:scale-[1.03] transition-all cursor-zoom-in">
                        <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => loadIntoForm(p)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Bearbeiten</button>
                  <button onClick={() => toggleStatus(p.id)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">{p.status === "active" ? "Pausieren" : "Aktivieren"}</button>
                  <button onClick={() => extend(p.id)} className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">Verlängern</button>
                  <button onClick={() => remove(p.id)} className="text-xs px-3 py-1.5 border border-red-100 text-red-600 rounded-lg hover:bg-red-50 transition-colors">Löschen</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Active partners list ── */}
      {activePartners.length > 0 && (
        <div className="mt-12">
          <h3 className="font-bold text-gray-800 mb-4">Aktive Werbepartner</h3>
          <div className="flex flex-col gap-3">
            {activePartners.map(p => (
              <div key={p.id} className="border border-gray-100 rounded-xl p-4 bg-white">
                <div className="flex items-center gap-4">
                  {p.logoDataUrl
                    ? <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0"><img src={p.logoDataUrl} alt={p.title} className="w-full h-full object-cover" /></div>
                    : <div className="w-12 h-12 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">Logo</div>}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-sm">{p.title}</div>
                    <div className="text-xs text-gray-500">{p.text?.slice(0, 100)}</div>
                  </div>
                  <button onClick={() => navigate(`/partner/${p.id}`)}
                    className="text-xs text-[#ff8a00] shrink-0 hover:underline">Mehr erfahren →</button>
                </div>
                {p.photos?.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-3">
                    {p.photos.map((url, i) => (
                      <div key={i} className="aspect-video rounded-lg overflow-hidden border border-gray-100">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Preview modal ── */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}
          onClick={e => { if (e.target === e.currentTarget) setPreviewOpen(false); }}>
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h3 className="font-bold text-gray-900 mb-4">So sieht dein Eintrag aus</h3>
            <div className="border border-gray-100 rounded-xl p-4">
              <div className="flex items-center gap-4 mb-3">
                {logoDataUrl
                  ? <div className="w-16 h-16 rounded-xl border border-gray-100 overflow-hidden shrink-0"><img src={logoDataUrl} alt="Logo" className="w-full h-full object-cover" /></div>
                  : <div className="w-16 h-16 rounded-xl bg-gray-100 shrink-0 flex items-center justify-center text-xs text-gray-400">Logo</div>}
                <div>
                  <div className="font-bold text-gray-900">{title || "Dein Unternehmensname"}</div>
                  <div className="text-sm text-gray-500 mt-0.5">{text?.slice(0, 140) || "Deine Beschreibung…"}</div>
                  {website && <div className="text-xs text-[#ff8a00] mt-1">Mehr erfahren →</div>}
                </div>
              </div>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {photos.map((url, i) => (
                    <div key={i} className="aspect-video rounded-lg overflow-hidden border border-gray-100">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => setPreviewOpen(false)}
              className="mt-4 w-full py-2.5 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors">
              Schließen
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <img
            src={lightboxUrl}
            alt="Vergrößert"
            className="max-w-full max-h-full rounded-xl shadow-2xl object-contain"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            onClick={e => e.stopPropagation()}
          />
          <button
            onClick={() => setLightboxUrl(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
            aria-label="Schließen"
          >
            <X size={18} />
          </button>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-sm rounded-xl px-4 py-3 shadow-xl max-w-xs">
          {toast}
        </div>
      )}
    </section>
  );
}
