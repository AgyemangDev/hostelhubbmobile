import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "universityPrompt.lastShown";
const EVERY_MS = 7 * 24 * 60 * 60 * 1000; // ask again a week after "Not now"
const FIRST_DELAY_MS = 20 * 1000;          // let the app settle before asking

/**
 * Whether to ask a signed-in student for their university: only when it's
 * missing, at most once a week, and never while `blocked` (another prompt is
 * showing).
 */
export default function useUniversityPrompt({ enabled, blocked }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled || blocked) return undefined;
    let cancelled = false;
    const timer = setTimeout(async () => {
      const last = Number(await AsyncStorage.getItem(KEY).catch(() => 0)) || 0;
      if (!cancelled && Date.now() - last > EVERY_MS) setVisible(true);
    }, FIRST_DELAY_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [enabled, blocked]);

  const close = useCallback(() => {
    setVisible(false);
    AsyncStorage.setItem(KEY, String(Date.now())).catch(() => {});
  }, []);

  return { visible: visible && enabled && !blocked, close };
}
