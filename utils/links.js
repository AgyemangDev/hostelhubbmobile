// utils/links.js
//
// Turns any HostelHubb link into an in-app route. Used by:
//   - app/+native-intent.jsx       shared links, Universal/App Links, QR codes
//   - lib/firebase/notificationService.js   push notification taps (data.url)
//
// The paths match the website one-to-one (hostelhubbweb/app/...) and the
// backend's link builder (services/links/appLinks.js), so a link copied from
// the site, an email button and a push notification all land on the same screen.
//
//   https://hostelhubb.com/hostels/:slug          -> hostel details
//   https://hostelhubb.com/hostel/:id             -> hostel details
//   /clips/:id                                    -> that hubclip in the feed
//   /storage                                      -> start a storage booking
//   /transport                                    -> bus search (active provider)
//   /transport/trips/:tripId                      -> seat picker for that bus
//   /transport/tickets/:groupRef                  -> bus ticket
//   /bookings                                     -> bookings tab
//   /bookings/accommodation/:id                   -> room booking details
//   /bookings/accommodation/:id/pay               -> pay for an accepted booking
//   /bookings/storage/:id                         -> storage order details
//   /bookings/transport/:groupRef                 -> bus ticket
//   /wallet                                       -> wallet & withdrawals
//   /complaints/:id                               -> a complaint thread
//   /notifications                                -> notification list
//   /refer/:code                                  -> home (code saved by _layout)
import AsyncStorage from "@react-native-async-storage/async-storage";

export const SITE_URL = "https://hostelhubb.com";
const SITE_HOSTS = ["hostelhubb.com", "www.hostelhubb.com"];
const APP_SCHEME = "hostelhubb:";

// Return URLs the in-app browser waits for during checkout. They must never
// trigger navigation on their own (Android also delivers them to the router).
const RETURN_PATHS = [/^\/payments\/callback/, /^\/transport\/booking(\/|$)/];

const enc = encodeURIComponent;
const q = (params) =>
  Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${enc(k)}=${enc(v)}`)
    .join("&");

/** Returns { path, query } for a HostelHubb URL or path, or null if it isn't ours. */
export function parseLink(input) {
  if (!input || typeof input !== "string") return null;
  try {
    const raw = input.trim();
    let url;
    if (raw.startsWith("/")) {
      url = new URL(raw, SITE_URL);
    } else if (raw.startsWith(APP_SCHEME)) {
      // hostelhubb://hostel/123 -> host "hostel", path "/123"
      url = new URL(raw.replace(/^hostelhubb:\/\/\/?/, `${SITE_URL}/`));
    } else {
      url = new URL(raw);
      if (!SITE_HOSTS.includes(url.hostname)) return null;
    }
    const path = url.pathname.replace(/\/+$/, "") || "/";
    return { path, query: Object.fromEntries(url.searchParams.entries()) };
  } catch {
    return null;
  }
}

const ROUTES = [
  [/^\/(?:hostels|hostel|details)\/([^/]+)$/i, ([id]) => `/hostel/${enc(id)}`],
  [/^\/clips\/([^/]+)$/, ([id]) => `/(tabs)/(Hubclipps)?${q({ clip: id })}`],
  [/^\/clips$/, () => "/(tabs)/(Hubclipps)"],
  [/^\/storage$/, () => "/(StorageForm)"],
  [/^\/transport$/, () => "/(categories)/(transport)"],
  [/^\/transport\/trips\/([^/]+)$/, ([tripId]) => `/(categories)/(transport)/unigo/SeatSelection?${q({ tripId })}`],
  [/^\/(?:transport\/tickets|bookings\/transport)\/([^/]+)$/, ([groupRef]) => `/(categories)/(transport)/unigo/Ticket?${q({ groupRef })}`],
  [/^\/bookings\/(?:accommodation|hubclip)\/([^/]+)\/pay$/, ([id]) => `/(tabs)/(bookings)/PayNow?${q({ bookingId: id })}`],
  [/^\/bookings\/(?:accommodation|hubclip)\/([^/]+)$/, ([id]) => `/(tabs)/(bookings)/PaidBookingDetails?${q({ bookingId: id })}`],
  [/^\/bookings\/storage\/([^/]+)$/, ([id]) => `/(tabs)/(bookings)/StorageBookingDetails?${q({ id })}`],
  [/^\/bookings$/, () => "/(tabs)/(bookings)"],
  [/^\/wallet$/, () => "/wallet"],
  [/^\/complaints\/([^/]+)$/, ([id]) => `/complaints/${enc(id)}`],
  [/^\/complaints$/, () => "/complaints"],
  [/^\/notifications$/, () => "/NotificationScreen"],
  [/^\/refer\/[^/]+$/, () => "/(tabs)/(index)"],
  [/^\/hostels$/, () => "/(categories)/(hostels)"],
  [/^\/$/, () => "/(tabs)/(index)"],
];

// Screens that only make sense signed in. If the user isn't, the link is
// remembered and opened right after they log in (see MainLayout).
const NEEDS_LOGIN = [/^\/bookings/, /^\/wallet$/, /^\/transport\/tickets\//, /^\/complaints/, /^\/notifications$/];

/**
 * Maps a link to an app route string, or null if it shouldn't navigate.
 * Unknown HostelHubb paths fall back to the home tab instead of a 404.
 */
export function toAppRoute(input) {
  const parsed = parseLink(input);
  if (!parsed) return null;
  const { path } = parsed;
  if (RETURN_PATHS.some((re) => re.test(path))) return null;
  for (const [re, build] of ROUTES) {
    const match = path.match(re);
    if (match) return build(match.slice(1).map(decodeURIComponent));
  }
  return "/(tabs)/(index)";
}

export function needsLogin(input) {
  const parsed = parseLink(input);
  return Boolean(parsed && NEEDS_LOGIN.some((re) => re.test(parsed.path)));
}

/** A full https link for the share sheet. */
export const shareUrl = {
  hostel: ({ slug, id }) => `${SITE_URL}${slug ? `/hostels/${enc(slug)}` : `/hostel/${enc(id)}`}`,
  clip: (id) => `${SITE_URL}/clips/${enc(id)}`,
  trip: (tripId) => `${SITE_URL}/transport/trips/${enc(tripId)}`,
  ticket: (groupRef) => `${SITE_URL}/transport/tickets/${enc(groupRef)}`,
  storage: () => `${SITE_URL}/storage`,
};

// ── Links waiting for login ─────────────────────────────────────────────────
const PENDING_KEY = "pendingLink";

export async function savePendingLink(input) {
  try {
    await AsyncStorage.setItem(PENDING_KEY, input);
  } catch {}
}

export async function hasPendingLink() {
  try {
    return Boolean(await AsyncStorage.getItem(PENDING_KEY));
  } catch {
    return false;
  }
}

/** Returns and clears the remembered link's app route, if any. */
export async function takePendingRoute() {
  try {
    const value = await AsyncStorage.getItem(PENDING_KEY);
    if (!value) return null;
    await AsyncStorage.removeItem(PENDING_KEY);
    return toAppRoute(value);
  } catch {
    return null;
  }
}
