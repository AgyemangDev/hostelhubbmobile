import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

/**
 * Sticky bottom bar. With `amount`: total on the left, the screen's one
 * action on the right. Without it: the action fills the bar (a plain
 * bottom button).
 */
export default function PriceBar({ amount, caption, action, children, style }) {
  const insets = useSafeAreaInsets();
  const hasAmount = amount !== undefined && amount !== null;
  // The bar owns the bottom inset, so screens should only pad top/sides
  // (SafeAreaView edges={["top","left","right"]}). iOS: sit just above the
  // home indicator. Android (edge-to-edge): clear the nav/gesture bar and
  // keep a full step of space so the button never hugs the screen edge.
  const paddingBottom =
    Platform.OS === "android" ? insets.bottom + space.md : Math.max(insets.bottom, space.md) + 4;
  return (
    <View style={[styles.bar, { paddingBottom }, style]}>
      {hasAmount ? (
        <View style={styles.amount}>
          <Text variant="price">{amount}</Text>
          {caption ? <Text variant="caption" tone="secondary" numberOfLines={1}>{caption}</Text> : null}
        </View>
      ) : null}
      {action ? <View style={hasAmount ? null : styles.fill}>{action}</View> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    paddingHorizontal: space.lg,
    paddingTop: space.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.borderStrong,
    backgroundColor: colors.surface,
  },
  amount: { flex: 1, gap: 2 },
  fill: { flex: 1 },
});
