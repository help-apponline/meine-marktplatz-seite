import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import Send from "icon:send";

export default function Chat() {
  const { chatId } = useParams();
  const { loggedIn, userId, getChat, loadMessages, sendMessage } = useAuth();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!loggedIn || !chatId) return;
    let unsub = null;

    async function init() {
      const [chat, msgs] = await Promise.all([getChat(chatId), loadMessages(chatId)]);
      setChatMeta(chat);
      setMessages(msgs);
      setLoading(false);
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });

      // Real-time subscription
      try {
        unsub = await pb.collection("messages").subscribe(`*`, (e) => {
          if (e.record.chat !== chatId) return;
          if (e.action === "create") {
            setMessages(prev => {
              if (prev.find(m => m.id === e.record.id)) return prev;
              return [...prev, e.record];
            });
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
          }
        });
      } catch {}
    }

    init().catch(() => setLoading(false));

    return () => { if (unsub) pb.collection("messages").unsubscribe("*").catch(() => {}); };
  }, [chatId, loggedIn]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t || !loggedIn || sending) return;
    setSending(true);
    setText("");
    try {
      await sendMessage(chatId, t);
      const msgs = await loadMessages(chatId);
      setMessages(msgs);
    } catch {}
    setSending(false);
  }

  if (!loggedIn) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <p className="text-gray-500">Bitte{" "}
          <button onClick={() => window.__helpAppRequireLogin?.("Bitte anmelden, um zu chatten.")}
            className="underline text-gray-700 bg-transparent border-none p-0 cursor-pointer">
            anmelden
          </button>
          , um zu chatten.
        </p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      </section>
    );
  }

  if (!chatMeta) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <p className="text-gray-500 mb-4">Chat nicht gefunden.</p>
        <Link to="/inbox" className="text-sm text-gray-500 hover:text-gray-900 underline">← Zur Inbox</Link>
      </section>
    );
  }

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-10 max-w-4xl mx-auto w-full flex flex-col">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{chatMeta.ad_title || "Chat"}</h2>
      <p className="text-gray-400 text-sm mb-6">Unterhaltung</p>

      <div className="flex flex-col gap-3 flex-1 max-h-[55vh] overflow-y-auto mb-4 pr-1">
        {messages.map(m => {
          const senderId = m.sender?.id || m.sender;
          const isMe = senderId === userId;
          const senderEmail = m.expand?.sender?.email || m.sender;
          return (
            <div key={m.id} className={`flex gap-2 items-end ${isMe ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                isMe ? "bg-[#fff7ed] border border-[#ffd9b0] text-gray-800" : "bg-white border border-gray-200 text-gray-800"
              }`}>
                <p>{m.text}</p>
                <p className="text-[11px] text-gray-400 mt-1">
                  {isMe ? "Du" : senderEmail} · {new Date(m.created).toLocaleString("de-DE")}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-3 items-start flex-wrap mt-auto">
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Nachricht schreiben…"
          rows={2}
          className="flex-1 min-w-[200px] px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gray-700 resize-y transition-colors"
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
        />
        <button type="submit" disabled={sending}
          className="flex items-center gap-2 px-5 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors text-sm shrink-0 disabled:opacity-60">
          <Send size={16} />
          Senden
        </button>
        <Link to="/inbox" className="px-5 py-3 border border-gray-200 text-gray-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors text-sm shrink-0" style={{ textDecoration: "none" }}>
          ← Inbox
        </Link>
      </form>
    </section>
  );
}
