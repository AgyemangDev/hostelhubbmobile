import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Text from "../typography/Text";
import { colors, palette, radius, space } from "../../../constants/theme";

const tones = {
  // Grey tile on white.
  default: { bg: colors.fill, fg: colors.text, sub: colors.textSecondary, border: "transparent" },
  // Translucent tile on a brand-coloured hero.
  onBrand: { bg: "rgba(255,255,255,0.1)", fg: colors.textInverse, sub: "rgba(255,255,255,0.7)", border: "transparent" },
  // Gold call-out on a brand-coloured hero (e.g. money earned).
  highlight: { bg: "rgba(242,201,76,0.15)", fg: palette.gold, sub: "rgba(255,255,255,0.7)", border: "rgba(242,201,76,0.3)" },
};

/**
 * Small number tile ("12 · Friends joined").
 * tone: default | onBrand | highlight
 * icon: Ionicons name above the value
 */
export default function StatCard({ label, value, icon, tone = "default", style }) {
  const t = tones[tone] || tones.default;
  return (
    <View style={[styles.card, { backgroundColor: t.bg, borderColor: t.border }, style]}>
      {icon ? <Icon source={icon} size={14} color={tone === "default" ? t.sub : t.fg === palette.gold ? palette.gold : t.sub} /> : null}
      <Text variant="heading" style={{ color: t.fg }}>{value}</Text>
      <Text variant="caption" style={[styles.label, { color: t.sub }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flex: 1, borderRadius: radius.md, padding: 10, alignItems: "center", gap: 4, borderWidth: 1 },
  label: { textAlign: "center", fontSize: 11, lineHeight: 14 },
});
