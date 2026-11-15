// The single, self-contained API client for the (transportUnigo) folder.
//
// Everything here — search, seats, booking, payment, tickets — goes through
// OUR backend (`modules/transportUnigo`), which holds the UniGo partner key
// and proxies UniGo's real API. The app never talks to UniGo directly.
//
// Swap API_BASE_URL for however the rest of the app resolves its backend
// origin.
import API_BASE_URL from "./api";
import { auth } from "../../lib/firebase/FirebaseConfig";

const BASE = `${API_BASE_URL}/api/transport-unigo`;

/**
 * Must match the scheme + path UniGo has registered for this app's payment
 * return (see UniGo's integration guide §4/§9). Changing this without
 * telling UniGo breaks the return-from-checkout flow silently.
 */
export const TRANSPORT_RETURN_SCHEME = "hostelhubb://transport/booking";

/** Booking routes are tied to the signed-in user; search routes are public. */
async function authHeader() {
  const user = auth.currentUser;
  if (!user) {
    const err = new Error("Please log in to continue");
    err.status = 401;
    throw err;
  }
  return { Authorization: `Bearer ${await user.getIdToken(false)}` };
}

async function request(path, { authed = false, ...options } = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authed ? await authHeader() : {}),
      ...(options.headers || {}),
    },
  });

  let body = null;
  try {
    body = await res.json();
  } catch {
    // Non-JSON or empty body — leave body null.
  }

  if (!res.ok) {
    const err = new Error(body?.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  return body;
}

const qs = (params) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");

// ── Locations & search ──────────────────────────────────────────────────────

/** -> { origins: string[], destinations: string[], all: string[] } */
export const getLocations = () => request("/locations");

/** { from, to, date? } -> Bus[] */
export const searchTrips = ({ from, to, date }) => request(`/trips?${qs({ from, to, date })}`);

/** tripId -> { trip, seats } — fetch fresh right before showing the seat map. */
export const getSeats = (tripId) => request(`/trips/${encodeURIComponent(tripId)}/seats`);

// ── Booking & payment ────────────────────────────────────────────────────────

/**
 * { busId, seatIds, passenger } -> booking
 * No seat is held until this succeeds; the hold then lasts ~5 minutes.
 * The backend sets partnerUserId from the login token.
 */
export const createBooking = ({ busId, seatIds, passenger }) =>
  request("/bookings", {
    authed: true,
    method: "POST",
    body: JSON.stringify({ busId, seatIds, passenger }),
  });

/**
 * groupRef -> { checkoutUrl, checkoutDirectUrl, holdExpiresAt, total }
 * Also valid on a pending/failed/expired booking — this is the resume path.
 * Re-asserts the seat hold and restarts the 5-minute clock.
 */
export const startPayment = (groupRef) =>
  request(`/bookings/${encodeURIComponent(groupRef)}/pay`, { authed: true, method: "POST" });

/**
 * groupRef, { fresh } -> booking status
 * Pass fresh: true on return from checkout — forces UniGo to reconcile with
 * the payment provider instead of waiting on its webhook.
 */
export const getBooking = (groupRef, { fresh } = {}) =>
  request(`/bookings/${encodeURIComponent(groupRef)}${fresh ? "?fresh=1" : ""}`, { authed: true });

/** Frees held seats immediately instead of waiting out the 5-minute timeout. */
export const cancelBooking = (groupRef) =>
  request(`/bookings/${encodeURIComponent(groupRef)}/cancel`, { authed: true, method: "POST" });

/** The signed-in user's bookings, newest first. Excludes expired/failed. */
export const listBookings = () => request("/bookings", { authed: true });

// ── Ticket assets ────────────────────────────────────────────────────────────

export const ticketQrUrl = (groupRef, format = "png") =>
  `${BASE}/ticket/${encodeURIComponent(groupRef)}/qr?format=${format}`;

export const ticketPdfDownloadUrl = (groupRef) =>
  `${BASE}/ticket/${encodeURIComponent(groupRef)}/pdf`;