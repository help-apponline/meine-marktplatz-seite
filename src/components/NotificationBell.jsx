import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { pb } from "../lib/pb.js";
import { loadUnreadNotifications, markRead, markAllRead } from "../lib/notifications.js";
import { useAuth } from "../context/AuthContext.jsx";
import Bell from "icon:bell";
import X from "icon:x";

export default function NotificationBell() {
  const { loggedIn, userId } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  async function refresh() {
    if (!loggedIn) return;
    const items = await loadUnreadNotifications();
    setNotifications(items);
  }

  useEffect(() => {
    if (!loggedIn) { setNotifications([]); return; }
    refresh();

    // Real-time subscription for new notifications
    let unsub = null;
    pb.collection("notifications").subscribe("*", (e) => {
      if (e.action === "create" && e.record.user === userId) {
        setNotifications(prev => [e.record, ...prev]);
      }
      if (e.action === "update" && e.record.read) {
        setNotifications(prev => prev.filter(n => n.id !== e.record.id));
      }
    }).then(fn => { unsub = fn; }).catch(() => {});

    return () => { if (unsub) pb.collection("notifications").unsubscribe("*").catch(() => {}); };
  }, [loggedIn, userId]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  async function handleMarkAll() {
    await markAllRead(notifications);
    setNotifications([]);
    setOpen(false);
  }

  async function handleMarkOne(id) {
    await markRead(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  }

  if (!loggedIn) return null;

  const count = notifications.length;

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-white/70 hover:text-white transition-colors rounded-lg hover:bg-white/10"
        aria-label="Benachrichtigungen"
      >
        <Bell size={18} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#ff8a00] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="font-bold text-gray-900 text-sm">Benachrichtigungen</span>
            <div className="flex items-center gap-2">
              {count > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">
                  Alle gelesen
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>
          </div>

          {count === 0 ? (
            <div className="px-4 py-6 text-center text-gray-400 text-sm">
              Keine neuen Benachrichtigungen
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
              {notifications.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group">
                  <div className="flex-1 min-w-0">
                    {n.link ? (
                      <Link
                        to={n.link}
                        onClick={() => { handleMarkOne(n.id); setOpen(false); }}
                        className="font-semibold text-gray-900 text-sm block truncate hover:text-[#ff8a00] transition-colors"
                        style={{ textDecoration: "none" }}
                      >
                        {n.title}
                      </Link>
                    ) : (
                      <span className="font-semibold text-gray-900 text-sm block truncate">{n.title}</span>
                    )}
                    {n.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>}
                    <p className="text-[11px] text-gray-400 mt-1">
                      {new Date(n.created).toLocaleString("de-DE")}
                    </p>
                  </div>
                  <button
                    onClick={() => handleMarkOne(n.id)}
                    className="shrink-0 p-1 text-gray-300 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
                    title="Als gelesen markieren"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
