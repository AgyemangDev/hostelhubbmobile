import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BookingHeader = ({ bookingReference }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Storage Booking Details</Text>
      <View style={styles.referenceContainer}>
        <Text style={styles.label}>Booking Reference</Text>
        <Text style={styles.reference}>#{bookingReference}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#007AFF",
    textAlign: "center",
  },
  referenceContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  reference: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "700",
    marginTop: 4,
  },
});

export default BookingHeader;