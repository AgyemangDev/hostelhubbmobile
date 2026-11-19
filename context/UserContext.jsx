import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "../lib/firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import API_BASE_URL from "../utils/api/api";
import { useAuthedEventSource } from "../hooks/realtime/useAuthedEventSource";
import { isValidGhanaPhone } from "../utils/phone";

export const UserContext = createContext();

const STORAGE_KEY  = "userSession";
const CACHE_TTL_MS = 5 * 60 * 1000;

export const UserProvider = ({ children }) => {
  const [user,    setUser]    = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  // ─── Cache ─────────────────────────────────────────────────────────────────

  const saveCache = async (data) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {
      console.error("Cache save error:", e);
    }
  };

  const loadCache = async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      return { data, isStale: Date.now() - timestamp > CACHE_TTL_MS };
    } catch {
      return null;
    }
  };

  const clearCache = async () => {
    try { await AsyncStorage.removeItem(STORAGE_KEY); } catch {}
  };

  // ─── Fetch profile from /me ────────────────────────────────────────────────

  const fetchUserInfo = useCallback(async (firebaseUser) => {
    try {
      const token    = await firebaseUser.getIdToken(false);
      const response = await fetch(`${API_BASE_URL}/api/students/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const freshData = await response.json();
      setUserInfo(freshData);
      await saveCache(freshData);
      return freshData;
    } catch (err) {
      console.error("[fetchUserInfo] error:", err);
      return null;
    }
  }, []);

  // ─── Called right after a successful auth response ─────────────────────────
  // Pass the student object returned by the backend so we don't need
  // an extra /me round-trip immediately after sign-in.

  const setUserFromAuthResponse = useCallback(async (student) => {
    if (!student) return;
    setUserInfo(student);
    await saveCache(student);
  }, []);

  // ─── Refresh ───────────────────────────────────────────────────────────────

  const refreshUserInfo = useCallback(async (forceRefresh = false) => {
    if (!user) return;
    try {
      if (!forceRefresh) {
        const cached = await loadCache();
        if (cached && !cached.isStale) {
          setUserInfo(cached.data);
          return;
        }
      }
      await fetchUserInfo(user);
    } catch (err) {
      console.error("refreshUserInfo error:", err);
    }
  }, [user, fetchUserInfo]);

  // ─── Patch ─────────────────────────────────────────────────────────────────

  const patchUserData = useCallback(async (updates) => {
    if (!user) throw new Error("No user logged in");
    const token    = await user.getIdToken(false);
    const response = await fetch(`${API_BASE_URL}/api/students/me`, {
      method:  "PATCH",
      headers: {
        Authorization:  `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || "Failed to update user data");
    }
    const responseData = await response.json();
    setUserInfo((prev) => {
      const merged = { ...prev, ...updates };
      saveCache(merged);
      return merged;
    });
    return responseData;
  }, [user]);

  // ─── Auth state listener ───────────────────────────────────────────────────

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (!firebaseUser) {
        setUserInfo(null);
        await clearCache();
        setLoading(false);
        return;
      }

      // Show cached data immediately while we decide whether to re-fetch
      const cached = await loadCache();
      if (cached?.data) setUserInfo(cached.data);

      // Only hit /me if cache is stale or empty
      if (!cached || cached.isStale) {
        await fetchUserInfo(firebaseUser);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserInfo]);

  // ─── Push updates ──────────────────────────────────────────────────────────
  // Replaces the old useFocusEffect(refreshUserInfo(true)) calls scattered
  // across screens — the backend now pushes profile changes (balance,
  // name, phone, date of birth, etc.) down this connection instead of the
  // client re-polling on every screen focus. `refreshUserInfo` itself is kept
  // as a manual fallback.
  useAuthedEventSource("/api/students/me/stream", (payload) => {
    setUserInfo((prev) => ({ ...prev, ...payload }));
  });

  // ─── Context value ─────────────────────────────────────────────────────────

// ─── Profile completeness check ───────────────────────────────────────────

const isProfileIncomplete = useMemo(() => {
  if (!userInfo) return false; // not loaded yet, don't redirect prematurely
  const { first_name, surname, date_of_birth } = userInfo;
  // New students and existing students without a date of birth go to
  // ProfileUpdate, which also asks for the WhatsApp number. Students with
  // everything except a valid WhatsApp number get the WhatsApp modal instead
  // (needsWhatsApp below).
  return !first_name?.trim() || !surname?.trim() || !date_of_birth;
}, [userInfo]);

// Signed-in students whose WhatsApp number is missing or not 0XXXXXXXXX /
// +233XXXXXXXXX. ProfilePromptsGate shows a modal they can't skip.
const needsWhatsApp = useMemo(
  () => Boolean(userInfo) && !isProfileIncomplete && !isValidGhanaPhone(userInfo.phone_number),
  [userInfo, isProfileIncomplete]
);

const value = useMemo(() => ({
  user,
  userInfo,
  isLoading: loading,
  isProfileIncomplete,
  needsWhatsApp,
  patchUserData,
  refreshUserInfo,
  setUserFromAuthResponse,
  logoutCleanup: async () => {
    setUserInfo(null);
    await clearCache();
  },
}), [user, userInfo, loading, isProfileIncomplete, needsWhatsApp, patchUserData, refreshUserInfo, setUserFromAuthResponse]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};