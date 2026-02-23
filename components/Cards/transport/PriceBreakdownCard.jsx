import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import { storageItems, luggageItem } from "../../../assets/data/transport/storageItem";

const PriceRow = ({ label, value, bold, accent }) => (
  <View style={styles.row}>
    <Text style={[styles.label, bold && styles.boldText, accent && styles.accentText]}>
      {label}
    </Text>
    <Text style={[styles.value, bold && styles.boldText, accent && styles.accentText]}>
      {value}
    </Text>
  </View>
);

const PriceBreakdownCard = ({ selectedSeats, seatFee, quantities, storageFee, grandTotal }) => {
  const hasStorage = Object.values(quantities).some((q) => q > 0);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Payment Breakdown</Text>
      </View>

      {/* Seats */}
      <PriceRow
        label={`Seat${selectedSeats.length > 1 ? "s" : ""} × ${selectedSeats.length}`}
        value={`GH₵${seatFee.toFixed(2)}`}
      />

      {/* Storage items */}
      {hasStorage && (
        <>
          {Object.entries(quantities).map(([name, qty]) =>
            qty > 0 ? (
              <PriceRow
                key={name}
                label={`${name} × ${qty}`}
                value={
                  name === luggageItem.name
                    ? "GH₵0"
                    : `GH₵${((storageItems.find((i) => i.name === name)?.price || 0) * qty).toFixed(2)}`
                }
              />
            ) : null
          )}
          {quantities[luggageItem.name] > 0 && (
            <PriceRow label="Luggage handling fee" value="GH₵10.00" />
          )}
        </>
      )}

      <View style={styles.divider} />
      
      {/* Total */}
      <PriceRow
        label="Total Amount"
        value={`GH₵${grandTotal.toFixed(2)}`}
        bold
        accent
      />
    </View>
  );
};

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
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 6,
  },
});