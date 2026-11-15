import API_BASE_URL from "./api";

const PROVIDERS = ["unigo", "legacy"];
const DEFAULT_PROVIDER = "unigo";
const CACHE_MS = 5 * 60 * 1000;
let cached = null;

/**
 * Which transport provider is live, as set in the management dashboard.
 * Falls back to UniGo if the backend can't be reached, so the Transport tile
 * always opens something.
 */
export async function getTransportProvider() {
  if (cached && cached.expires > Date.now()) return cached.provider;
  try {
    const res = await fetch(`${API_BASE_URL}/api/transport/config`);
    const data = await res.json();
    const provider = PROVIDERS.includes(data?.provider) ? data.provider : DEFAULT_PROVIDER;
    cached = { provider, expires: Date.now() + CACHE_MS };
    return provider;
  } catch {
    return DEFAULT_PROVIDER;
  }
}
