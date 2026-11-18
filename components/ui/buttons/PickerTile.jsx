import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import Text from "../typography/Text";
import { colors, radius, space } from "../../../constants/theme";

/**
 * Large dashed tile that opens a picker ("Add a video", "Add a photo").
 * variant: default (tall, centred) | compact (row, for lists of uploads)
 */
export default function PickerTile({ icon = "add", title, subtitle, onPress, loading, disabled, variant = "default", style }) {
  const compact = variant === "compact";
  return (
    <TouchableRipple
      onPress={onPress}
      disabled={disabled || loading}
      borderless
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ busy: Boolean(loading), disabled: Boolean(disabled) }}
      style={[styles.tile, compact && styles.compact, style]}
    >
      {loading ? (
        <ActivityIndicator color={colors.text} />
      ) : (
        <View style={[styles.inner, compact && styles.innerCompact]}>
          <View style={styles.icon}>
            <Icon source={icon} size={24} color={colors.text} />
          </View>
          <View style={compact ? styles.textCompact : styles.text}>
            <Text variant="bodyStrong">{title}</Text>
            {subtitle ? <Text variant="caption" tone="secondary" style={!compact && styles.center}>{subtitle}</Text> : null}
          </View>
        </View>
      )}
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  tile: {
    minHeight: 180,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceSunken,
    alignItems: "center",
    justifyContent: "center",
    padding: space.lg,
  },
  compact: { minHeight: 72, alignItems: "stretch", padding: space.md },
  inner: { alignItems: "center", gap: 2 },
  innerCompact: { flexDirection: "row", gap: space.sm },
  icon: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: space.xs },
  text: { alignItems: "center", gap: 2 },
  textCompact: { flex: 1, gap: 2, justifyContent: "center" },
  center: { textAlign: "center" },
});
