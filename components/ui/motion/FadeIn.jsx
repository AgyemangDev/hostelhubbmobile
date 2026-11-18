import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { motion } from "../../../constants/theme";
import { EASE } from "./easing";

/** Fades and lifts children in once, on mount. For screen content and list rows. */
export default function FadeIn({ children, delay = 0, style }) {
  const v = useRef(new Animated.Value(0)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    Animated.timing(v, {
      toValue: 1,
      duration: reduced ? 0 : motion.base,
      delay: reduced ? 0 : delay,
      easing: EASE,
      useNativeDriver: true,
    }).start();
  }, [v, delay, reduced]);
  const translateY = v.interpolate({ inputRange: [0, 1], outputRange: [8, 0] });
  return <Animated.View style={[{ opacity: v, transform: [{ translateY }] }, style]}>{children}</Animated.View>;
}
