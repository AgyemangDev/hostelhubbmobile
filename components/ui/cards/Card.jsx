import React from "react";
import { StyleSheet } from "react-native";
import { Card as PaperCard } from "react-native-paper";
import { colors, elevation, radius, space } from "../../../constants/theme";

// Paper's Card puts children inside an inner view. Layout styles have to go
// on that inner view or rows, gaps and padding would not reach the children.
const INNER_KEYS = /^(padding|gap|rowGap|columnGap|flexDirection|flexWrap|alignItems|justifyContent|alignContent)/;

function splitStyle(style) {
  const outer = {};
  const inner = {};
  const flat = StyleSheet.flatten(style) || {};
  Object.keys(flat).forEach((k) => {
    (INNER_KEYS.test(k) ? inner : outer)[k] = flat[k];
  });
  return [outer, inner];
}

const variants = {
  // White with a hairline border: the default container for grouped content.
  outlined: { mode: "outlined", style: { backgroundColor: colors.surface } },
  // White and lifted on a soft shadow, for cards that float over a grey canvas.
  raised: { mode: "contained", style: { backgroundColor: colors.surface, ...elevation.card } },
  // Grey fill, no border: summaries and secondary panels.
  sunken: { mode: "contained", style: { backgroundColor: colors.fill } },
  // Brand-tinted panel for confirmations and rewards.
  brand: { mode: "contained", style: { backgroundColor: colors.brandSoft } },
};

/**
 * Container card. Built on Paper's Card. Pass onPress to make the whole card tappable.
 *
 * variant: outlined (default) | raised | sunken | brand
 * padded:  false to let images run to the edges
 */
export default function Card({ children, variant = "outlined", raised, padded = true, onPress, style, contentStyle, accessibilityLabel, testID }) {
  const v = variants[raised ? "raised" : variant] || variants.outlined;
  const [outer, inner] = splitStyle(style);
  return (
    <PaperCard
      mode={v.mode}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      style={[styles.card, v.style, outer]}
      contentStyle={[padded && styles.padded, inner, contentStyle]}
    >
      {children}
    </PaperCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: "hidden" },
  padded: { padding: space.md },
});
