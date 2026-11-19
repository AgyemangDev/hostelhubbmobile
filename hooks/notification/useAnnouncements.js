// hooks/notification/useAnnouncements.js
//
// The student's notification list: their own notifications from the server
// (bookings, payments, complaints, reminders, announcements from their
// hostel), newest first, followed by HostelHubb's standing notices
// (constants/notifications.js). Read state for server items lives in the
// database, so it matches on every device; notices keep a local read state.
//
// One shared store, so the bell and the list always agree.
// Returns { items, unreadCount, loading, refresh, markRead(item), markAllRead() }.
import { useCallback, useEffect, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { onAuthStateChanged } from "firebase/auth";
import { ANNOUNCEMENTS } from "../../constants/notifications";
import { auth } from "../../lib/firebase/FirebaseConfig";
import studentHub from "../../services/studentHub";
import { toAppRoute } from "../../utils/links";

const KEY = "notifications:read-ids";
const CATEGORY = {
  booking: { icon: "calendar-outline", tone: "brand" },
  payment: { icon: "card-outline", tone: "warning" },
  reminder: { icon: "alarm-outline", tone: "warning" },
  announcement: { icon: "megaphone-outline", tone: "info" },
  complaint: { icon: "construct-outline", tone: "info" },
  review: { icon: "star-outline", tone: "brand" },
  storage: { icon: "cube-outline", tone: "info" },
  transport: { icon: "bus-outline", tone: "info" },
  waitlist: { icon: "hourglass-outline", tone: "brand" },
  referral: { icon: "gift-outline", tone: "brand" },
  general: { icon: "notifications-outline", tone: "info" },
};

function actionFor(url) {
  if (!url) return null;
  const route = toAppRoute(url);
  if (!route) return null;
  const label = /\/pay$/.test(url) ? "Pay now"
    : url.startsWith("/complaints") ? "View complaint"
      : url.startsWith("/bookings/storage") ? "View order"
        : url.startsWith("/bookings") ? "View booking"
          : url.startsWith("/hostel") ? "View hostel"
            : "Open";
  return { label, route, icon: /\/pay$/.test(url) ? "card-outline" : undefined };
}

function timeAgo(iso) {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d} d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

const fromServer = (n) => ({
  id: n.id,
  server: true,
  title: n.title,
  message: n.body,
  icon: (CATEGORY[n.category] || CATEGORY.general).icon,
  tone: (CATEGORY[n.category] || CATEGORY.general).tone,
  time: timeAgo(n.created_at),
  read: Boolean(n.read_at),
  action: actionFor(n.data?.url),
});

// ── shared store ────────────────────────────────────────────────────────────
let state = { server: [], serverUnread: 0, localRead: null, loading: false };
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn({ ...state }));

async function loadLocal() {
  if (state.localRead) return state.localRead;
  try {
    state.localRead = new Set(JSON.parse((await AsyncStorage.getItem(KEY)) || "[]"));
  } catch {
    state.localRead = new Set();
  }
  return state.localRead;
}

async function fetchServer() {
  if (!auth.currentUser) {
    state = { ...state, server: [], serverUnread: 0 };
    emit();
    return;
  }
  state = { ...state, loading: true };
  emit();
  try {
    const [{ notifications }, { unread }] = await Promise.all([studentHub.notifications({ limit: 50 }), studentHub.unreadCount()]);
    state = { ...state, server: notifications.map(fromServer), serverUnread: unread, loading: false };
  } catch {
    state = { ...state, loading: false };
  }
  emit();
}

let started = false;
function start() {
  if (started) return;
  started = true;
  loadLocal().then(emit);
  onAuthStateChanged(auth, () => fetchServer());
  AppState.addEventListener("change", (s) => { if (s === "active") fetchServer(); });
}

/** Call after a push arrives so the bell updates. */
export const refreshNotifications = () => fetchServer();

export default function useAnnouncements() {
  const [snap, setSnap] = useState(() => ({ ...state }));

  useEffect(() => {
    start();
    listeners.add(setSnap);
    setSnap({ ...state });
    return () => listeners.delete(setSnap);
  }, []);

  const markRead = useCallback(async (itemOrId) => {
    const item = typeof itemOrId === "object" ? itemOrId : { id: itemOrId };
    const server = item.server ?? state.server.some((n) => n.id === item.id);
    if (server) {
      const target = state.server.find((n) => n.id === item.id);
      if (target && !target.read) {
        state = { ...state, server: state.server.map((n) => (n.id === item.id ? { ...n, read: true } : n)), serverUnread: Math.max(0, state.serverUnread - 1) };
        emit();
        studentHub.markRead(item.id).catch(() => {});
      }
      return;
    }
    const ids = await loadLocal();
    if (ids.has(item.id)) return;
    ids.add(item.id);
    AsyncStorage.setItem(KEY, JSON.stringify([...ids])).catch(() => {});
    emit();
  }, []);

  const markAllRead = useCallback(async () => {
    const ids = await loadLocal();
    ANNOUNCEMENTS.forEach((a) => ids.add(a.id));
    AsyncStorage.setItem(KEY, JSON.stringify([...ids])).catch(() => {});
    state = { ...state, server: state.server.map((n) => ({ ...n, read: true })), serverUnread: 0 };
    emit();
    if (auth.currentUser) studentHub.markAllRead().catch(() => {});
  }, []);

  const localRead = snap.localRead || new Set();
  const notices = ANNOUNCEMENTS.map((a) => ({ ...a, read: localRead.has(a.id) }));
  const items = [...snap.server, ...notices];
  const unreadCount = snap.serverUnread + notices.filter((a) => !a.read).length;

  return { items, unreadCount, loading: snap.loading, refresh: fetchServer, markRead, markAllRead };
}
