/**
 * UniGo Partner API client.
 *
 * HostelHubb sells UniGo bus seats natively: the user browses, picks a seat and
 * enters passenger details inside this app, and only leaves for the Hubtel
 * checkout page. Money settles to UniGo; every booking is stamped with our
 * partner id so we can claim the order.
 *
 * Auth is a publishable key (`X-Partner-Key`). It is deliberately safe to ship:
 * it can read open trips, create PENDING bookings, start payment and read back
 * bookings it created — nothing else, and it cannot hold a seat without paying.
 */

const UNIGO_API_BASE = (
  process.env.EXPO_PUBLIC_UNIGO_API_URL || "https://yenko-backend.onrender.com"
).replace(/\/+$/, "");

const PARTNER_KEY = process.env.EXPO_PUBLIC_UNIGO_PARTNER_KEY || "";

const V1 = `${UNIGO_API_BASE}/api/partner/v1`;

/** Deep link Hubtel's return page bounces back into. Must match app.json's scheme. */
export const TRANSPORT_RETURN_SCHEME = "hostelhubb://transport/booking";

class UnigoApiError extends Error {
  constructor(message, { status, code } = {}) {
    super(message);
    this.name = "UnigoApiError";
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = "GET", body, signal } = {}) {
  if (!PARTNER_KEY) {
    // EXPO_PUBLIC_* values in eas.json apply to EAS builds only; local runs read
    // `.env`. Missing key means one of those two, and which one matters a lot to
    // whoever is reading the error.
    throw new UnigoApiError(
      __DEV__
        ? "EXPO_PUBLIC_UNIGO_PARTNER_KEY is not set. Copy .env.example to .env, then restart Metro with `npx expo start --clear`."
        : "Transport is not available in this version of the app. Please update to the latest version.",
      { code: "NO_PARTNER_KEY" }
    );
  }

  let response;
  try {
    response = await fetch(`${V1}${path}`, {
      method,
      signal,
      headers: {
        "X-Partner-Key": PARTNER_KEY,
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new UnigoApiError("Could not reach UniGo. Check your connection and try again.", {
      code: "NETWORK",
    });
  }

  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    throw new UnigoApiError(
      payload?.error || `Request failed (${response.status})`,
      { status: response.status, code: payload?.code }
    );
  }

  return payload?.data;
}

// ─── Shape adapters ───────────────────────────────────────────────────────────
// The partner API returns a flat trip; the existing transport components
// (BusCard, BusHeader, TripInfoCard) expect `route: { from, to }`, so normalize
// once here rather than touching every component.

const toBus = (trip) => ({
  ...trip,
  route: { from: trip.from, to: trip.to, pickup_points: trip.pickupPoints },
});

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** Pickup/destination options, derived from trips that are actually on sale. */
export async function getLocations(options) {
  const data = await request("/locations", options);
  return data;
}

/** @param {{from?: string, to?: string, date?: string}} filters */
export async function searchTrips(filters = {}, options) {
  const query = new URLSearchParams();
  if (filters.from) query.set("from", filters.from);
  if (filters.to) query.set("to", filters.to);
  if (filters.date) query.set("date", filters.date);

  const suffix = query.toString() ? `?${query}` : "";
  const trips = await request(`/trips${suffix}`, options);
  return (trips || []).map(toBus);
}

/** Live seat map — never trust a seat list carried through navigation params. */
export async function getSeats(busId, options) {
  const data = await request(`/trips/${encodeURIComponent(busId)}/seats`, options);
  return { trip: toBus(data.trip), seats: data.seats };
}

/**
 * Create a pending booking. No seat is held until payment succeeds, so this is
 * safe to call and abandon.
 * @param {{busId: string, seatIds: string[], passenger: {name: string, email?: string, phone: string}, partnerUserId?: string}} input
 */
export async function createBooking(input, options) {
  return request("/bookings", { ...options, method: "POST", body: input });
}

/** This user's UniGo trips, newest first. Abandoned checkouts are excluded. */
export async function listBookings(partnerUserId, options) {
  if (!partnerUserId) return [];
  return request(`/bookings?partnerUserId=${encodeURIComponent(partnerUserId)}`, options);
}

/** Returns the Hubtel checkout URL to open in the in-app browser. */
export async function startPayment(groupRef, options) {
  return request(`/bookings/${encodeURIComponent(groupRef)}/pay`, { ...options, method: "POST" });
}

/**
 * Booking status + everything the ticket needs.
 * @param {boolean} fresh bypass the server's Hubtel poll throttle (use on return from checkout)
 */
export async function getBooking(groupRef, { fresh = false, ...options } = {}) {
  const suffix = fresh ? "?fresh=1" : "";
  return request(`/bookings/${encodeURIComponent(groupRef)}${suffix}`, options);
}

/** Official UniGo PDF ticket. Needs the partner key header, so download with `headers`. */
export function ticketPdfUrl(groupRef) {
  return `${V1}/bookings/${encodeURIComponent(groupRef)}/ticket.pdf`;
}

export function ticketPdfHeaders() {
  return { "X-Partner-Key": PARTNER_KEY };
}

export { UnigoApiError, UNIGO_API_BASE };
