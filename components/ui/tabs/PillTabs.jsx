import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Chip from "../chips/Chip";
import { space } from "../../../constants/theme";

/** Row of raised Paper chips; the selected one looks pushed in. Used by Tabs variant="pill". */
export default function PillTabs({ options, value, onChange, tone = "light", stretch, scroll, style, contentStyle }) {
  const pills = options.map((o) => (
    <Chip
      key={String(o.value)}
      label={o.label}
      icon={o.icon}
      selected={o.value === value}
      onPress={() => onChange(o.value)}
      tone={tone === "dark" ? "dark" : "raised"}
      stretch={stretch}
      accessibilityRole="tab"
    />
  ));
  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, styles.scroll, contentStyle]}
        style={style}
        accessibilityRole="tablist"
      >
        {pills}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.row, style]} accessibilityRole="tablist">
      {pills}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.xs, alignItems: "center" },
  // Room for the raised pills' shadows inside the horizontal scroller.
  scroll: { paddingVertical: 6, paddingHorizontal: 2 },
});
