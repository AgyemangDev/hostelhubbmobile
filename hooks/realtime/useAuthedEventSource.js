import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import EventSource from "react-native-sse";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../../app/firebase/FirebaseConfig";
import API_BASE_URL from "../../utils/api/api";

/**
 * Persistent, authenticated Server-Sent-Events connection.
 *
 * Replaces the old pattern of polling / refetching-on-focus for things like
 * wallet balance and transactions: the backend pushes updates down a single
 * long-lived connection instead of the client re-asking on every screen
 * focus.
 *
 * - Fetches a fresh Firebase ID token and opens `EventSource` at
 *   `${API_BASE_URL}${path}` with it in the `Authorization` header.
 * - Calls `onMessage(JSON.parse(event.data))` for every message.
 * - Re-opens with a *new* `EventSource` instance (not just a header swap —
 *   the library doesn't support that) whenever `onIdTokenChanged` fires,
 *   since a stale/expired token needs a brand new connection.
 * - Reconnects with exponential backoff (1s/2s/4s/8s, capped at 30s) after a
 *   connection `error`.
 * - Closes the connection while the app is backgrounded and reopens it on
 *   foreground, calling the optional `onReconnect` once so the caller can do
 *   a one-time REST refetch to catch up on anything missed while backgrounded.
 *
 * Side-effect only hook — it returns nothing.
 */
export function useAuthedEventSource(path, onMessage, onReconnect) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  const onReconnectRef = useRef(onReconnect);
  onReconnectRef.current = onReconnect;

  useEffect(() => {
    let cancelled = false;
    let es = null;
    let reconnectTimer = null;
    let backoffMs = INITIAL_BACKOFF_MS;
    let backgrounded = AppState.currentState !== "active";
    let appState = AppState.currentState;

    const clearReconnectTimer = () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
    };

    const closeConnection = () => {
      clearReconnectTimer();
      if (es) {
        es.removeAllEventListeners();
        es.close();
        es = null;
      }
    };

    const scheduleReconnect = () => {
      if (cancelled || backgrounded) return;
      closeConnection();
      reconnectTimer = setTimeout(() => {
        connect();
      }, backoffMs);
      backoffMs = Math.min(backoffMs * 2, MAX_BACKOFF_MS);
    };

    // Opens a brand new EventSource with a fresh token. Never reused across
    // token refreshes — see the doc comment above.
    const connect = async () => {
      if (cancelled || backgrounded) return;
      closeConnection();

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return; // not authenticated yet — onIdTokenChanged will retry

      let token;
      try {
        token = await firebaseUser.getIdToken(false);
      } catch (err) {
        scheduleReconnect();
        return;
      }
      if (cancelled || backgrounded) return;

      es = new EventSource(`${API_BASE_URL}${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      es.addEventListener("open", () => {
        backoffMs = INITIAL_BACKOFF_MS; // a clean connection resets the backoff
      });

      es.addEventListener("message", (event) => {
        if (!event?.data) return;
        try {
          const payload = JSON.parse(event.data);
          onMessageRef.current?.(payload);
        } catch (err) {
          console.warn(`[useAuthedEventSource:${path}] Failed to parse message`, err);
        }
      });

      es.addEventListener("error", () => {
        scheduleReconnect();
      });
    };

    connect();

    // A refreshed (or newly expired) ID token means the open connection is
    // authenticating as a token that's about to be/already rejected — open a
    // fresh one rather than waiting for the next `error` event.
    const unsubscribeTokenChanged = onIdTokenChanged(auth, () => {
      if (!backgrounded) connect();
    });

    const appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      const goingBackground = appState === "active" && nextAppState.match(/inactive|background/);
      const goingForeground = appState.match(/inactive|background/) && nextAppState === "active";

      if (goingBackground) {
        backgrounded = true;
        closeConnection();
      } else if (goingForeground) {
        backgrounded = false;
        backoffMs = INITIAL_BACKOFF_MS;
        connect();
        onReconnectRef.current?.();
      }

      appState = nextAppState;
    });

    return () => {
      cancelled = true;
      closeConnection();
      unsubscribeTokenChanged();
      appStateSubscription.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path]);
}

const INITIAL_BACKOFF_MS = 1000;
const MAX_BACKOFF_MS = 30000;
