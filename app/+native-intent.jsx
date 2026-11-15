// Every incoming link (shared https://hostelhubb.com URLs, hostelhubb:// links,
// QR codes) passes through here before the router sees it. The URL -> screen
// table lives in utils/links.js, shared with push notification taps.
import { toAppRoute, needsLogin, savePendingLink } from "../utils/links";
import { auth } from "../lib/firebase/FirebaseConfig";

export function redirectSystemPath({ path, initial }) {
  try {
    const route = toAppRoute(path);
    if (!route) {
      // Checkout return URL or a link that isn't ours: stay where we are.
      return initial ? "/" : null;
    }
    if (needsLogin(path) && !auth.currentUser) {
      // Firebase may still be restoring the session on a cold start, so keep
      // the link either way; MainLayout opens it once the user is known.
      savePendingLink(path);
    }
    return route;
  } catch (err) {
    console.warn("[native-intent] could not route link:", path, err?.message);
    return initial ? "/" : null;
  }
}
