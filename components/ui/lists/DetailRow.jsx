import React from "react";
import { StyleSheet, View } from "react-native";
import Button from "../buttons/Button";
import Text from "../typography/Text";
import { space } from "../../../constants/theme";

/**
 * One label/value fact: receipts, booking summaries, tickets.
 *
 * variant: inline (default) — label left, value right ("Service fee   GH₵ 12")
 *          stacked — small uppercase label over a bold value ("PICKUP / Hall 7")
 *          total — inline, both bold, for the last line of a receipt
 * align:   "end" right-aligns a stacked row (second column of a ticket)
 * onEdit:  shows an "Edit" link (stacked rows on review screens)
 * placeholder: shown when value is empty (default "—")
 */
export default function DetailRow({ label, value, variant = "inline", align, onEdit, placeholder = "—", valueStyle, numberOfLines, style }) {
  const shown = value === undefined || value === null || value === "" ? placeholder : value;

  if (variant === "stacked") {
    return (
      <View style={[styles.stackedRow, style]}>
        <View style={[styles.stacked, align === "end" && styles.end]}>
          <Text variant="eyebrow">{label}</Text>
          <Text variant="bodyStrong" numberOfLines={numberOfLines ?? 2} style={[styles.strong, valueStyle]}>
            {shown}
          </Text>
        </View>
        {onEdit ? <Button title="Edit" variant="ghost" size="sm" onPress={onEdit} accessibilityLabel={`Edit ${label}`} /> : null}
      </View>
    );
  }

  const total = variant === "total";
  return (
    <View style={[styles.inline, style]}>
      <Text variant={total ? "bodyStrong" : "body"} tone={total ? "default" : "secondary"} style={styles.label}>
        {label}
      </Text>
      <Text variant={total ? "price" : "bodyStrong"} numberOfLines={numberOfLines} style={[styles.value, valueStyle]}>
        {shown}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  stackedRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: space.sm },
  stacked: { flex: 1, gap: 2, alignItems: "flex-start" },
  end: { alignItems: "flex-end" },
  strong: { fontWeight: "800" },
  inline: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: space.md, paddingVertical: 6 },
  label: { flex: 1 },
  value: { textAlign: "right", flexShrink: 1 },
});
