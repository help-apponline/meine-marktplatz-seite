import { pb } from "./pb.js";

/**
 * Create a notification for a specific user.
 * Called server-side style from client after actions (new message, new chat).
 */
export async function createNotification({ userId, type, title, body = "", link = "", chatId = "" }) {
  try {
    await pb.collection("notifications").create({
      user: userId,
      type,
      title,
      body,
      link,
      chat: chatId || undefined,
      read: false,
    });
  } catch {
    // Silently ignore — notifications are non-critical
  }
}

/**
 * Load unread notifications for the currently logged-in user.
 */
export async function loadUnreadNotifications() {
  try {
    const result = await pb.collection("notifications").getList(1, 50, {
      sort: "-created",
      filter: 'read = false',
    });
    return result.items;
  } catch {
    return [];
  }
}

/**
 * Mark a notification as read.
 */
export async function markRead(id) {
  try {
    await pb.collection("notifications").update(id, { read: true });
  } catch {}
}

/**
 * Mark all notifications as read.
 */
export async function markAllRead(items) {
  await Promise.all(items.map(n => markRead(n.id)));
}
