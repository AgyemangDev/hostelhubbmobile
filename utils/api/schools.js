import API_BASE_URL from "./api";

const CACHE_MS = 30 * 60 * 1000;
let cached = null;

/**
 * Every school HostelHubb operates in (set in the dashboard under Schools):
 * [{ id, name, code, logo_url, offers_storage }]. Empty list if offline.
 */
export async function getSchools() {
  if (cached && cached.expires > Date.now()) return cached.schools;
  try {
    const res = await fetch(`${API_BASE_URL}/api/schools`);
    if (!res.ok) return cached?.schools || [];
    const data = await res.json();
    const schools = Array.isArray(data?.schools) ? data.schools : [];
    cached = { schools, expires: Date.now() + CACHE_MS };
    return schools;
  } catch {
    return cached?.schools || [];
  }
}
