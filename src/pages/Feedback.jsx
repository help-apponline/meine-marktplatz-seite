import { useState } from "react";
import PartnerBanner from "../components/PartnerBanner.jsx";

const TOPICS = [
  { value: "funktion", emoji: "💡", label: "Funktion vorschlagen" },
  { value: "fehler", emoji: "🐞", label: "Fehler melden" },
  { value: "feedback", emoji: "⭐", label: "Feedback zur App geben" },
  { value: "wunsch", emoji: "❤️", label: "Wünsche für zukünftige Funktionen" },
  { value: "missbrauch", emoji: "🚨", label: "Missbrauch oder Sicherheitsproblem melden" },
];

export default function Feedback() {
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!topic) { setError("Bitte wähle ein Thema aus."); return; }
    if (!message.trim()) { setError("Bitte schreib eine Nachricht."); return; }
    setError("");
    setLoading(true);

    const selectedTopic = TOPICS.find(t => t.value === topic);
    const body = `Thema: ${selectedTopic?.emoji} ${selectedTopic?.label}\n\nNachricht:\n${message}${email ? `\n\nAntwort-E-Mail: ${email}` : ""}`;

    try {
      const res = await fetch(`mailto:feedback@help-app.online`);
      // mailto fallback — open mail client
    } catch {}

    // Use mailto as primary method
    const subject = encodeURIComponent(`[help-app.online] ${selectedTopic?.emoji} ${selectedTopic?.label}`);
    const mailBody = encodeURIComponent(body);
    window.location.href = `mailto:feedback@help-app.online?subject=${subject}&body=${mailBody}`;

    setSent(true);
    setLoading(false);
  }

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Kontakt, Feedback & Verbesserungen</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Deine Meinung hilft uns, help-app.online besser zu machen. Schreib uns — wir lesen jede Nachricht.
          </p>
        </div>

        {sent ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <div className="text-5xl mb-4">🙌</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Vielen Dank!</h2>
            <p className="text-gray-500 text-sm mb-6">Dein E-Mail-Programm sollte sich geöffnet haben. Falls nicht, schreib uns direkt an <a href="mailto:feedback@help-app.online" className="text-[#ff8a00] underline">feedback@help-app.online</a>.</p>
            <button
              onClick={() => { setSent(false); setTopic(""); setMessage(""); setEmail(""); }}
              className="px-6 py-2 bg-[#ff8a00] hover:bg-[#e67a00] text-white font-semibold rounded-xl transition-colors text-sm"
            >
              Weitere Nachricht senden
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6">

            {/* Thema wählen */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Worum geht es?</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TOPICS.map(t => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTopic(t.value)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium text-left transition-all ${
                      topic === t.value
                        ? "bg-[#fff4e6] border-[#ff8a00] text-[#ff8a00]"
                        : "bg-gray-50 border-gray-200 text-gray-700 hover:border-[#ff8a00] hover:bg-[#fff8f0]"
                    }`}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Nachricht */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">Deine Nachricht</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={5}
                placeholder="Beschreibe dein Anliegen so genau wie möglich …"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#ff8a00] focus:ring-1 focus:ring-[#ff8a00] resize-none transition-colors"
              />
            </div>

            {/* Optional E-Mail */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Deine E-Mail <span className="text-gray-400 font-normal">(optional — falls wir antworten sollen)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.de"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-[#ff8a00] focus:ring-1 focus:ring-[#ff8a00] transition-colors"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#ff8a00] hover:bg-[#e67a00] disabled:opacity-50 text-white font-bold rounded-xl transition-colors text-sm"
            >
              {loading ? "Wird gesendet …" : "Nachricht senden"}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Deine Nachricht wird an <span className="text-gray-600">feedback@help-app.online</span> gesendet.
            </p>
          </form>
        )}

        <div className="mt-10">
          <PartnerBanner />
        </div>
      </div>
    </section>
  );
}
