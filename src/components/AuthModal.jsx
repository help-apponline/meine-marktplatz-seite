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
      err = login(email.trim().toLowerCase(), pw);
    } else {
      err = register(email.trim().toLowerCase(), pw, pw2, role);
    }
    setLoading(false);
    if (err) { setError(err); return; }
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm"
          />
          <input
            type="password"
            placeholder="Passwort"
            value={pw}
            onChange={e => setPw(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm"
          />
          {mode === "register" && (
            <>
              <input
                type="password"
                placeholder="Passwort wiederholen"
                value={pw2}
                onChange={e => setPw2(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm"
              />
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:border-gray-800 transition-colors text-sm bg-white"
              >
                <option value="customer">Auftraggeber (suche Hilfe)</option>
                <option value="helper">Helfer (biete Hilfe)</option>
              </select>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-gray-700 transition-colors disabled:opacity-60 mt-1"
          >
            {loading ? "Bitte warten…" : mode === "login" ? "Anmelden" : "Registrieren"}
          </button>

          <button
            type="button"
            onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors text-center pt-1"
          >
            {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon ein Konto? Anmelden"}
          </button>
        </form>

        {mode === "login" && (
          <p className="mt-4 text-xs text-gray-400 text-center">
            Demo: demo@helpapp.local / demo1234
          </p>
        )}
      </div>
    </div>
  );
}
