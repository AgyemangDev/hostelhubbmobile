import React, { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { colors, radius as radii } from "../../../constants/theme";

const shapes = {
  rect: { radius: radii.sm, height: 16 },
  text: { radius: 4, height: 12 },
  circle: { radius: 999, height: 40 },
  pill: { radius: 999, height: 24 },
  image: { radius: radii.lg, height: 180 },
};

/**
 * Pulsing grey placeholder while content loads. Compose these into a
 * skeleton that mirrors the real layout (components/skeletons/*).
 *
 * variant: rect (default) | text | circle | pill | image
 * width / height / radius: override the variant's size
 * tone:    light (default, on white) | dark (over video)
 */
export default function Skeleton({ variant = "rect", width = "100%", height, radius, tone = "light", style }) {
  const s = shapes[variant] || shapes.rect;
  const h = height ?? s.height;
  const w = variant === "circle" && width === "100%" ? h : width;
  const opacity = useRef(new Animated.Value(0.4)).current;
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity, reduced]);

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width: w, height: h, borderRadius: radius ?? s.radius, backgroundColor: tone === "dark" ? "rgba(255,255,255,0.14)" : colors.fill },
        { opacity },
        style,
      ]}
    />
  );
}
