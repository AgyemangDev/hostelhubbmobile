import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Card from "./Card";
import StatusPill from "../badges/StatusPill";
import Text from "../typography/Text";
import { colors, radius, space } from "../../../constants/theme";

const tones = {
  default: { card: "outlined", iconBg: colors.brandSoft, icon: colors.brand, title: colors.text, body: colors.textSecondary },
  brand: { card: null, bg: colors.brand, iconBg: "rgba(255,255,255,0.18)", icon: colors.onBrand, title: colors.onBrand, body: "rgba(255,255,255,0.85)" },
  soft: { card: "brand", iconBg: colors.surface, icon: colors.brand, title: colors.text, body: colors.textSecondary },
};

/**
 * Icon + title + short text, for explaining a feature or benefit.
 *
 * layout:   inline (default; icon left of the text) | stacked (icon above, for 2-3 across)
 * tone:     default (white) | soft (brand tint) | brand (solid brand, white text)
 * subtitle: small line under the title
 * badge:    short label next to the title ("NEW")
 * onPress:  makes the whole card tappable
 */
export default function FeatureCard({ icon, title, subtitle, body, badge, layout = "inline", tone = "default", onPress, style }) {
  const t = tones[tone] || tones.default;
  const stacked = layout === "stacked";
  return (
    <Card
      variant={t.card || "outlined"}
      onPress={onPress}
      style={[stacked ? styles.stacked : styles.inline, t.bg && { backgroundColor: t.bg, borderColor: t.bg }, style]}
    >
      {icon ? (
        <View style={[styles.icon, { backgroundColor: t.iconBg }]}>
          <Icon source={icon} size={20} color={t.icon} />
        </View>
      ) : null}
      <View style={stacked ? styles.textStacked : styles.text}>
        <View style={styles.titleRow}>
          <Text variant="bodyStrong" style={[styles.title, { color: t.title }]}>{title}</Text>
          {badge ? <StatusPill label={badge} tone={tone === "brand" ? "dark" : "brand"} /> : null}
        </View>
        {subtitle ? <Text variant="caption" style={{ color: t.body }}>{subtitle}</Text> : null}
        {body ? <Text variant="caption" style={{ color: t.body }}>{body}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  inline: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
  stacked: { flex: 1, gap: space.xs },
  icon: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: 2 },
  textStacked: { gap: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: space.xs, flexWrap: "wrap" },
  title: { flexShrink: 1 },
});
