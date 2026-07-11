import { pb } from "./pb.js";

// Track a page visit. Called once per page/session via useEffect.
// Uses a "day + page" record and increments count server-side.
// Silently ignores errors — tracking must never break the UI.
export async function trackPageView(page) {
  try {
    const day = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const filter = `page="${page}" && day="${day}"`;
    let record;
    try {
      record = await pb.collection("pageviews").getFirstListItem(filter);
      await pb.collection("pageviews").update(record.id, { count: (record.count || 0) + 1 });
    } catch (e) {
      if (e?.status === 404) {
        await pb.collection("pageviews").create({ page, day, count: 1 });
      }
    }
  } catch {
    // silent
  }
}

// Load stats: total views, per-page totals, last 30 days daily totals
export async function loadPageviewStats() {
  try {
    const all = await pb.collection("pageviews").getFullList({ sort: "-day" });

    const totalViews = all.reduce((s, r) => s + (r.count || 0), 0);

    // Per-page totals
    const byPage = {};
    for (const r of all) {
      byPage[r.page] = (byPage[r.page] || 0) + (r.count || 0);
    }
    const perPage = Object.entries(byPage)
      .sort((a, b) => b[1] - a[1])
      .map(([page, count]) => ({ page, count }));

    // Last 30 days daily totals
    const byDay = {};
    for (const r of all) {
      byDay[r.day] = (byDay[r.day] || 0) + (r.count || 0);
    }
    const last30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last30.push({ day: key, count: byDay[key] || 0 });
    }

    return { totalViews, perPage, last30 };
  } catch {
    return { totalViews: 0, perPage: [], last30: [] };
  }
}
