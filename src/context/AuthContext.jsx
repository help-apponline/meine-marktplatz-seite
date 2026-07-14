import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { pb } from "../lib/pb.js";
import { createNotification } from "../lib/notifications.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loggedIn, setLoggedIn] = useState(() => pb.authStore.isValid);
  const [userEmail, setUserEmail] = useState(() => pb.authStore.record?.email || "");
  const [userRole, setUserRole] = useState(() => pb.authStore.record?.role || "customer");
  const [userId, setUserId] = useState(() => pb.authStore.record?.id || "");
  const [verified, setVerified] = useState(() => pb.authStore.record?.verified || false);
  const [isAdmin, setIsAdmin] = useState(() => !!pb.authStore.record?.is_admin);

  function getAvatarUrl(record) {
    if (!record?.avatar) return "";
    try { return pb.files.getURL(record, record.avatar, { thumb: "100x100" }); } catch { return ""; }
  }
  const [avatarUrl, setAvatarUrl] = useState(() => getAvatarUrl(pb.authStore.record));

  useEffect(() => {
    const unsub = pb.authStore.onChange(() => {
      const valid = pb.authStore.isValid;
      setLoggedIn(valid);
      setUserEmail(pb.authStore.record?.email || "");
      setUserRole(pb.authStore.record?.role || "customer");
      setUserId(pb.authStore.record?.id || "");
      setVerified(pb.authStore.record?.verified || false);
      setIsAdmin(!!pb.authStore.record?.is_admin);
      setAvatarUrl(getAvatarUrl(pb.authStore.record));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!pb.authStore.isValid) return;
    pb.collection("users").authRefresh()
      .then(() => {
        setVerified(pb.authStore.record?.verified || false);
        setIsAdmin(!!pb.authStore.record?.is_admin);
      })
      .catch(() => pb.authStore.clear());
  }, []);

  // Fetch is_admin from server (authRefresh may not include custom fields)
  useEffect(() => {
    if (!pb.authStore.isValid || !pb.authStore.record?.id) return;
    pb.collection("users").getOne(pb.authStore.record.id)
      .then(u => setIsAdmin(!!u.is_admin))
      .catch(() => {});
  }, [loggedIn]);

  const login = useCallback(async (email, password) => {
    try {
      await pb.collection("users").authWithPassword(email, password);
      setVerified(pb.authStore.record?.verified || false);
      return null;
    } catch (e) {
      return "E-Mail oder Passwort ist falsch.";
    }
  }, []);

  const register = useCallback(async (email, password, password2, role) => {
    if (password.length < 6) return "Passwort muss mindestens 6 Zeichen haben.";
    if (password !== password2) return "Passwörter stimmen nicht überein.";
    try {
      await pb.collection("users").create({ email, password, passwordConfirm: password2, role });
      await pb.collection("users").authWithPassword(email, password);
      // Request verification email — silently ignore if SMTP not yet configured
      try { await pb.collection("users").requestVerification(email); } catch {}
      setVerified(false);
      return null;
    } catch (e) {
      const msg = e?.response?.data;
      if (msg?.email?.message) return "Diese E-Mail ist bereits registriert.";
      return "Registrierung fehlgeschlagen. Bitte versuche es erneut.";
    }
  }, []);

  const resendVerification = useCallback(async (email) => {
    try {
      await pb.collection("users").requestVerification(email || pb.authStore.record?.email);
      return null;
    } catch {
      return "Konnte keine E-Mail senden. Bitte versuche es später erneut.";
    }
  }, []);

  const requestPasswordReset = useCallback(async (email) => {
    try {
      await pb.collection("users").requestPasswordReset(email);
      return null;
    } catch {
      // Return null even on error to avoid leaking which emails exist
      return null;
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
    // Build FormData when photos are present (multipart upload)
    let body;
    if (data.photos && data.photos.length > 0) {
      const fd = new FormData();
      fd.append("owner", pb.authStore.record?.id);
      fd.append("role", data.role);
      fd.append("name", data.name || "");
      fd.append("title", data.title);
      fd.append("city", data.city || "");
      fd.append("zip", data.zip || "");
      fd.append("when_time", data.when || "");
      fd.append("price", data.price || "");
      fd.append("preisart", data.preisart || "");
      fd.append("price_label", data.priceLabel || "");
      fd.append("desc", data.desc || "");
      fd.append("category", data.category || "");
      fd.append("status", "offen");
      for (const file of data.photos) fd.append("photos", file);
      body = fd;
    } else {
      body = {
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
        category: data.category || "",
        status: "offen",
      };
    }
    const record = await pb.collection("ads").create(body);
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
    } catch { return null; }
  }, []);

  const updateAd = useCallback(async (id, data, newPhotos = []) => {
    let body;
    if (newPhotos.length > 0) {
      const fd = new FormData();
      if (data.title !== undefined) fd.append("title", data.title);
      if (data.city !== undefined) fd.append("city", data.city);
      if (data.desc !== undefined) fd.append("desc", data.desc);
      if (data.price !== undefined) fd.append("price", data.price);
      if (data.preisart !== undefined) fd.append("preisart", data.preisart);
      if (data.status !== undefined) fd.append("status", data.status);
      for (const f of newPhotos) fd.append("photos", f);
      body = fd;
    } else {
      body = data;
    }
    const record = await pb.collection("ads").update(id, body);
    return adaptAd(record);
  }, []);

  const deleteAd = useCallback(async (id) => {
    await pb.collection("ads").delete(id);
  }, []);

  const setAdStatus = useCallback(async (id, status) => {
    const record = await pb.collection("ads").update(id, { status });
    return adaptAd(record);
  }, []);

  // Chats
  const loadChats = useCallback(async () => {
    if (!pb.authStore.record?.id) return [];
    const result = await pb.collection("chats").getList(1, 100, { sort: "-updated" });
    return result.items;
  }, []);

  const getOrCreateChat = useCallback(async (adId, adTitle) => {
    if (!pb.authStore.record?.id) return null;
    const myId = pb.authStore.record.id;
    const myEmail = pb.authStore.record.email || "Jemand";

    try {
      const existing = await pb.collection("chats").getFirstListItem(
        adId ? `ad = "${adId}"` : `ad_title = "${adTitle}"`
      );
      const parts = existing.participants || [];
      if (!parts.includes(myId)) {
        await pb.collection("chats").update(existing.id, { "participants+": [myId] });
        // Notify existing participants about new contact
        await Promise.all(parts.map(uid =>
          createNotification({
            userId: uid,
            type: "new_chat",
            title: `${myEmail} möchte Kontakt aufnehmen`,
            body: `Bezüglich: ${existing.ad_title || adTitle || "Anzeige"}`,
            link: `/chat/${existing.id}`,
            chatId: existing.id,
          })
        ));
      }
      return existing.id;
    } catch {
      const chat = await pb.collection("chats").create({
        ad: adId || undefined,
        ad_title: adTitle || "Anzeige",
        participants: [myId],
      });
      // Notify ad owner if we know who they are
      if (adId) {
        try {
          const ad = await pb.collection("ads").getOne(adId);
          if (ad.owner && ad.owner !== myId) {
            await createNotification({
              userId: ad.owner,
              type: "new_chat",
              title: `${myEmail} möchte Kontakt aufnehmen`,
              body: `Bezüglich deiner Anzeige: ${adTitle || ad.title || "Anzeige"}`,
              link: `/chat/${chat.id}`,
              chatId: chat.id,
            });
          }
        } catch {}
      }
      return chat.id;
    }
  }, []);

  const getChat = useCallback(async (chatId) => {
    try { return await pb.collection("chats").getOne(chatId); }
    catch { return null; }
  }, []);

  const updateChatDeal = useCallback(async (chatId, data) => {
    try { return await pb.collection("chats").update(chatId, data); }
    catch { return null; }
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
    const myId = pb.authStore.record.id;
    const myEmail = pb.authStore.record.email || "Jemand";

    const msg = await pb.collection("messages").create({
      chat: chatId,
      sender: myId,
      text,
    });

    // Update chat timestamp
    await pb.collection("chats").update(chatId, { updated: new Date().toISOString() }).catch(() => {});

    // Notify all other participants
    try {
      const chat = await pb.collection("chats").getOne(chatId);
      const others = (chat.participants || []).filter(uid => uid !== myId);
      await Promise.all(others.map(uid =>
        createNotification({
          userId: uid,
          type: "new_message",
          title: `Neue Nachricht von ${myEmail}`,
          body: text.length > 80 ? text.slice(0, 80) + "…" : text,
          link: `/chat/${chatId}`,
          chatId,
        })
      ));
    } catch {}

    return msg;
  }, []);

  const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

  return (
    <AuthContext.Provider value={{
      loggedIn, userEmail, userRole, userId, verified, isAdmin, avatarUrl, setAvatarUrl, getAvatarUrl,
      login, register, logout,
      resendVerification, requestPasswordReset,
      loadAds, createAd, loadMyAds, getAd, updateAd, deleteAd, setAdStatus,
      loadChats, getOrCreateChat, getChat, updateChatDeal, loadMessages, sendMessage,
      uid, pb,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

function adaptAd(record) {
  // Build photo URLs from file names stored in the record
  const photoUrls = (record.photos || []).map(filename =>
    pb.files.getURL(record, filename, { thumb: "400x300" })
  );
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
    category: record.category || "",
    photos: photoUrls,
    createdAt: new Date(record.created).getTime(),
    updatedAt: new Date(record.updated).getTime(),
  };
}

export function useAuth() {
  return useContext(AuthContext);
}
