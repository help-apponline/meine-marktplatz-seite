import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AUTH_KEY = "helpapp_logged_in_v1";
const USER_KEY = "helpapp_user_email_v1";
const ROLE_KEY = "helpapp_role_v1";
const USERS_KEY = "helpapp_users_v1";
const ADS_KEY = "helpapp_ads_v1";
const CHATS_KEY = "helpapp_chats_v1";
const PARTNERS_KEY = "helpapp_partners_v2";

function seedDemoData() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    let changed = false;
    if (!users["demo@helpapp.local"]) {
      users["demo@helpapp.local"] = { password: "demo1234", role: "customer", createdAt: Date.now() };
      changed = true;
    }
    if (!users["helper@helpapp.local"]) {
      users["helper@helpapp.local"] = { password: "demo1234", role: "helper", createdAt: Date.now() };
      changed = true;
    }
    if (changed) localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const ads = JSON.parse(localStorage.getItem(ADS_KEY) || "[]");
    if (!ads.length) {
      const now = Date.now();
      localStorage.setItem(ADS_KEY, JSON.stringify([
        { id: "a_demo_1", role: "customer", title: "Wohnung reinigen", city: "Berlin", zip: "10115", when: "Diese Woche", price: "Pauschal", preisart: "Pauschal", priceLabel: "Pauschal", desc: "Suche Hilfe beim Reinigen einer 2-Zimmer-Wohnung. Putzmittel vorhanden.", owner: "demo@helpapp.local", status: "offen", createdAt: now, updatedAt: now },
        { id: "a_demo_2", role: "helper", title: "Gartenhilfe", city: "München", zip: "80331", when: "Heute", price: "15€/Stunde", preisart: "Pro Stunde", priceLabel: "15€/Stunde (Pro Stunde)", desc: "Biete Unterstützung im Garten (Rasen mähen, Unkraut jäten).", owner: "helper@helpapp.local", status: "offen", createdAt: now, updatedAt: now },
        { id: "a_demo_3", role: "helper", title: "Einkaufshilfe", city: "Hamburg", zip: "20095", when: "Diese Woche", price: "Festpreis", preisart: "Festpreis", priceLabel: "Festpreis", desc: "Einkäufe erledigen, Besorgungen, Begleitung – zuverlässig und freundlich.", owner: "helper@helpapp.local", status: "offen", createdAt: now - 3600000, updatedAt: now - 3600000 },
        { id: "a_demo_4", role: "customer", title: "Umzugskartons tragen", city: "Leipzig", zip: "04103", when: "Wochenende", price: "Verhandelbar", preisart: "Verhandelbar", priceLabel: "Verhandelbar", desc: "2–3 Stunden helfen Kartons zu tragen, Aufzug vorhanden.", owner: "demo@helpapp.local", status: "offen", createdAt: now - 7200000, updatedAt: now - 7200000 },
      ]));
    }

    const chats = JSON.parse(localStorage.getItem(CHATS_KEY) || "{}");
    if (!Object.keys(chats).length) {
      const id = "c_a_demo_1";
      chats[id] = {
        id, adId: "a_demo_1", adTitle: "Wohnung reinigen",
        participants: ["demo@helpapp.local", "helper@helpapp.local"],
        messages: [
          { id: "m1", from: "demo@helpapp.local", text: "Hi! Kannst du mir diese Woche helfen?", ts: Date.now() - 1000 * 60 * 60 * 5 },
          { id: "m2", from: "helper@helpapp.local", text: "Klar 🙂 Wann passt es dir?", ts: Date.now() - 1000 * 60 * 60 * 4 },
        ],
        createdAt: Date.now() - 1000 * 60 * 60 * 6,
        updatedAt: Date.now() - 1000 * 60 * 60 * 4,
      };
      localStorage.setItem(CHATS_KEY, JSON.stringify(chats));
    }
  } catch {}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => localStorage.getItem(AUTH_KEY) === "true");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem(USER_KEY) || "");
  const [userRole, setUserRole] = useState(() => localStorage.getItem(ROLE_KEY) || "customer");

  useEffect(() => { seedDemoData(); }, []);

  const login = useCallback((email, password) => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (!users[email] || users[email].password !== password) return "E-Mail oder Passwort ist falsch.";
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(USER_KEY, email);
    localStorage.setItem(ROLE_KEY, users[email].role || "customer");
    setLoggedIn(true);
    setUserEmail(email);
    setUserRole(users[email].role || "customer");
    return null;
  }, []);

  const register = useCallback((email, password, password2, role) => {
    if (password.length < 6) return "Passwort muss mindestens 6 Zeichen haben.";
    if (password !== password2) return "Passwörter stimmen nicht überein.";
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
    if (users[email]) return "Diese E-Mail ist bereits registriert.";
    users[email] = { password, role, createdAt: Date.now() };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(USER_KEY, email);
    localStorage.setItem(ROLE_KEY, role);
    setLoggedIn(true);
    setUserEmail(email);
    setUserRole(role);
    return null;
  }, []);

  const logout = useCallback(() => {
    localStorage.setItem(AUTH_KEY, "false");
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
    setLoggedIn(false);
    setUserEmail("");
    setUserRole("customer");
  }, []);

  // Ads helpers
  const loadAds = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(ADS_KEY) || "[]"); } catch { return []; }
  }, []);

  const saveAds = useCallback((list) => {
    localStorage.setItem(ADS_KEY, JSON.stringify(list));
  }, []);

  // Chats helpers
  const loadChats = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(CHATS_KEY) || "{}"); } catch { return {}; }
  }, []);

  const saveChats = useCallback((obj) => {
    localStorage.setItem(CHATS_KEY, JSON.stringify(obj));
  }, []);

  // Partners helpers
  const loadPartners = useCallback(() => {
    try { return JSON.parse(localStorage.getItem(PARTNERS_KEY) || "[]"); } catch { return []; }
  }, []);

  const savePartners = useCallback((list) => {
    localStorage.setItem(PARTNERS_KEY, JSON.stringify(list));
  }, []);

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  return (
    <AuthContext.Provider value={{ loggedIn, userEmail, userRole, login, register, logout, loadAds, saveAds, loadChats, saveChats, loadPartners, savePartners, uid }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
