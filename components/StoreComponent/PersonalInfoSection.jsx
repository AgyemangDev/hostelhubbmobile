import { View, Text, StyleSheet } from "react-native";
import React from "react";

const PersonalInfoSection = ({ formData }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Name</Text>
          <Text style={styles.infoValue}>{`${formData.firstName} ${formData.lastName}`}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoValue}>{formData.email}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Phone</Text>
          <Text style={styles.infoValue}>{formData.phone || "Not provided"}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a2b4b",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoContainer: {
    backgroundColor: "#f9fafb",
    borderRadius: 10,
    overflow: "hidden",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  infoLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#4b5563",
    flex: 1,
  },
  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "400",
    flex: 2,
    textAlign: "right",
  },
});

export default PersonalInfoSection;
