import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAppUpdatePolicy } from "../utils/api/appUpdatePolicy";
import { currentBuild } from "../utils/appStore";

const RECHECK_MS = 5 * 60 * 1000;
const DISMISSED_KEY = `appUpdate.dismissedLatest.${Platform.OS}`;

/**
 * Compares this install's build number with the dashboard's update rules.
 *
 * status:
 *   "required"  build is below minimum_build → block the app
 *   "available" build is below latest_build and the student hasn't
 *               dismissed this latest build yet → suggest updating
 *   "current"   anything else (including no network, dev builds, or an
 *               unknown build number: never block on missing information)
 *
 * Checked on launch and again whenever the app returns to the foreground,
 * at most every five minutes.
 */
export default function useAppUpdatePolicy() {
  const [state, setState] = useState({ status: "current", message: null, latest: null });
  const lastCheck = useRef(0);

  const check = useCallback(async () => {
    if (__DEV__) return;
    const build = currentBuild();
    if (!build) return;
    lastCheck.current = Date.now();

    const policy = await getAppUpdatePolicy();
    const rules = policy?.[Platform.OS];
    if (!rules) return;
    const message = policy.message || null;

    if (rules.minimum_build && build < rules.minimum_build) {
      setState({ status: "required", message, latest: rules.latest_build });
      return;
    }
    if (rules.latest_build && build < rules.latest_build) {
      const dismissed = await AsyncStorage.getItem(DISMISSED_KEY).catch(() => null);
      if (Number(dismissed) !== rules.latest_build) {
        setState({ status: "available", message, latest: rules.latest_build });
        return;
      }
    }
    setState({ status: "current", message: null, latest: null });
  }, []);

  useEffect(() => {
    check();
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active" && Date.now() - lastCheck.current > RECHECK_MS) check();
    });
    return () => sub.remove();
  }, [check]);

  // "Not now": don't ask again until a newer latest build is set.
  const dismiss = useCallback(() => {
    setState((s) => {
      if (s.latest) AsyncStorage.setItem(DISMISSED_KEY, String(s.latest)).catch(() => {});
      return { status: "current", message: null, latest: null };
    });
  }, []);

  return { ...state, dismiss };
}
