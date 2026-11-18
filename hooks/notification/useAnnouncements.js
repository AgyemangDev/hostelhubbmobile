import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ANNOUNCEMENTS } from "../../constants/notifications";

const KEY = "notifications:read-ids";
const listeners = new Set();
let readIds = null; // shared across screens so the bell and the list agree

async function load() {
  if (readIds) return readIds;
  try {
    readIds = new Set(JSON.parse((await AsyncStorage.getItem(KEY)) || "[]"));
  } catch {
    readIds = new Set();
  }
  return readIds;
}

function save() {
  AsyncStorage.setItem(KEY, JSON.stringify([...readIds])).catch(() => {});
  listeners.forEach((fn) => fn(new Set(readIds)));
}

/**
 * The in-app announcements with a remembered read state.
 * Returns { items (each with `read`), unreadCount, markRead(id), markAllRead() }.
 */
export default function useAnnouncements() {
  const [read, setRead] = useState(() => new Set(readIds || []));

  useEffect(() => {
    let alive = true;
    load().then((ids) => alive && setRead(new Set(ids)));
    listeners.add(setRead);
    return () => {
      alive = false;
      listeners.delete(setRead);
    };
  }, []);

  const markRead = useCallback(async (id) => {
    const ids = await load();
    if (ids.has(id)) return;
    ids.add(id);
    save();
  }, []);

  const markAllRead = useCallback(async () => {
    const ids = await load();
    ANNOUNCEMENTS.forEach((a) => ids.add(a.id));
    save();
  }, []);

  const items = ANNOUNCEMENTS.map((a) => ({ ...a, read: read.has(a.id) }));
  return { items, unreadCount: items.filter((a) => !a.read).length, markRead, markAllRead };
}
