import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

const InfoRow = ({ label, value }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value} numberOfLines={1}>{value}</Text>
  </View>
);

/**
 * `passenger` wins when present — a booking can be made for someone other than
 * the signed-in account holder, and the ticket carries the passenger's details.
 */
const PassengerInfoCard = ({ passenger, userInfo, user }) => {
  const fullName =
    passenger?.name ||
    (userInfo?.first_name && userInfo?.surname
      ? `${userInfo.first_name} ${userInfo.surname}`
      : "—");
  const email = passenger?.email || userInfo?.email || user?.email || "—";
  const phone = passenger?.phone || userInfo?.phone_number || "";

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Ionicons name="person-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Passenger Information</Text>
      </View>
      <InfoRow label="Full Name" value={fullName} />
      <InfoRow label="Email" value={email} />
      {phone ? <InfoRow label="Phone" value={phone} /> : null}
    </View>
  );
};

export default PassengerInfoCard;

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