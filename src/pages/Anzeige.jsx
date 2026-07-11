import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import PartnerBanner from "../components/PartnerBanner.jsx";
import ImagePlus from "icon:image-plus";
import X from "icon:x";
import Pencil from "icon:pencil";
import Trash2 from "icon:trash-2";
import CheckCircle from "icon:check-circle";

const MAX_PHOTOS = 5;
const MAX_PHOTO_SIZE = 8 * 1024 * 1024; // 8 MB

export default function Anzeige() {
  const { loggedIn, verified, userRole: accountRole, loadMyAds, createAd, updateAd, deleteAd, setAdStatus, uid } = useAuth();

  const [formRole, setFormRole] = useState(accountRole || "customer");
  const [name, setName] = useState("");
  const [need, setNeed] = useState("");
  const [when, setWhen] = useState("");
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");
  const [helperWhen, setHelperWhen] = useState("");
  const [radius, setRadius] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");
  const [preisart, setPreisart] = useState("");
  const [desc, setDesc] = useState("");
  const [photos, setPhotos] = useState([]); // File objects
  const [photoPreviews, setPhotoPreviews] = useState([]); // data URLs for preview
  const [myAds, setMyAds] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingAds, setLoadingAds] = useState(false);
  const photoRef = useRef(null);

  // Edit mode
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState("");

  useEffect(() => {
    setFormRole(accountRole || "customer");
  }, [accountRole]);

  function addPhotos(files) {
    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) { setError(`Maximal ${MAX_PHOTOS} Fotos erlaubt.`); return; }
    const toAdd = Array.from(files).slice(0, remaining);
    const newFiles = [];
    const newPreviews = [];
    let hadError = false;
    let loaded = 0;
    if (toAdd.length === 0) return;
    toAdd.forEach(f => {
      if (f.size > MAX_PHOTO_SIZE) { hadError = true; loaded++; if (loaded === toAdd.length && newFiles.length) { setPhotos(p => [...p, ...newFiles]); setPhotoPreviews(p => [...p, ...newPreviews]); } return; }
      newFiles.push(f);
      const reader = new FileReader();
      reader.onload = e => {
        newPreviews.push(e.target.result);
        loaded++;
        if (loaded === toAdd.length) {
          setPhotos(p => [...p, ...newFiles]);
          setPhotoPreviews(p => [...p, ...newPreviews]);
          if (hadError) setError("Einige Fotos waren zu groß (max. 8 MB) und wurden übersprungen.");
        }
      };
      reader.readAsDataURL(f);
    });
  }

  function removePhoto(idx) {
    setPhotos(p => p.filter((_, i) => i !== idx));
    setPhotoPreviews(p => p.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    if (!loggedIn) return;
    setLoadingAds(true);
    loadMyAds().then(ads => { setMyAds(ads); setLoadingAds(false); }).catch(() => setLoadingAds(false));
  }, [loggedIn]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!loggedIn) {
      window.__helpAppRequireLogin?.("Bitte logge dich ein, um eine Anzeige zu veröffentlichen.");
      return;
    }
    if (!verified) {
      setError("Bitte bestätige zuerst deine E-Mail-Adresse. Den Bestätigungslink findest du in deinem Posteingang.");
      return;
    }
    setSubmitting(true);
    setError("");
    const title = formRole === "helper" ? (skills || "Hilfe anbieten") : (need || "Hilfe gesucht");
    const chosenWhen = formRole === "helper" ? helperWhen : when;
    const priceLabel = price ? `${price} (${preisart || "—"})` : (preisart || "—");
    try {
      await createAd({ role: formRole, name, zip, city, title, when: chosenWhen, price, preisart, priceLabel, desc, photos });
      const updated = await loadMyAds();
      setMyAds(updated);
      setMsg("Anzeige veröffentlicht!");
      setName(""); setNeed(""); setWhen(""); setBudget(""); setSkills("");
      setHelperWhen(""); setRadius(""); setZip(""); setCity("");
      setPrice(""); setPreisart(""); setDesc(""); setPhotos([]); setPhotoPreviews([]);
      setTimeout(() => setMsg(""), 3000);
    } catch (e) {
      setError("Fehler beim Speichern. Bitte versuche es erneut.");
    }
    setSubmitting(false);
  }

  function startEdit(ad) {
    setEditingId(ad.id);
    setEditTitle(ad.title || "");
    setEditCity(ad.city || "");
    setEditDesc(ad.desc || "");
    setEditPrice(ad.priceLabel || "");
    setEditMsg("");
  }

  async function handleSaveEdit(adId) {
    setEditSaving(true);
    setEditMsg("");
    try {
      const updated = await updateAd(adId, {
        title: editTitle,
        city: editCity,
        desc: editDesc,
        price: editPrice,
      });
      setMyAds(prev => prev.map(a => a.id === adId ? { ...a, ...updated } : a));
      setEditingId(null);
      setEditMsg("Gespeichert.");
      setTimeout(() => setEditMsg(""), 2500);
    } catch {
      setEditMsg("Fehler beim Speichern.");
    }
    setEditSaving(false);
  }

  async function handleDelete(adId) {
    if (!confirm("Anzeige wirklich löschen?")) return;
    try {
      await deleteAd(adId);
      setMyAds(prev => prev.filter(a => a.id !== adId));
    } catch {
      setError("Löschen fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  async function handleSetStatus(adId, status) {
    try {
      const updated = await setAdStatus(adId, status);
      setMyAds(prev => prev.map(a => a.id === adId ? { ...a, ...updated } : a));
    } catch {
      setError("Status konnte nicht geändert werden.");
    }
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-5xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Erstellen Sie Ihre Anzeige</h2>

      {!loggedIn && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          Bitte{" "}
          <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um eine Anzeige aufzugeben.")}
            className="underline font-semibold cursor-pointer bg-transparent border-none p-0 text-amber-800">
            anmelden
          </button>
          , um eine Anzeige aufzugeben.
        </div>
      )}

      {loggedIn && !verified && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
          Bitte bestätige zuerst deine E-Mail-Adresse, bevor du eine Anzeige aufgibst. Den Link haben wir dir bei der Registrierung geschickt.
        </div>
      )}

      {msg && <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-semibold">{msg}</div>}
      {error && <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl">
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />

        {/* Role switcher */}
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Ich möchte eine Anzeige aufgeben als:</p>
          <div className="flex gap-3">
            {[
              { val: "customer", label: "Auftraggeber", sub: "Ich suche Hilfe" },
              { val: "helper", label: "Auftragnehmer", sub: "Ich biete Hilfe an" },
            ].map(({ val, label, sub }) => (
              <button key={val} type="button" onClick={() => setFormRole(val)}
                className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                  formRole === val ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}>
                {label}
                <span className={`block text-xs mt-0.5 font-normal ${formRole === val ? "text-white/70" : "text-gray-400"}`}>{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {formRole === "customer" && (
          <>
            <input type="text" placeholder="Wobei brauchst du Hilfe? (z.B. Umzug, Garten, Montage)" value={need} onChange={e => setNeed(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <div className="flex gap-3 flex-wrap">
              <input type="text" placeholder="Wann? (z.B. Samstag 14 Uhr)" value={when} onChange={e => setWhen(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <input type="text" placeholder="Budget (optional)" value={budget} onChange={e => setBudget(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            </div>
          </>
        )}

        {formRole === "helper" && (
          <>
            <input type="text" placeholder="Deine Skills (z.B. Garten, Handwerk, Umzug)" value={skills} onChange={e => setSkills(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            <div className="flex gap-3 flex-wrap">
              <input type="text" placeholder="Verfügbarkeit (z.B. Mo–Fr ab 17 Uhr)" value={helperWhen} onChange={e => setHelperWhen(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
              <input type="text" placeholder="Umkreis (optional, z.B. 15 km)" value={radius} onChange={e => setRadius(e.target.value)}
                className="flex-1 min-w-[160px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
            </div>
          </>
        )}

        <div className="flex gap-3 flex-wrap">
          <input type="text" placeholder="PLZ" value={zip} onChange={e => setZip(e.target.value)}
            className="w-28 px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
          <input type="text" placeholder="Ort" value={city} onChange={e => setCity(e.target.value)}
            className="flex-1 min-w-[140px] px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
        </div>

        <div className="flex gap-3 flex-wrap items-center">
          <input type="text" placeholder="Preis" value={price} onChange={e => setPrice(e.target.value)}
            className="w-36 px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors" />
          <div className="flex flex-wrap gap-3 items-center text-sm text-gray-700">
            {["Festpreis", "Pauschal", "Pro Stunde", "Verhandelbar"].map(v => (
              <label key={v} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="preisart" value={v} checked={preisart === v} onChange={() => setPreisart(v)} className="accent-gray-900" />
                {v}
              </label>
            ))}
          </div>
        </div>

        <textarea placeholder="Beschreibung" rows={5} value={desc} onChange={e => setDesc(e.target.value)}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors resize-y min-h-[140px]" />

        {/* Photo upload */}
        <div>
          <p className="text-xs text-gray-500 mb-2 font-medium">Fotos hinzufügen (optional, max. {MAX_PHOTOS})</p>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {photoPreviews.map((url, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                <img src={url} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <button type="button" onClick={() => removePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors">
                  <X size={10} />
                </button>
              </div>
            ))}
            {photos.length < MAX_PHOTOS && (
              <button type="button" onClick={() => photoRef.current?.click()}
                className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 hover:border-gray-400 transition-colors text-gray-400 hover:text-gray-600">
                <ImagePlus size={20} />
                <span className="text-[10px] font-medium">Foto</span>
              </button>
            )}
          </div>
          <input type="file" accept="image/*" multiple ref={photoRef} className="hidden"
            onChange={e => { addPhotos(e.target.files); e.target.value = ""; }} />
          {photos.length > 0 && (
            <p className="text-xs text-gray-400 mt-1">{photos.length} / {MAX_PHOTOS} Fotos ausgewählt</p>
          )}
        </div>

        <button type="submit" disabled={submitting}
          className="px-6 py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-700 transition-colors text-sm disabled:opacity-60">
          {submitting ? "Wird gespeichert…" : "Anzeige veröffentlichen"}
        </button>
      </form>

      {loggedIn && (
        <>
          <hr className="my-10 border-gray-100" />
          <h3 className="font-bold text-gray-800 mb-3">Meine Anzeigen</h3>
          {editMsg && <p className="text-green-600 text-sm mb-3">{editMsg}</p>}
          {loadingAds ? (
            <p className="text-gray-400 text-sm">Wird geladen…</p>
          ) : myAds.length === 0 ? (
            <p className="text-gray-400 text-sm">Noch keine Anzeigen erstellt.</p>
          ) : (
            <div className="flex flex-col gap-4 max-w-2xl">
              {[...myAds].map(ad => (
                <div key={ad.id} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                  {editingId === ad.id ? (
                    <div className="p-5 flex flex-col gap-3">
                      <p className="text-xs text-gray-500 font-medium">Anzeige bearbeiten</p>
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                        placeholder="Überschrift" maxLength={100}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700" />
                      <input value={editCity} onChange={e => setEditCity(e.target.value)}
                        placeholder="Ort"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700" />
                      <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)}
                        placeholder="Beschreibung" rows={3} maxLength={500}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 resize-y" />
                      <input value={editPrice} onChange={e => setEditPrice(e.target.value)}
                        placeholder="Preis / Angabe"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700" />
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => handleSaveEdit(ad.id)} disabled={editSaving}
                          className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-60">
                          {editSaving ? "Speichert…" : "Speichern"}
                        </button>
                        <button onClick={() => setEditingId(null)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors">
                          Abbrechen
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex-1 min-w-0">
                          <Link to={`/detail/${ad.id}`}
                            className="font-bold text-gray-900 hover:text-[#ff8a00] transition-colors block truncate"
                            style={{ textDecoration: "none" }}>
                            {ad.title}
                          </Link>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {ad.city} · {new Date(ad.createdAt).toLocaleDateString("de-DE")} ·{" "}
                            {ad.role === "helper" ? "Auftragnehmer" : "Auftraggeber"}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                          ad.status === "erledigt" ? "bg-green-100 text-green-700" :
                          ad.status === "storniert" ? "bg-gray-200 text-gray-500" :
                          "bg-[#ff8a00]/10 text-[#ff8a00]"
                        }`}>
                          {ad.status === "erledigt" ? "Erledigt" : ad.status === "storniert" ? "Storniert" : "Offen"}
                        </span>
                      </div>
                      {ad.photos?.length > 0 && (
                        <div className="flex gap-2 mb-3 flex-wrap">
                          {ad.photos.slice(0, 3).map((url, i) => (
                            <div key={i} className="w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                              <img src={url} alt="" className="w-full h-full object-cover" />
                            </div>
                          ))}
                          {ad.photos.length > 3 && <span className="text-xs text-gray-400 self-center">+{ad.photos.length - 3}</span>}
                        </div>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => startEdit(ad)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700">
                          <Pencil size={11} /> Bearbeiten
                        </button>
                        {ad.status === "offen" && (
                          <button onClick={() => handleSetStatus(ad.id, "erledigt")}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-green-100 rounded-lg hover:bg-green-50 transition-colors text-green-700">
                            <CheckCircle size={11} /> Als erledigt markieren
                          </button>
                        )}
                        {ad.status === "erledigt" && (
                          <button onClick={() => handleSetStatus(ad.id, "offen")}
                            className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                            Wieder öffnen
                          </button>
                        )}
                        <button onClick={() => handleDelete(ad.id)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-600 ml-auto">
                          <Trash2 size={11} /> Löschen
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div className="mt-10 max-w-2xl">
        <PartnerBanner />
      </div>
    </section>
  );
}
