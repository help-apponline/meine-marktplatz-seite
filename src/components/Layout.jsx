import { useState } from "react";
import { NavLink, Outlet, Link } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";
import VerificationBanner from "./VerificationBanner.jsx";
import Menu from "icon:menu";
import X from "icon:x";

export default function Layout() {
  const { loggedIn, userEmail, userRole, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [authHint, setAuthHint] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function requireLogin(hint) {
    if (loggedIn) return true;
    setAuthHint(hint || "");
    setShowAuth(true);
    return false;
  }

  // Expose requireLogin globally so page components can use it
  if (typeof window !== "undefined") window.__helpAppRequireLogin = requireLogin;

  const navLinks = [
    { to: "/", label: "Start" },
    { to: "/angebote", label: "Angebote" },
    { to: "/gesuche", label: "Gesuche" },
    { to: "/anzeige", label: "Anzeige aufgeben" },
    { to: "/werbepartner", label: "Werbepartner" },
    { to: "/inbox", label: "Meine Chats" },
    { to: "/dashboard", label: "Übersicht" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-[#2b2b2b] text-white shadow-sm">
        <div className="flex items-center justify-between px-5 py-3.5 gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 font-extrabold tracking-tight text-white no-underline" style={{ textDecoration: "none" }}>
            <span
              className="w-2.5 h-2.5 rounded-full bg-[#ff8a00] shrink-0"
              style={{ boxShadow: "0 0 0 3px rgba(255,138,0,0.22)" }}
            />
            <span className="text-base">Help App</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-center">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `text-sm px-3 py-2 rounded-full border transition-all ${
                    isActive
                      ? "bg-[rgba(255,138,0,0.18)] border-[rgba(255,138,0,0.45)] text-white"
                      : "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
                  }`
                }
                style={{ textDecoration: "none" }}
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {loggedIn ? (
              <button
                onClick={logout}
                className="bg-[#ff8a00] text-white text-sm font-bold px-4 py-2 rounded-full border border-[#ff8a00] hover:bg-[#e67600] transition-all"
              >
                Abmelden
              </button>
            ) : (
              <button
                onClick={() => { setAuthHint(""); setShowAuth(true); }}
                className="bg-[#ff8a00] text-white text-sm font-bold px-4 py-2 rounded-full border border-[#ff8a00] hover:bg-[#e67600] transition-all"
              >
                Anmelden
              </button>
            )}
            <button
              className="lg:hidden p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Navigation"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-white/10 px-4 pb-3 pt-2 flex flex-col gap-1">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm px-3 py-2.5 rounded-xl border transition-all ${
                    isActive
                      ? "bg-[rgba(255,138,0,0.18)] border-[rgba(255,138,0,0.4)] text-white"
                      : "border-transparent text-white/85 hover:bg-white/10 hover:text-white"
                  }`
                }
                style={{ textDecoration: "none" }}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Logged-in indicator */}
        {loggedIn && (
          <div className="hidden lg:flex items-center justify-end px-5 pb-1.5 gap-2">
            <span className="text-xs text-white/50">
              {userEmail} · {userRole === "helper" ? "Helfer" : "Auftraggeber"}
            </span>
          </div>
        )}
      </header>

      {/* Verification banner */}
      <VerificationBanner />

      {/* Page content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#2b2b2b] text-[#aaa] text-sm text-center py-5">
        © 2026 Help App ·{" "}
        <Link to="/impressum" className="text-[#aaa] hover:text-white no-underline mx-1" style={{ textDecoration: "none" }}>Impressum</Link> ·{" "}
        <Link to="/datenschutz" className="text-[#aaa] hover:text-white no-underline mx-1" style={{ textDecoration: "none" }}>Datenschutz</Link> ·{" "}
        <Link to="/agb" className="text-[#aaa] hover:text-white no-underline mx-1" style={{ textDecoration: "none" }}>AGB</Link>
      </footer>

      {showAuth && (
        <AuthModal hint={authHint} onClose={() => setShowAuth(false)} />
      )}
    </div>
  );
}
