import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Icon, TouchableRipple } from "react-native-paper";
import Sheet from "../sheets/Sheet";
import ListRow from "../lists/ListRow";
import Text from "../typography/Text";
import { FieldHelp, FieldLabel } from "./FieldLabel";
import { colors, radius, space } from "../../../constants/theme";

/**
 * Looks like a text field; tapping opens a bottom sheet of options.
 * options: string[] or [{ value, label, subtitle }]
 */
export default function SelectField({ label, value, placeholder = "Choose", options = [], onChange, sheetTitle, disabled, error, hint }) {
  const [open, setOpen] = useState(false);
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const current = items.find((o) => o.value === value);
  return (
    <View style={styles.wrap}>
      <FieldLabel>{label}</FieldLabel>
      <TouchableRipple
        onPress={() => setOpen(true)}
        disabled={disabled}
        borderless
        accessibilityRole="button"
        accessibilityLabel={`${label || sheetTitle || "Select"}: ${current ? current.label : placeholder}`}
        style={[styles.field, error && { borderColor: colors.danger }, disabled && { opacity: 0.5 }]}
      >
        <View style={styles.row}>
          <Text tone={current ? "default" : "muted"} style={[styles.value, current && { fontWeight: "600" }]} numberOfLines={1}>
            {current ? current.label : placeholder}
          </Text>
          <Icon source="chevron-down" size={18} color={colors.text} />
        </View>
      </TouchableRipple>
      <FieldHelp error={typeof error === "string" ? error : null} hint={hint} />
      <Sheet visible={open} onClose={() => setOpen(false)} title={sheetTitle || label}>
        <ScrollView style={styles.list} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {items.length === 0 ? (
            <Text tone="secondary" style={{ paddingVertical: space.md }}>Nothing to choose yet.</Text>
          ) : (
            items.map((o, i) => (
              <ListRow
                key={String(o.value)}
                title={o.label}
                subtitle={o.subtitle}
                selected={o.value === value}
                last={i === items.length - 1}
                onPress={() => {
                  onChange?.(o.value);
                  setOpen(false);
                }}
              />
            ))
          )}
        </ScrollView>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  field: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: "#A8A29E",
    borderRadius: radius.md,
    paddingHorizontal: space.sm + 2,
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  row: { flexDirection: "row", alignItems: "center", gap: space.xs },
  value: { flex: 1 },
  list: { maxHeight: 460 },
});
