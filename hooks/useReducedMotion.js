import { useEffect, useState } from "react";
import { AccessibilityInfo } from "react-native";

/** True when the user asked the OS to reduce motion. */
export default function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled?.().then((v) => mounted && setReduced(Boolean(v)));
    const sub = AccessibilityInfo.addEventListener?.("reduceMotionChanged", (v) => setReduced(Boolean(v)));
    return () => {
      mounted = false;
      sub?.remove?.();
    };
  }, []);
  return reduced;
}
