import React from "react";
import { StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { colors, type } from "../../../constants/theme";

/** 2-4 choices sharing the width of a form. Paper's SegmentedButtons. Used by Tabs variant="segmented". */
export default function SegmentedTabs({ options, value, onChange, style }) {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={onChange}
      style={style}
      buttons={options.map((o) => ({
        value: o.value,
        label: o.label,
        icon: o.icon,
        accessibilityLabel: o.label,
        checkedColor: colors.textInverse,
        uncheckedColor: colors.text,
        style: [styles.segment, o.value === value && styles.selected],
        labelStyle: [type.caption, styles.label],
      }))}
    />
  );
}

const styles = StyleSheet.create({
  segment: { minHeight: 44, justifyContent: "center", borderColor: colors.borderStrong },
  selected: { backgroundColor: colors.text, borderColor: colors.text },
  label: { fontWeight: "700", letterSpacing: 0 },
});
