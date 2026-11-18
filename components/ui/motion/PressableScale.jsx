import React, { useRef } from "react";
import { Animated, Pressable } from "react-native";
import useReducedMotion from "../../../hooks/useReducedMotion";
import { motion } from "../../../constants/theme";
import { timing } from "./easing";

/**
 * Pressable that dips to 97% while pressed. For custom tappable surfaces
 * (photo tiles, map pins). Buttons, chips and list rows already have press
 * feedback from Paper, so use those first.
 */
export default function PressableScale({ children, style, disabled, onPressIn, onPressOut, ...props }) {
  const scale = useRef(new Animated.Value(1)).current;
  const reduced = useReducedMotion();
  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e) => {
        timing(scale, motion.pressScale, motion.fast, reduced).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        timing(scale, 1, motion.fast, reduced).start();
        onPressOut?.(e);
      }}
      {...props}
    >
      {(state) => (
        <Animated.View style={[{ transform: [{ scale }] }, typeof style === "function" ? style(state) : style]}>
          {typeof children === "function" ? children(state) : children}
        </Animated.View>
      )}
    </Pressable>
  );
}
