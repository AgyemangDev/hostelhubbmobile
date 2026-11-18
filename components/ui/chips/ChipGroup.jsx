import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Chip from "./Chip";
import SectionHeader from "../headers/SectionHeader";
import { space } from "../../../constants/theme";

/**
 * A set of choice chips, optionally under a title.
 *
 * options:  [{ value, label, icon? }] (strings are accepted too)
 * value:    selected value (single) or array of values (multiple)
 * onChange: single → (value | null), tapping the selected chip clears it
 *           multiple → (nextArray)
 * onToggle: (value) — alternative to onChange when the caller keeps its own toggle logic
 * multiple: allow several selected
 * scroll:   one sideways-scrolling row instead of wrapping lines
 * tone:     any Chip tone
 */
export default function ChipGroup({ title, subtitle, options = [], value, onChange, onToggle, multiple, scroll, tone, style }) {
  const items = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const selected = multiple ? value || [] : value;
  const isOn = (v) => (multiple ? selected.includes(v) : selected === v);
  const press = (v) => {
    if (onToggle) onToggle(v);
    else if (multiple) onChange?.(isOn(v) ? selected.filter((x) => x !== v) : [...selected, v]);
    else onChange?.(isOn(v) ? null : v);
  };

  const chips = items.map((o) => (
    <Chip key={String(o.value)} label={o.label} icon={o.icon} tone={tone} selected={isOn(o.value)} onPress={() => press(o.value)} />
  ));

  return (
    <View style={[styles.group, style]}>
      {title ? <SectionHeader title={title} subtitle={subtitle} /> : null}
      {scroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
          {chips}
        </ScrollView>
      ) : (
        <View style={[styles.row, styles.wrap]}>{chips}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { gap: space.sm },
  row: { flexDirection: "row", gap: space.xs },
  wrap: { flexWrap: "wrap" },
});
