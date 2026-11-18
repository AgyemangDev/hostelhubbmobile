import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, space, type } from "../../../constants/theme";

const ITEMS = [
  { label: "Free", style: { borderWidth: 1.5, borderColor: colors.borderStrong } },
  { label: "Yours", style: { backgroundColor: colors.text } },
  { label: "Taken", style: { backgroundColor: colors.border } },
];

export default function SeatLegend() {
  return (
    <View style={styles.row} accessibilityRole="text" accessibilityLabel="Seat key: outlined is free, dark is yours, grey is taken">
      {ITEMS.map((i) => (
        <View key={i.label} style={styles.item}>
          <View style={[styles.swatch, i.style]} />
          <Text style={[type.caption, { fontWeight: "600", color: colors.textSecondary }]}>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.lg, paddingHorizontal: space.lg, paddingVertical: space.sm },
  item: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 16, height: 16, borderRadius: 4 },
});
