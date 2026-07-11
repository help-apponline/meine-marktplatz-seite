import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import X from "icon:x";

export default function AuthModal({ onClose, hint = "" }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState(hint || "");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    let err;
    if (mode === "login") {
      err = await login(email.trim().toLowerCase(), pw);
    } else {
      err = await register(email.trim().toLowerCase(), pw, pw2, role);
    }
    setLoading(false);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[480px] bg-white rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {mode === "login" ? "Anmelden" : "Registrieren"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input type="email" placeholder="E-Mail" value={email} onChange={e => setEmail(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm" />
          <input type="password" placeholder="Passwort" value={pw} onChange={e => setPw(e.target.value)} required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm" />

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
            </>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 mt-1">
            {loading ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Registrieren"}
          </button>

          <button type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center pt-1">
            {mode === "login" ? "Noch kein Konto? Jetzt registrieren" : "Schon ein Konto? Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}
