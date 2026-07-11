import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import User from "icon:user";
import Lock from "icon:lock";
import Check from "icon:check";

export default function Profil() {
  const { loggedIn, userEmail, userRole, userId, verified } = useAuth();

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

  function roleLabel(r) {
    return r === "helper" ? "Auftragnehmer" : "Auftraggeber";
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
      // Re-auth after password change
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

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-12 max-w-2xl mx-auto w-full">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Mein Profil</h2>
      <p className="text-gray-500 text-base mb-8">Deine persönlichen Einstellungen.</p>

      {/* Account info */}
      <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center font-bold text-base shrink-0">
            {userEmail?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <div className="font-bold text-gray-900">{userEmail}</div>
            <div className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
              {roleLabel(userRole)}
              {verified
                ? <span className="flex items-center gap-0.5 text-green-600"><Check size={11} strokeWidth={3} /> Bestätigt</span>
                : <span className="text-amber-600">E-Mail nicht bestätigt</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Name */}
      <div className="border border-gray-100 rounded-2xl p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <User size={16} /> Name anzeigen
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
