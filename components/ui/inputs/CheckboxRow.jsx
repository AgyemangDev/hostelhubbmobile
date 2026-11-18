import React from "react";
import { StyleSheet, View } from "react-native";
import { Checkbox, TouchableRipple } from "react-native-paper";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

/**
 * A checkbox with its label; the whole row is the tap target. Paper's Checkbox.
 * label: string, or a node when part of it is a link
 * variant: default | compact (caption-size label, for terms under a button)
 */
export default function CheckboxRow({ checked, onChange, label, variant = "default", disabled, style }) {
  return (
    <TouchableRipple
      onPress={() => onChange?.(!checked)}
      disabled={disabled}
      borderless
      accessibilityRole="checkbox"
      accessibilityState={{ checked: Boolean(checked), disabled: Boolean(disabled) }}
      style={[styles.row, style]}
    >
      <View style={styles.inner}>
        <Checkbox.Android status={checked ? "checked" : "unchecked"} color={colors.text} uncheckedColor="#A8A29E" disabled={disabled} />
        {typeof label === "string" ? (
          <Text variant={variant === "compact" ? "caption" : "body"} style={styles.label}>
            {label}
          </Text>
        ) : (
          <View style={styles.label}>{label}</View>
        )}
      </View>
    </TouchableRipple>
  );
}

const styles = StyleSheet.create({
  row: { borderRadius: 8 },
  inner: { flexDirection: "row", alignItems: "center", gap: space.xxs, minHeight: 44, marginLeft: -8 },
  label: { flex: 1 },
});
