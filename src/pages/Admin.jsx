import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { pb } from "../lib/pb.js";
import { loadPageviewStats } from "../lib/pageviews.js";
import Shield from "icon:shield";
import Trash2 from "icon:trash-2";
import Flag from "icon:flag";
import Eye from "icon:eye";
import UserX from "icon:user-x";
import UserCheck from "icon:user-check";
import RefreshCw from "icon:refresh-cw";
import BarChart2 from "icon:bar-chart-2";

export default function Admin() {
  const { loggedIn, userId } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState("ads");

  // Ads state
  const [ads, setAds] = useState([]);
  const [adsLoading, setAdsLoading] = useState(false);
  const [adsFilter, setAdsFilter] = useState("all");

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Stats state
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  // Toast
  const [toast, setToast] = useState("");

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  // Check admin status
  useEffect(() => {
    if (!loggedIn || !userId) { setChecking(false); return; }
    pb.collection("users").getOne(userId)
      .then(u => { setIsAdmin(!!u.is_admin); setChecking(false); })
      .catch(() => setChecking(false));
  }, [loggedIn, userId]);

  // Load ads
  useEffect(() => {
    if (!isAdmin || tab !== "ads") return;
    setAdsLoading(true);
    const filter = adsFilter === "flagged" ? 'flagged = true' : adsFilter === "deleted" ? 'status = "geloescht"' : "";
    pb.collection("ads").getList(1, 200, { sort: "-created", filter, expand: "owner" })
      .then(r => { setAds(r.items); setAdsLoading(false); })
      .catch(() => setAdsLoading(false));
  }, [isAdmin, tab, adsFilter]);

  // Load users
  useEffect(() => {
    if (!isAdmin || tab !== "users") return;
    setUsersLoading(true);
    pb.collection("users").getList(1, 200, { sort: "-created" })
      .then(r => { setUsers(r.items); setUsersLoading(false); })
      .catch(() => setUsersLoading(false));
  }, [isAdmin, tab]);

  // Load stats
  useEffect(() => {
    if (!isAdmin || tab !== "stats") return;
    setStatsLoading(true);
    loadPageviewStats().then(s => { setStats(s); setStatsLoading(false); });
  }, [isAdmin, tab]);

  async function deleteAd(id) {
    if (!confirm("Anzeige wirklich löschen?")) return;
    try {
      await pb.collection("ads").update(id, { status: "geloescht" });
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: "geloescht" } : a));
      showToast("Anzeige gelöscht.");
    } catch { showToast("Fehler beim Löschen."); }
  }

  async function unflagAd(id) {
    try {
      await pb.collection("ads").update(id, { flagged: false });
      setAds(prev => prev.map(a => a.id === id ? { ...a, flagged: false } : a));
      showToast("Markierung entfernt.");
    } catch { showToast("Fehler."); }
  }

  async function restoreAd(id) {
    try {
      await pb.collection("ads").update(id, { status: "offen" });
      setAds(prev => prev.map(a => a.id === id ? { ...a, status: "offen" } : a));
      showToast("Anzeige wiederhergestellt.");
    } catch { showToast("Fehler."); }
  }

  async function toggleBlock(user) {
    const newVal = !user.blocked;
    try {
      await pb.collection("users").update(user.id, { blocked: newVal });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, blocked: newVal } : u));
      showToast(newVal ? "Nutzer gesperrt." : "Sperre aufgehoben.");
    } catch { showToast("Fehler."); }
  }

  async function toggleAdmin(user) {
    const newVal = !user.is_admin;
    try {
      await pb.collection("users").update(user.id, { is_admin: newVal });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, is_admin: newVal } : u));
      showToast(newVal ? "Admin-Rechte vergeben." : "Admin-Rechte entzogen.");
    } catch { showToast("Fehler."); }
  }

  if (checking) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full">
        <p className="text-gray-400 text-sm">Wird geladen…</p>
      </section>
    );
  }

  if (!loggedIn || !isAdmin) {
    return (
      <section className="bg-white min-h-screen px-5 py-12 max-w-5xl mx-auto w-full flex flex-col items-center justify-center gap-4">
        <Shield size={40} className="text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900">Kein Zugang</h2>
        <p className="text-gray-500 text-sm text-center">Dieser Bereich ist nur für Administratoren zugänglich.</p>
      </section>
    );
  }

  const flaggedCount = ads.filter(a => a.flagged).length;

  return (
    <section className="bg-white min-h-screen px-5 md:px-10 py-10 max-w-6xl mx-auto w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Shield size={24} className="text-gray-900" />
        <h2 className="text-2xl font-extrabold text-gray-900">Admin-Bereich</h2>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Alle Anzeigen", value: ads.length },
          { label: "Gemeldet", value: flaggedCount, warn: flaggedCount > 0 },
          { label: "Nutzer", value: users.length },
          { label: "Gesperrt", value: users.filter(u => u.blocked).length },
        ].map(({ label, value, warn }) => (
          <div key={label} className={`rounded-xl px-4 py-4 border ${warn ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-100"}`}>
            <div className={`text-2xl font-extrabold ${warn ? "text-red-700" : "text-gray-900"}`}>{value}</div>
            <div className={`text-xs mt-0.5 ${warn ? "text-red-600" : "text-gray-500"}`}>{label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-100 pb-1">
        {[
          { key: "ads", label: "Anzeigen" },
          { key: "users", label: "Nutzer" },
          { key: "stats", label: "Besucher" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
              tab === key ? "bg-gray-900 text-white" : "text-gray-500 hover:text-gray-900"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Ads tab */}
      {tab === "ads" && (
        <div>
          <div className="flex gap-2 mb-5 flex-wrap">
            {[
              { val: "all", label: "Alle" },
              { val: "flagged", label: `Gemeldet ${flaggedCount > 0 ? `(${flaggedCount})` : ""}` },
              { val: "deleted", label: "Gelöscht" },
            ].map(({ val, label }) => (
              <button key={val} onClick={() => setAdsFilter(val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                  adsFilter === val ? "bg-gray-900 text-white border-gray-900" : "border-gray-200 text-gray-600 hover:border-gray-400"
                }`}>
                {label}
              </button>
            ))}
            <button onClick={() => { setAdsLoading(true); pb.collection("ads").getList(1, 200, { sort: "-created", expand: "owner" }).then(r => { setAds(r.items); setAdsLoading(false); }); }}
              className="ml-auto p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>

          {adsLoading ? (
            <p className="text-gray-400 text-sm">Wird geladen…</p>
          ) : ads.length === 0 ? (
            <p className="text-gray-400 text-sm">Keine Anzeigen in dieser Ansicht.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {ads.map(ad => (
                <div key={ad.id} className={`rounded-xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                  ad.flagged ? "border-red-200 bg-red-50" : ad.status === "geloescht" ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-100 bg-white"
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{ad.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {ad.city || "—"} · {ad.role === "helper" ? "Auftragnehmer" : "Auftraggeber"} ·{" "}
                      {ad.expand?.owner?.email || "unbekannt"} ·{" "}
                      {new Date(ad.created).toLocaleDateString("de-DE")}
                    </div>
                    {ad.desc && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ad.desc}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {ad.flagged && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                        <Flag size={11} /> Gemeldet
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      ad.status === "offen" ? "bg-green-100 text-green-700"
                      : ad.status === "geloescht" ? "bg-gray-100 text-gray-500"
                      : "bg-yellow-100 text-yellow-700"
                    }`}>{ad.status}</span>
                    {ad.flagged && (
                      <button onClick={() => unflagAd(ad.id)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors" title="Meldung aufheben">
                        <Eye size={15} />
                      </button>
                    )}
                    {ad.status !== "geloescht" && (
                      <button onClick={() => deleteAd(ad.id)}
                        className="p-1.5 text-red-400 hover:text-red-700 transition-colors" title="Löschen">
                        <Trash2 size={15} />
                      </button>
                    )}
                    {ad.status === "geloescht" && (
                      <button onClick={() => restoreAd(ad.id)}
                        className="p-1.5 text-green-500 hover:text-green-700 transition-colors" title="Wiederherstellen">
                        <RefreshCw size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users tab */}
      {tab === "users" && (
        <div>
          <div className="flex justify-end mb-5">
            <button onClick={() => { setUsersLoading(true); pb.collection("users").getList(1, 200, { sort: "-created" }).then(r => { setUsers(r.items); setUsersLoading(false); }); }}
              className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors">
              <RefreshCw size={14} />
            </button>
          </div>

          {usersLoading ? (
            <p className="text-gray-400 text-sm">Wird geladen…</p>
          ) : users.length === 0 ? (
            <p className="text-gray-400 text-sm">Noch keine Nutzer registriert.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {users.map(u => (
                <div key={u.id} className={`rounded-xl border px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 ${
                  u.blocked ? "border-red-100 bg-red-50 opacity-70" : "border-gray-100 bg-white"
                }`}>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 truncate">{u.email}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {u.role === "helper" ? "Auftragnehmer" : "Auftraggeber"} ·{" "}
                      {u.verified ? "✓ Bestätigt" : "✗ Nicht bestätigt"} ·{" "}
                      {new Date(u.created).toLocaleDateString("de-DE")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {u.is_admin && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-900 text-white">Admin</span>
                    )}
                    {u.blocked && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-red-100 text-red-700">Gesperrt</span>
                    )}
                    {/* Don't allow blocking yourself */}
                    {u.id !== userId && (
                      <button onClick={() => toggleBlock(u)}
                        className={`p-1.5 transition-colors ${u.blocked ? "text-green-500 hover:text-green-700" : "text-red-400 hover:text-red-700"}`}
                        title={u.blocked ? "Sperre aufheben" : "Nutzer sperren"}>
                        {u.blocked ? <UserCheck size={16} /> : <UserX size={16} />}
                      </button>
                    )}
                    {u.id !== userId && (
                      <button onClick={() => toggleAdmin(u)}
                        className="p-1.5 text-gray-400 hover:text-gray-700 transition-colors"
                        title={u.is_admin ? "Admin-Rechte entziehen" : "Admin-Rechte vergeben"}>
                        <Shield size={15} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Stats tab */}
      {tab === "stats" && (
        <div>
          {statsLoading ? (
            <p className="text-gray-400 text-sm">Wird geladen…</p>
          ) : !stats ? null : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5">
                  <div className="text-xs text-gray-400 mb-1">Gesamte Seitenaufrufe</div>
                  <div className="text-3xl font-extrabold text-gray-900">{stats.totalViews.toLocaleString("de-DE")}</div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5">
                  <div className="text-xs text-gray-400 mb-1">Aufrufe heute</div>
                  <div className="text-3xl font-extrabold text-gray-900">
                    {(stats.last30[stats.last30.length - 1]?.count || 0).toLocaleString("de-DE")}
                  </div>
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl px-5 py-5">
                  <div className="text-xs text-gray-400 mb-1">Ø pro Tag (30 Tage)</div>
                  <div className="text-3xl font-extrabold text-gray-900">
                    {Math.round(stats.last30.reduce((s, d) => s + d.count, 0) / 30).toLocaleString("de-DE")}
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-2xl p-5 mb-6">
                <h4 className="font-bold text-gray-800 mb-4 text-sm flex items-center gap-2">
                  <BarChart2 size={15} /> Letzte 30 Tage
                </h4>
                {(() => {
                  const maxVal = Math.max(...stats.last30.map(d => d.count), 1);
                  return (
                    <div className="flex items-end gap-0.5 h-24 mb-5">
                      {stats.last30.map((d, i) => (
                        <div key={i} className="flex-1 flex flex-col items-end group relative" title={`${d.day}: ${d.count}`}>
                          <div
                            className="w-full bg-[#ff8a00]/70 rounded-sm group-hover:bg-[#ff8a00] transition-colors"
                            style={{ height: `${Math.max(2, Math.round((d.count / maxVal) * 96))}px` }}
                          />
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {stats.perPage.length > 0 && (
                <div className="border border-gray-100 rounded-2xl p-5">
                  <h4 className="font-bold text-gray-800 mb-4 text-sm">Beliebteste Seiten</h4>
                  <div className="flex flex-col gap-2">
                    {stats.perPage.slice(0, 10).map(({ page, count }) => {
                      const maxP = stats.perPage[0].count;
                      const pct = Math.round((count / maxP) * 100);
                      return (
                        <div key={page} className="flex items-center gap-3">
                          <div className="w-28 text-xs text-gray-600 truncate shrink-0">{page || "/"}</div>
                          <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div className="h-2 bg-[#ff8a00] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="text-xs text-gray-500 w-12 text-right shrink-0">{count.toLocaleString("de-DE")}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white text-sm rounded-xl px-4 py-3 shadow-xl">
          {toast}
        </div>
      )}
    </section>
  );
}
