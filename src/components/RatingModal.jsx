import { useState } from "react";
import { pb } from "../lib/pb.js";
import Star from "icon:star";
import X from "icon:x";

export default function RatingModal({ chatId, rateeId, rateeLabel, onClose, onDone }) {
  const [stars, setStars] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (stars === 0) { setError("Bitte wähle eine Stern-Bewertung."); return; }
    setSaving(true);
    setError("");
    try {
      await pb.collection("ratings").create({
        chat: chatId,
        rater: pb.authStore.record?.id,
        ratee: rateeId,
        stars,
        comment: comment.trim(),
      });
      onDone?.();
    } catch (e) {
      // Unique constraint violation → already rated
      const msg = e?.response?.message || e?.message || "";
      if (msg.toLowerCase().includes("unique") || e?.status === 400) {
        setError("Du hast diesen Auftrag bereits bewertet.");
      } else {
        setError("Bewertung konnte nicht gespeichert werden. Bitte versuche es erneut.");
      }
    }
    setSaving(false);
  }

  const display = hovered || stars;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-extrabold text-gray-900">Bewertung abgeben</h3>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {rateeLabel && (
          <p className="text-gray-500 text-sm mb-5">
            Wie war deine Erfahrung mit <span className="font-semibold text-gray-800">{rateeLabel}</span>?
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Stars */}
          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2">Deine Bewertung <span className="text-red-400">*</span></p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onMouseEnter={() => setHovered(n)}
                  onMouseLeave={() => setHovered(0)}
                  onClick={() => { setStars(n); setError(""); }}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  aria-label={`${n} Stern${n > 1 ? "e" : ""}`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="32"
                    height="32"
                    fill={n <= display ? "#ff8a00" : "none"}
                    stroke={n <= display ? "#ff8a00" : "#d1d5db"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              ))}
            </div>
            {stars > 0 && (
              <p className="text-xs text-gray-400 mt-1.5">
                {["", "Schlecht", "Ausbaufähig", "Okay", "Gut", "Ausgezeichnet"][stars]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kommentar <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Was hat besonders gut geklappt?"
              rows={3}
              maxLength={500}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 resize-none transition-colors"
            />
            <p className="text-[11px] text-gray-400 text-right mt-0.5">{comment.length}/500</p>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{error}</p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-600 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={saving || stars === 0}
              className="flex-1 px-4 py-2.5 bg-[#ff8a00] text-white font-bold rounded-xl text-sm hover:bg-[#e67a00] transition-colors disabled:opacity-50"
            >
              {saving ? "Wird gespeichert…" : "Bewertung abschicken"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
