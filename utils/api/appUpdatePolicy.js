import API_BASE_URL from "./api";

/**
 * The update rules set in the management dashboard (Settings → App updates):
 *   { ios: { minimum_build, latest_build }, android: { … }, message }
 * Returns null if the backend can't be reached, so a network problem never
 * locks anyone out of the app.
 */
export async function getAppUpdatePolicy() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/app/update-policy`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
