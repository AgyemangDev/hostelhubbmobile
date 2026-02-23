import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={2}>{value}</Text>
  </View>
);

const TripInfoCard = ({ bus, selectedSeats }) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="bus-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Trip Details</Text>
      </View>
      <InfoRow label="Bus" value={bus?.name} />
      <InfoRow label="Route" value={`${bus?.route?.from} → ${bus?.route?.to}`} />
      <InfoRow label="Departure" value={bus?.departureTime || "—"} />
      <InfoRow
        label={`Seat${selectedSeats.length > 1 ? "s" : ""}`}
        value={selectedSeats.map((s) => `Seat ${s.number}`).join(", ")}
      />
    </View>
  );
};

export default TripInfoCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 14,
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
    textAlign: "right",
    flex: 1,
    marginLeft: 12,
  },
});