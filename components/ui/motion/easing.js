import { Animated, Easing } from "react-native";

// One curve for every animation in the app, no bounce.
export const EASE = Easing.bezier(0.2, 0, 0, 1);

export const timing = (value, toValue, duration, reduced) =>
  Animated.timing(value, { toValue, duration: reduced ? 0 : duration, easing: EASE, useNativeDriver: true });
