import React from "react";
import { StyleSheet } from "react-native";
import { Badge } from "react-native-paper";
import { colors } from "../../../constants/theme";

const tones = {
  brand: { bg: colors.brand, fg: colors.onBrand },
  danger: { bg: colors.danger, fg: colors.textInverse },
  ink: { bg: colors.text, fg: colors.textInverse },
  light: { bg: colors.surface, fg: colors.text },
};

/**
 * Little number bubble pinned to the corner of an icon (cart count, active
 * filters, unread notifications). Paper's Badge. Hidden when count is 0.
 *
 * tone: danger (default) | brand | ink | light
 * floating: pin to the top-right of the parent (parent must not clip)
 * dot: a small dot with no number ("something new")
 */
export default function CountBadge({ count, tone = "danger", floating = true, max = 99, dot, style }) {
  const t = tones[tone] || tones.danger;
  const n = Number(count) || 0;
  return (
    <Badge
      visible={n > 0}
      size={dot ? 8 : 18}
      style={[styles.badge, { backgroundColor: t.bg, color: t.fg }, floating && (dot ? styles.floatingDot : styles.floating), style]}
    >
      {dot ? null : n > max ? `${max}+` : n}
    </Badge>
  );
}

const styles = StyleSheet.create({
  badge: { fontWeight: "800", fontSize: 11 },
  floating: { position: "absolute", top: -2, right: -2 },
  floatingDot: { position: "absolute", top: 8, right: 8 },
});
