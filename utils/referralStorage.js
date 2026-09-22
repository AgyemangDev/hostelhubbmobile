import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "hostelhubb_pending_referral";
const TTL_MS = 24 * 60 * 60 * 1000;

export function extractReferralCode(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    if (parsed.protocol === "hostelhubb:" && parsed.hostname.toLowerCase() === "refer") {
      return decodeURIComponent(parsed.pathname.slice(1)).trim().toUpperCase() || null;
    }
    const match = parsed.pathname.match(/^\/refer\/([^/]+)/i);
    return match ? decodeURIComponent(match[1]).trim().toUpperCase() : null;
  } catch {
    const match = String(url).match(/(?:hostelhubb:\/\/|https?:\/\/[^/]+\/)refer\/([^/?#]+)/i);
    return match ? decodeURIComponent(match[1]).trim().toUpperCase() : null;
  }
}

export async function savePendingReferral(code) {
  const normalized = String(code || "").trim().toUpperCase();
  if (!normalized) return;
  await AsyncStorage.setItem(
    KEY,
    JSON.stringify({ code: normalized, expiresAt: Date.now() + TTL_MS })
  );
}

export async function getPendingReferral() {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;

  try {
    const value = JSON.parse(raw);
    if (!value.code || !value.expiresAt || value.expiresAt <= Date.now()) {
      await AsyncStorage.removeItem(KEY);
      return null;
    }
    return value;
  } catch {
    await AsyncStorage.removeItem(KEY);
    return null;
  }
}

export async function clearPendingReferral() {
  await AsyncStorage.removeItem(KEY);
}
