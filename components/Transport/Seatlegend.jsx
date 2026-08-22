import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const LegendDot = ({ color, border, icon, label }) => (
  <View style={styles.item}>
    <View style={[styles.box, { backgroundColor: color, borderColor: border }]}>
      {icon}
    </View>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const SeatLegend = () => (
  <View style={styles.legend}>
    <LegendDot
      color="#F0F4FF" border="#C8D6FF"
      icon={<Text style={styles.availableText}>12</Text>}
      label="Available"
    />
    <LegendDot
      color="#FFE8E8" border="#FFBBBB"
      icon={<Ionicons name="person" size={11} color="#E05555" />}
      label="Booked"
    />
    <LegendDot
      color="#22C55E" border="#16A34A"
      icon={<Ionicons name="checkmark" size={11} color="#fff" />}
      label="Selected"
    />
  </View>
);

export default SeatLegend;

const styles = StyleSheet.create({
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },
  availableText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#5B7FE8",
  },
});