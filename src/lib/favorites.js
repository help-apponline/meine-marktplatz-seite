import { useState, useEffect, useCallback } from "react";
import { pb } from "./pb.js";

/**
 * Hook that manages favorites for the logged-in user.
 * Returns { favoriteIds, toggle, loading }
 */
export function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(new Set()); // Set of ad IDs
  const [favoriteRecords, setFavoriteRecords] = useState([]); // full records for listing
  const [loading, setLoading] = useState(false);
  const isLoggedIn = pb.authStore.isValid;

  const load = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    setLoading(true);
    try {
      const result = await pb.collection("favorites").getList(1, 200, {
        sort: "-created",
        filter: `user = "${pb.authStore.record.id}"`,
        expand: "ad",
      });
      setFavoriteIds(new Set(result.items.map(r => r.ad)));
      setFavoriteRecords(result.items);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [isLoggedIn]);

  const toggle = useCallback(async (adId) => {
    if (!pb.authStore.isValid) return false; // not logged in
    const isFav = favoriteIds.has(adId);
    if (isFav) {
      // Remove
      const rec = favoriteRecords.find(r => r.ad === adId);
      if (rec) {
        try {
          await pb.collection("favorites").delete(rec.id);
          setFavoriteIds(prev => { const s = new Set(prev); s.delete(adId); return s; });
          setFavoriteRecords(prev => prev.filter(r => r.ad !== adId));
        } catch {}
      }
    } else {
      // Add
      try {
        const created = await pb.collection("favorites").create({
          user: pb.authStore.record.id,
          ad: adId,
        });
        setFavoriteIds(prev => new Set([...prev, adId]));
        setFavoriteRecords(prev => [...prev, created]);
      } catch {}
    }
    return !isFav;
  }, [favoriteIds, favoriteRecords]);

  return { favoriteIds, favoriteRecords, toggle, loading, reload: load };
}
