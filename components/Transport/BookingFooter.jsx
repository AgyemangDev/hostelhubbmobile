import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const BookingFooter = ({ selectedSeats, totalPrice, onContinue }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.footer,
      // Use the device's real bottom inset (home indicator / gesture bar).
      // Fall back to a small static value for old Android 3-button nav where insets.bottom is 0.
      { paddingBottom: insets.bottom || (Platform.OS === "android" ? 16 : 12) }
    ]}>
      {selectedSeats.length > 0 && (
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel} numberOfLines={1}>
            {selectedSeats.length} seat{selectedSeats.length > 1 ? "s" : ""} ·{" "}
            {selectedSeats.map((s) => `Seat ${s.number}`).join(", ")}
          </Text>
          <Text style={styles.total}>GH₵ {totalPrice}</Text>
        </View>
      )}
      <TouchableOpacity
        style={[styles.btn, selectedSeats.length === 0 && styles.btnDisabled]}
        onPress={onContinue}
        disabled={selectedSeats.length === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.btnText}>
          {selectedSeats.length === 0 ? "Select a Seat to Continue" : "Continue"}
        </Text>
        {selectedSeats.length > 0 && (
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BookingFooter;

const styles = StyleSheet.create({
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    elevation: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: "500",
    maxWidth: "65%",
  },
  total: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.textDark,
  },
  btn: {
    backgroundColor: COLORS.button,
    paddingVertical: 15,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  btnDisabled: {
    backgroundColor: "#D1D5DB",
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});