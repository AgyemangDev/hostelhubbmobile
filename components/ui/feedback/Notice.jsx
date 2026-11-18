import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Surface } from "react-native-paper";
import Text from "../typography/Text";
import { colors, radius, space } from "../../../constants/theme";

const tones = {
  info: { bg: colors.fill, fg: colors.text, icon: "information-circle-outline" },
  warning: { bg: colors.warningBg, fg: colors.warningText, icon: "time-outline" },
  danger: { bg: colors.dangerBg, fg: colors.danger, icon: "alert-circle-outline" },
  success: { bg: colors.successBg, fg: colors.success, icon: "shield-checkmark-outline" },
};

/**
 * Inline status message inside a screen.
 * tone: info | warning | danger | success
 * icon: overrides the tone's icon (Ionicons name)
 */
export default function Notice({ tone = "info", title, children, action, icon, style }) {
  const t = tones[tone] || tones.info;
  return (
    <Surface
      elevation={0}
      style={[styles.notice, { backgroundColor: t.bg }, style]}
      accessibilityRole={tone === "danger" ? "alert" : undefined}
    >
      <View style={styles.icon}>
        <Icon source={icon || t.icon} size={20} color={t.fg} />
      </View>
      <View style={styles.body}>
        {title ? <Text variant="bodyStrong" style={{ color: t.fg }}>{title}</Text> : null}
        {children ? <Text variant="caption" style={{ color: t.fg }}>{children}</Text> : null}
        {action ? <View style={styles.action}>{action}</View> : null}
      </View>
    </Surface>
  );
}

const styles = StyleSheet.create({
  notice: { flexDirection: "row", gap: space.sm, padding: space.sm + 2, borderRadius: radius.md },
  icon: { marginTop: 1 },
  body: { flex: 1, gap: 2 },
  action: { marginTop: space.xs },
});
