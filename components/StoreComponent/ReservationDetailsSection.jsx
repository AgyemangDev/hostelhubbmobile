import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ReservationDetailsSection = ({ formData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Reservation Details</Text>

      <View style={styles.detailBlock}>
        <Text style={styles.subTitle}>Pickup Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Pickup Date:</Text>
          <Text style={styles.value}>{formData.pickupDate || "Not selected"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Pickup Location:</Text>
          <Text style={styles.value}>{formData.pickupLocation || "Not provided"}</Text>
        </View>
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.subTitle}>Delivery Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Date:</Text>
          <Text style={styles.value}>{formData.deliveryDate || "Not selected"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Location:</Text>
          <Text style={styles.value}>{formData.deliveryLocation || "Not provided"}</Text>
        </View>
      </View>
    </View>
  );
};

export default ReservationDetailsSection;

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2563eb",
    marginBottom: 8,
  },
  detailBlock: {
    marginBottom: 16,
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4b5563",
  },
  value: {
    fontSize: 14,
    color: "#1f2937",
    textAlign: "right",
    flexShrink: 1,
    maxWidth: "55%",
  },
});
