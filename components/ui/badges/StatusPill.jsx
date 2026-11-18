import React from "react";
import { StyleSheet, View } from "react-native";
import Text from "../typography/Text";
import { colors, radius } from "../../../constants/theme";

const tones = {
  neutral: { bg: colors.fill, fg: colors.textSecondary },
  warning: { bg: colors.warningBg, fg: colors.warningText },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  success: { bg: colors.successBg, fg: colors.success },
  brand: { bg: colors.brand, fg: colors.onBrand },
  dark: { bg: "rgba(0,0,0,0.6)", fg: colors.textInverse },
};

/**
 * Small read-only status label ("Paid", "Awaiting pickup", "New").
 * tone: neutral | warning | danger | success | brand | dark
 */
export default function StatusPill({ label, tone = "neutral", style }) {
  const t = tones[tone] || tones.neutral;
  return (
    <View style={[styles.pill, { backgroundColor: t.bg }, style]}>
      <Text variant="label" style={{ color: t.fg, letterSpacing: 0 }}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
});
