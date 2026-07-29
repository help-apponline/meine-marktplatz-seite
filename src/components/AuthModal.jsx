import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import X from "icon:x";

// mode prop: "login" | "register" | "forgot"
export default function AuthModal({ onClose, hint = "", initialMode = "login" }) {
  const { login, register, resendVerification, requestPasswordReset } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [role, setRole] = useState("customer");
  const [emailConsent, setEmailConsent] = useState(true);
  const [error, setError] = useState(hint || "");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (mode === "forgot") {
      await requestPasswordReset(email.trim().toLowerCase());
      setLoading(false);
      setSuccess("Falls diese Adresse registriert ist, hast du in Kürze eine E-Mail mit dem Link zum Zurücksetzen.");
      return;
    }

    let err;
    if (mode === "login") {
      err = await login(email.trim().toLowerCase(), pw);
      setLoading(false);
      if (err) { setError(err); return; }
      onClose();
    } else {
      err = await register(email.trim().toLowerCase(), pw, pw2, role, emailConsent);
      setLoading(false);
      if (err) { setError(err); return; }
      // After register: show verification notice instead of closing immediately
      setMode("registered");
    }
  }

  const titles = { login: "Anmelden", register: "Registrieren", forgot: "Passwort zurücksetzen", registered: "Fast geschafft!" };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">{titles[mode]}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{success}</div>
        )}

        {mode === "registered" && (
          <div className="flex flex-col gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-green-800 text-sm leading-relaxed">
              <strong>Konto erstellt!</strong> Wir haben dir eine Bestätigungs-E-Mail an <strong>{email}</strong> geschickt. Bitte klicke auf den Link darin, um deine Adresse zu bestätigen.
            </div>
            <p className="text-xs text-gray-500">Du kannst die App schon nutzen und Anzeigen anschauen — zum Aufgeben von Anzeigen und Kontaktieren brauchst du die Bestätigung.</p>
            <button onClick={onClose}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors">
              Verstanden, weiter
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={mode === "registered" ? "hidden" : "flex flex-col gap-3"}>
          <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm" />

          {mode !== "forgot" && (
            <input type="password" placeholder="Passwort" value={pw} onChange={e => setPw(e.target.value)} required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm" />
          )}

          {mode === "register" && (
            <>
              <input type="password" placeholder="Passwort wiederholen" value={pw2} onChange={e => setPw2(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm" />
              <div>
                <p className="text-xs text-gray-500 mb-2 font-medium">Ich bin:</p>
                <div className="flex gap-3">
                  {[
                    { val: "customer", label: "Auftraggeber", sub: "Ich suche Hilfe" },
                    { val: "helper", label: "Auftragnehmer", sub: "Ich biete Hilfe an" },
                  ].map(({ val, label, sub }) => (
                    <button key={val} type="button" onClick={() => setRole(val)}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                        role === val ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                      }`}>
                      {label}
                      <span className={`block text-xs mt-0.5 font-normal ${role === val ? "text-white/70" : "text-gray-400"}`}>{sub}</span>
                    </button>
                  ))}
                </div>
              </div>
              {/* E-Mail-Benachrichtigungen Einwilligung */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="mt-0.5 shrink-0">
                  <input
                    type="checkbox"
                    checked={emailConsent}
                    onChange={e => setEmailConsent(e.target.checked)}
                    className="w-4 h-4 accent-[#ff8a00] cursor-pointer"
                  />
                </div>
                <span className="text-xs text-gray-500 leading-relaxed">
                  Ich möchte E-Mail-Benachrichtigungen erhalten, wenn ich neue Chat-Nachrichten bekomme.
                  <span className="block text-gray-400 mt-0.5">Ohne E-Mail-Benachrichtigungen wirst du über neue Chats nur informiert, wenn die Website oder App geöffnet ist. Alternativ erhältst du bei installierter App eine Push-Benachrichtigung. Du kannst diese Einstellung jederzeit in deinem Profil ändern.</span>
                </span>
              </label>
            </>
          )}

          {!success && (
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 mt-1">
              {loading ? "Bitte warten…"
                : mode === "login" ? "Anmelden"
                : mode === "register" ? "Registrieren"
                : "Link anfordern"}
            </button>
          )}

          {/* Navigation between modes */}
          <div className="flex flex-col gap-1 pt-1">
            {mode === "login" && (
              <>
                <button type="button" onClick={() => { setMode("register"); setError(""); setSuccess(""); }}
                  className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center">
                  Noch kein Konto? Jetzt registrieren
                </button>
                <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }}
                  className="text-sm text-gray-400 hover:text-gray-700 transition-colors text-center">
                  Passwort vergessen?
                </button>
              </>
            )}
            {mode === "register" && (
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center">
                Schon ein Konto? Anmelden
              </button>
            )}
            {mode === "forgot" && (
              <button type="button" onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center">
                ← Zurück zum Anmelden
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
