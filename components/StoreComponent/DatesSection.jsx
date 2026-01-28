import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '../../utils/dateUtils';

const DatesSection = ({ dates }) => {
  const { bookingDate, pickupDate, deliveryDate } = dates;

  const dateItems = [
    { label: "Booked", value: formatDate(bookingDate), icon: "calendar" },
    { label: "Pickup", value: formatDate(pickupDate), icon: "arrow-up-circle" },
    { label: "Delivery", value: formatDate(deliveryDate), icon: "arrow-down-circle" },
  ];

  return (
    <View style={styles.section}>
      {dateItems.map((item, index) => (
        <View key={index} style={styles.dateRow}>
          <View style={styles.labelContainer}>
            <Ionicons name={item.icon} size={16} color="#6B7280" />
            <Text style={styles.label}>{item.label}</Text>
          </View>
          <Text style={styles.value}>{item.value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  label: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },
});

export default DatesSection;