import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "react-native-paper";
import Text from "../typography/Text";
import { colors, radius, space } from "../../../constants/theme";

/**
 * Title row at the top of a section.
 *
 * subtitle: grey line under the title
 * hint:     short grey note on the right of the title ("Up to 90s")
 * icon:     Ionicons name in a soft tile on the left
 * badge:    number or short text in a brand circle on the left ("1", "2", "3")
 * right:    trailing node (an "Edit" or "See all" button)
 * variant:  default (heading) | small (body strong, for sections inside cards)
 */
export default function SectionHeader({ title, subtitle, hint, icon, badge, right, variant = "default", style }) {
  return (
    <View style={[styles.row, style]}>
      {badge !== undefined && badge !== null ? (
        <View style={styles.badge}>
          <Text variant="label" tone="inverse">{badge}</Text>
        </View>
      ) : null}
      {icon ? (
        <View style={styles.icon}>
          <Icon source={icon} size={18} color={colors.brand} />
        </View>
      ) : null}
      <View style={styles.text}>
        <View style={styles.titleRow}>
          <Text variant={variant === "small" ? "bodyStrong" : "heading"} accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {hint ? <Text variant="caption" tone="secondary">{hint}</Text> : null}
        </View>
        {subtitle ? <Text variant="caption" tone="secondary">{subtitle}</Text> : null}
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm },
  badge: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.brand, alignItems: "center", justifyContent: "center" },
  icon: { width: 34, height: 34, borderRadius: radius.sm, backgroundColor: colors.brandSoft, alignItems: "center", justifyContent: "center" },
  text: { flex: 1, gap: 2 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", gap: space.sm },
  title: { flexShrink: 1 },
});
