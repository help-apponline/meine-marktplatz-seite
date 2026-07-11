import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { pb } from "../lib/pb.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => pb.authStore.isValid);
  const [userEmail, setUserEmail] = useState(() => pb.authStore.record?.email || "");
  const [userRole, setUserRole] = useState(() => pb.authStore.record?.role || "customer");
  const [userId, setUserId] = useState(() => pb.authStore.record?.id || "");

  // Keep state in sync with PocketBase auth store
  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      const valid = pb.authStore.isValid;
      setLoggedIn(valid);
      setUserEmail(pb.authStore.record?.email || "");
      setUserRole(pb.authStore.record?.role || "customer");
      setUserId(pb.authStore.record?.id || "");
    });
    return () => unsub();
  }, []);

  // Refresh token on startup
  useEffect(() => {
    if (!pb.authStore.isValid) return;
    pb.collection("users").authRefresh().catch(() => pb.authStore.clear());
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await pb.collection("users").authWithPassword(email, password);
      return null;
    } catch (e) {
      return "E-Mail oder Passwort ist falsch.";
    }
  }, []);

  const register = useCallback(async (email, password, password2, role) => {
    if (password.length < 6) return "Passwort muss mindestens 6 Zeichen haben.";
    if (password !== password2) return "Passwörter stimmen nicht überein.";
    try {
      await pb.collection("users").create({
        email,
        password,
        passwordConfirm: password2,
        role,
      });
      await pb.collection("users").authWithPassword(email, password);
      return null;
    } catch (e) {
      const msg = e?.response?.data;
      if (msg?.email?.message) return "Diese E-Mail ist bereits registriert.";
      return "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
    }
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  // Ads
  const loadAds = useCallback(async (filter = "") => {
    const result = await pb.collection("ads").getList(1, 100, {
      sort: "-created",
      filter: filter || "",
      expand: "owner",
    });
    return result.items.map(adaptAd);
  }, []);

  const createAd = useCallback(async (data) => {
    const record = await pb.collection("ads").create({
      owner: pb.authStore.record?.id,
      role: data.role,
      name: data.name || "",
      title: data.title,
      city: data.city || "",
      zip: data.zip || "",
      when_time: data.when || "",
      price: data.price || "",
      preisart: data.preisart || "",
      price_label: data.priceLabel || "",
      desc: data.desc || "",
      status: "offen",
    });
    return adaptAd(record);
  }, []);

  const loadMyAds = useCallback(async () => {
    if (!pb.authStore.record?.id) return [];
    const result = await pb.collection("ads").getList(1, 100, {
      sort: "-created",
      filter: `owner.id = "${pb.authStore.record.id}"`,
    });
    return result.items.map(adaptAd);
  }, []);

  const getAd = useCallback(async (id) => {
    try {
      const record = await pb.collection("ads").getOne(id, { expand: "owner" });
      return adaptAd(record);
    } catch {
      return null;
    }
  }, []);

  // Chats
  const loadChats = useCallback(async () => {
    if (!pb.authStore.record?.id) return [];
    const result = await pb.collection("chats").getList(1, 100, {
      sort: "-updated",
    });
    return result.items;
  }, []);

  const getOrCreateChat = useCallback(async (adId, adTitle) => {
    if (!pb.authStore.record?.id) return null;
    const myId = pb.authStore.record.id;
    try {
      // Try to find existing chat for this ad
      const existing = await pb.collection("chats").getFirstListItem(
        adId ? `ad = "${adId}"` : `ad_title = "${adTitle}"`
      );
      // Add me as participant if not already
      const parts = existing.participants || [];
      if (!parts.includes(myId)) {
        await pb.collection("chats").update(existing.id, {
          "participants+": [myId],
        });
      }
      return existing.id;
    } catch {
      // Create new chat
      const chat = await pb.collection("chats").create({
        ad: adId || undefined,
        ad_title: adTitle || "Anzeige",
        participants: [myId],
      });
      return chat.id;
    }
  }, []);

  const getChat = useCallback(async (chatId) => {
    try {
      return await pb.collection("chats").getOne(chatId);
    } catch {
      return null;
    }
  }, []);

  const loadMessages = useCallback(async (chatId) => {
    const result = await pb.collection("messages").getList(1, 200, {
      sort: "created",
      filter: `chat = "${chatId}"`,
      expand: "sender",
    });
    return result.items;
  }, []);

  const sendMessage = useCallback(async (chatId, text) => {
    if (!pb.authStore.record?.id) return null;
    const msg = await pb.collection("messages").create({
      chat: chatId,
      sender: pb.authStore.record.id,
      text,
    });
    // Update chat's updated timestamp
    await pb.collection("chats").update(chatId, { updated: new Date().toISOString() }).catch(() => {});
    return msg;
  }, []);

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  return (
    <AuthContext.Provider value={{
      loggedIn, userEmail, userRole, userId,
      login, register, logout,
      loadAds, createAd, loadMyAds, getAd,
      loadChats, getOrCreateChat, getChat, loadMessages, sendMessage,
      uid,
      pb,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function adaptAd(record) {
  return {
    id: record.id,
    owner: record.owner,
    role: record.role,
    name: record.name,
    title: record.title,
    city: record.city,
    zip: record.zip,
    when: record.when_time,
    price: record.price,
    preisart: record.preisart,
    priceLabel: record.price_label || record.price || "—",
    desc: record.desc,
    status: record.status,
    createdAt: new Date(record.created).getTime(),
    updatedAt: new Date(record.updated).getTime(),
  };
}

export function useAuth() {
  return useContext(AuthContext);
}
