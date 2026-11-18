import React from "react";
import { StyleSheet, View } from "react-native";
import { Switch } from "react-native-paper";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

/** A labelled setting with Paper's Switch ("Same as pickup", "Decide later"). */
export default function ToggleRow({ label, description, value, onValueChange, disabled, style }) {
  return (
    <View style={[styles.row, disabled && styles.disabled, style]}>
      <View style={styles.text}>
        <Text variant="bodyStrong">{label}</Text>
        {description ? <Text variant="caption" tone="secondary">{description}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} color={colors.text} accessibilityLabel={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 48 },
  disabled: { opacity: 0.45 },
  text: { flex: 1, gap: 2 },
});
