import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import MailCheck from "icon:mail-check";

export default function VerificationBanner() {
  const { loggedIn, verified, userEmail, resendVerification } = useAuth();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!loggedIn || verified) return null;

  async function handleResend() {
    setLoading(true);
    await resendVerification(userEmail);
    setLoading(false);
    setSent(true);
    setTimeout(() => setSent(false), 8000);
  }

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <MailCheck size={18} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-amber-800 text-sm leading-snug">
            <strong>Bitte bestätige deine E-Mail-Adresse.</strong>{" "}
            Schau in deinen Posteingang ({userEmail}) und klicke auf den Bestätigungslink.
            Einige Funktionen sind erst nach der Bestätigung verfügbar.
          </p>
        </div>
        <button
          onClick={handleResend}
          disabled={loading || sent}
          className="shrink-0 text-xs font-semibold px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          {sent ? "✓ E-Mail gesendet" : loading ? "Wird gesendet…" : "Erneut senden"}
        </button>
      </div>
    </div>
  );
}
