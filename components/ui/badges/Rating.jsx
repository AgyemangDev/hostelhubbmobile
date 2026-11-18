import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Text from "../typography/Text";
import { colors } from "../../../constants/theme";

/**
 * Star rating, "★ 4.80 (12)". Renders nothing without a rating.
 * variant: default | onDark (white, for photos and video)
 */
export default function Rating({ value, count, variant = "default", style }) {
  if (!value) return null;
  const color = variant === "onDark" ? colors.textInverse : colors.text;
  return (
    <View style={[styles.row, style]} accessibilityLabel={`Rated ${Number(value).toFixed(1)}${count ? ` from ${count} reviews` : ""}`}>
      <Icon source="star" size={12} color={color} />
      <Text variant="caption" style={{ fontWeight: "700", color }}>
        {Number(value).toFixed(2)}
        {count ? ` (${count})` : ""}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 3 },
});
