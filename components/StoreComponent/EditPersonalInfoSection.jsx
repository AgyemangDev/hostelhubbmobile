import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EditPersonalInfoSection = ({ personalInfo }) => {
  const { firstName, lastName, email, phone } = personalInfo;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{firstName} {lastName}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Email Address</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Phone Number</Text>
        <Text style={styles.value}>{phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#1a1a1a",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 8,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: "#1a1a1a",
    fontWeight: "500",
  },
});

export default EditPersonalInfoSection;