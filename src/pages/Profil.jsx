import { useState, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import User from "icon:user";
import Lock from "icon:lock";
import Check from "icon:check";
import Camera from "icon:camera";
import LayoutDashboard from "icon:layout-dashboard";
import Heart from "icon:heart";
import MessageCircle from "icon:message-circle";

export default function Profil() {
  const { loggedIn, userEmail, userRole, userId, verified, avatarUrl, setAvatarUrl, getAvatarUrl, emailNotifications, setEmailNotifications } = useAuth();

  // Avatar state
  const avatarRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(avatarUrl || "");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState("");
  const [avatarError, setAvatarError] = useState("");

  // Password change state
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState("");
  const [pwError, setPwError] = useState("");

  // Name change state
  const [name, setName] = useState(() => pb.authStore.record?.name || "");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameMsg, setNameMsg] = useState("");
  const [nameError, setNameError] = useState("");

  // Nutzertyp state
  const [nutzertyp, setNutzertyp] = useState(() => pb.authStore.record?.nutzertyp || "privat");
  const [nutzertypMsg, setNutzertypMsg] = useState("");
  const [nutzertypLoading, setNutzertypLoading] = useState(false);

  function roleLabel(r) {
    return r === "helper" ? "Auftragnehmer" : "Auftraggeber";
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError("Bild zu groß (max. 5 MB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleAvatarSave() {
    const file = avatarRef.current?.files?.[0];
    if (!file) return;
    setAvatarLoading(true);
    setAvatarError("");
    setAvatarMsg("");
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const updated = await pb.collection("users").update(userId, fd);
      const url = getAvatarUrl(updated);
      setAvatarUrl(url);
      setAvatarPreview(url);
      setAvatarMsg("Profilbild gespeichert.");
      setTimeout(() => setAvatarMsg(""), 3000);
      avatarRef.current.value = "";
    } catch {
      setAvatarError("Profilbild konnte nicht gespeichert werden.");
    }
    setAvatarLoading(false);
  }

  async function handleAvatarRemove() {
    setAvatarLoading(true);
    setAvatarError("");
    try {
      await pb.collection("users").update(userId, { "avatar": null });
      setAvatarUrl("");
      setAvatarPreview("");
      setAvatarMsg("Profilbild entfernt.");
      setTimeout(() => setAvatarMsg(""), 3000);
    } catch {
      setAvatarError("Profilbild konnte nicht entfernt werden.");
    }
    setAvatarLoading(false);
  }

  async function handleNameSave(e) {
    e.preventDefault();
    if (!name.trim()) { setNameError("Bitte gib einen Namen ein."); return; }
    setNameLoading(true);
    setNameError("");
    setNameMsg("");
    try {
      await pb.collection("users").update(userId, { name: name.trim() });
      setNameMsg("Name gespeichert.");
      setTimeout(() => setNameMsg(""), 3000);
    } catch {
      setNameError("Name konnte nicht gespeichert werden.");
    }
    setNameLoading(false);
  }

  async function handlePasswordChange(e) {
    e.preventDefault();
    setPwError("");
    setPwMsg("");
    if (newPw.length < 8) { setPwError("Das neue Passwort muss mindestens 8 Zeichen haben."); return; }
    if (newPw !== newPw2) { setPwError("Die neuen Passwörter stimmen nicht überein."); return; }
    setPwLoading(true);
    try {
      await pb.collection("users").update(userId, {
        oldPassword: oldPw,
        password: newPw,
        passwordConfirm: newPw2,
      });
      setPwMsg("Passwort erfolgreich geändert. Bitte melde dich erneut an.");
      setOldPw(""); setNewPw(""); setNewPw2("");
      setTimeout(() => {
        pb.authStore.clear();
        window.location.reload();
      }, 2000);
    } catch (err) {
      const msg = err?.data?.data?.oldPassword?.message || err?.data?.message || "";
      if (msg.toLowerCase().includes("old")) {
        setPwError("Das aktuelle Passwort ist falsch.");
      } else {
        setPwError("Passwort konnte nicht geändert werden. Bitte versuche es erneut.");
      }
    }
    setPwLoading(false);
  }

  if (!loggedIn) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-2xl mx-auto w-full flex flex-col items-center justify-center gap-4">
        <User size={40} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">Kein Zugang</h2>
        <p className="text-gray-500 text-sm text-center">Bitte melde dich an, um dein Profil zu sehen.</p>
      </section>
    );
  }

  const initials = (pb.authStore.record?.name || userEmail || "?")[0].toUpperCase();
  const hasNewFile = !!avatarRef.current?.files?.[0];

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Mein Profil</h2>
      <p className="text-gray-500 text-base mb-6">Deine persönlichen Einstellungen.</p>

      {/* Quick nav links */}
      <div className="flex flex-wrap gap-3 mb-8">
        <Link to="/dashboard"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors"
          style={{ textDecoration: "none" }}>
          <LayoutDashboard size={15} /> Übersicht
        </Link>
        <Link to="/merkliste"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors"
          style={{ textDecoration: "none" }}>
          <Heart size={15} /> Merkliste
        </Link>
        <Link to="/inbox"
          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl text-sm transition-colors"
          style={{ textDecoration: "none" }}>
          <MessageCircle size={15} /> Meine Chats
        </Link>
      </div>

      {/* Avatar */}
      <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 mb-6">
        <div className="flex items-center gap-5 flex-wrap">
          {/* Avatar circle */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-900 flex items-center justify-center">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Profilbild" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-extrabold text-2xl">{initials}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#ff8a00] text-white rounded-full flex items-center justify-center shadow hover:bg-[#e67a00] transition-colors"
              title="Bild ändern"
            >
              <Camera size={13} />
            </button>
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleAvatarPick}
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-900 mb-0.5">{pb.authStore.record?.name || userEmail}</div>
            <div className="text-xs text-gray-500 flex items-center gap-2">
              {roleLabel(userRole)}
              {verified
                ? <span className="flex items-center gap-0.5 text-green-600"><Check size={11} strokeWidth={3} /> Bestätigt</span>
                : <span className="text-amber-600">E-Mail nicht bestätigt</span>}
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button
                type="button"
                onClick={() => avatarRef.current?.click()}
                className="text-xs px-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium"
              >
                Bild auswählen
              </button>
              {avatarPreview && (
                <button
                  type="button"
                  onClick={handleAvatarRemove}
                  disabled={avatarLoading}
                  className="text-xs px-3 py-1.5 border border-red-100 rounded-lg hover:bg-red-50 transition-colors text-red-600 font-medium disabled:opacity-50"
                >
                  Entfernen
                </button>
              )}
              {avatarRef.current?.files?.[0] && (
                <button
                  type="button"
                  onClick={handleAvatarSave}
                  disabled={avatarLoading}
                  className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors font-bold disabled:opacity-50"
                >
                  {avatarLoading ? "Wird gespeichert…" : "Speichern"}
                </button>
              )}
            </div>
            {avatarMsg && <p className="text-green-600 text-xs mt-2">{avatarMsg}</p>}
            {avatarError && <p className="text-red-600 text-xs mt-2">{avatarError}</p>}
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="border border-gray-100 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={16} /> Anzeigename
        </h3>
        <form onSubmit={handleNameSave} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Dein Anzeigename (optional)"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={60}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors"
          />
          {nameError && <p className="text-red-600 text-xs">{nameError}</p>}
          {nameMsg && <p className="text-green-600 text-xs">{nameMsg}</p>}
          <button type="submit" disabled={nameLoading}
            className="self-start px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors disabled:opacity-60">
            {nameLoading ? "Wird gespeichert…" : "Name speichern"}
          </button>
        </form>
      </div>

      {/* Nutzertyp */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          Art der Nutzung
        </h3>
        <p className="text-xs text-gray-400 mb-4">Wird auf deinen Anzeigen angezeigt, damit andere sofort sehen, ob du privat oder gewerblich tätig bist.</p>
        <div className="flex gap-3">
          {["privat", "gewerblich"].map(typ => (
            <button
              key={typ}
              type="button"
              onClick={async () => {
                setNutzertypLoading(true);
                setNutzertypMsg("");
                try {
                  await pb.collection("users").update(userId, { nutzertyp: typ });
                  setNutzertyp(typ);
                  setNutzertypMsg("Gespeichert.");
                  setTimeout(() => setNutzertypMsg(""), 2000);
                } catch { setNutzertypMsg("Konnte nicht gespeichert werden."); }
                setNutzertypLoading(false);
              }}
              disabled={nutzertypLoading}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${
                nutzertyp === typ
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {typ === "privat" ? "👤 Privat" : "🏢 Gewerblich"}
            </button>
          ))}
        </div>
        {nutzertypMsg && <p className="text-green-600 text-xs mt-2">{nutzertypMsg}</p>}
      </div>

      {/* E-Mail-Benachrichtigungen */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
          <span>📧</span> E-Mail-Benachrichtigungen
        </h3>
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-amber-700 leading-relaxed">
            <span className="font-semibold">Hinweis:</span> Ohne E-Mail-Benachrichtigungen wirst du über neue Chats nur informiert, wenn die Website oder App geöffnet ist. Alternativ erhältst du bei installierter App eine Push-Benachrichtigung.
          </p>
        </div>
        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
          Wenn du eine neue Nachricht im Chat erhältst, schicken wir dir eine E-Mail-Benachrichtigung.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">
            {emailNotifications ? "Eingeschaltet" : "Ausgeschaltet"}
          </span>
          <button
            onClick={async () => {
              const newVal = !emailNotifications;
              try {
                await pb.collection("users").update(userId, { email_notifications: newVal });
                setEmailNotifications(newVal);
              } catch {}
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${emailNotifications ? "bg-[#ff8a00]" : "bg-gray-300"}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${emailNotifications ? "translate-x-7" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      {/* Password change */}
      <div className="border border-gray-100 rounded-2xl p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Lock size={16} /> Passwort ändern
        </h3>
        <form onSubmit={handlePasswordChange} className="flex flex-col gap-3">
          <input
            type="password"
            placeholder="Aktuelles Passwort"
            value={oldPw}
            onChange={e => setOldPw(e.target.value)}
            autoComplete="current-password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors"
          />
          <input
            type="password"
            placeholder="Neues Passwort (min. 8 Zeichen)"
            value={newPw}
            onChange={e => setNewPw(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors"
          />
          <input
            type="password"
            placeholder="Neues Passwort wiederholen"
            value={newPw2}
            onChange={e => setNewPw2(e.target.value)}
            autoComplete="new-password"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 transition-colors"
          />
          {pwError && <p className="text-red-600 text-xs">{pwError}</p>}
          {pwMsg && <p className="text-green-600 text-xs">{pwMsg}</p>}
          <button type="submit" disabled={pwLoading || !oldPw || !newPw || !newPw2}
            className="self-start px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl text-sm hover:bg-gray-700 transition-colors disabled:opacity-60">
            {pwLoading ? "Wird gespeichert…" : "Passwort ändern"}
          </button>
        </form>
      </div>
    </section>
  );
}
