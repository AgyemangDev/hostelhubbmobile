import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

const PriceRow = ({ label, value, bold, accent, muted }) => (
  <View style={styles.row}>
    <Text style={[styles.label, bold && styles.boldText, accent && styles.accentText, muted && styles.mutedText]}>
      {label}
    </Text>
    <Text style={[styles.value, bold && styles.boldText, accent && styles.accentText, muted && styles.mutedText]}>
      {value}
    </Text>
  </View>
);

const money = (amount) => `GH₵${Number(amount || 0).toFixed(2)}`;

/**
 * Payment breakdown for a UniGo trip.
 *
 * @param {{lines: Array<{label: string, amount: number, muted?: boolean}>, total: number}} props
 *   `lines` comes straight from UniGo's pricing response, so what the user sees
 *   here is exactly what Hubtel will charge.
 */
const PriceBreakdownCard = ({ lines = [], total = 0 }) => (
  <View style={styles.card}>
    <View style={styles.header}>
      <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
      <Text style={styles.title}>Payment Breakdown</Text>
    </View>

    {lines.map((line) => (
      <PriceRow key={line.label} label={line.label} value={money(line.amount)} muted={line.muted} />
    ))}

    <View style={styles.divider} />

    <PriceRow label="Total Amount" value={money(total)} bold accent />
  </View>
);

export default PriceBreakdownCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "600",
  },
  boldText: {
    fontSize: 16,
    fontWeight: "800",
  },
  accentText: {
    color: COLORS.primary,
  },
  mutedText: {
    fontSize: 13,
    color: COLORS.textFaint,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
});
