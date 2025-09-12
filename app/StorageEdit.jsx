import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const StorageEdit = () => {
  const { booking } = useLocalSearchParams();
  const parsedBooking = booking ? JSON.parse(booking) : null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const [day, month, year] = dateStr.includes("/") ? dateStr.split("/") : [null, null, null];
    return day && month && year ? `${day}-${month}-${year}` : dateStr;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {parsedBooking ? (
        <>
          <Text style={styles.title}>Storage Booking Details</Text>

          {/* Booking Reference */}
          <View style={styles.section}>
            <Text style={styles.label}>Booking Reference</Text>
            <Text style={styles.value}>#{parsedBooking.bookingReference}</Text>
          </View>

          {/* Personal Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{parsedBooking.firstName} {parsedBooking.lastName}</Text>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{parsedBooking.email}</Text>
            <Text style={styles.label}>Phone</Text>
            <Text style={styles.value}>{parsedBooking.phone}</Text>
          </View>

          {/* Dates */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Dates</Text>
            <Text style={styles.label}>Booking Date</Text>
            <Text style={styles.value}>{formatDate(parsedBooking.bookingDate)}</Text>
            <Text style={styles.label}>Pickup Date</Text>
            <Text style={styles.value}>{formatDate(parsedBooking.pickupDate)}</Text>
            <Text style={styles.label}>Delivery Date</Text>
            <Text style={styles.value}>{formatDate(parsedBooking.deliveryDate)}</Text>
          </View>

          {/* Locations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Locations</Text>
            <Text style={styles.label}>Pickup Location</Text>
            <Text style={styles.value}>{parsedBooking.pickupLocation}</Text>
            <Text style={styles.label}>Delivery Location</Text>
            <Text style={styles.value}>{parsedBooking.deliveryLocation}</Text>
          </View>

          {/* Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Items</Text>
            {parsedBooking.items?.length > 0 ? (
              parsedBooking.items.map((item, index) => (
                <View key={index} style={styles.itemRow}>
                  <Text style={styles.value}>• {item.quantity} x {item.category} @ ₵{item.unitPrice}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.value}>No items listed.</Text>
            )}
          </View>

          {/* Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Summary</Text>
            <Text style={styles.label}>Status</Text>
            <Text style={styles.value}>{parsedBooking.status}</Text>
            <Text style={styles.label}>Total Price</Text>
            <Text style={styles.value}>₵{parsedBooking.totalPrice}</Text>
          </View>
        </>
      ) : (
        <Text style={styles.notFound}>Booking data not found.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#007AFF",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  label: {
    fontSize: 12,
    color: "#666",
    textTransform: "uppercase",
    marginTop: 8,
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#111",
    fontWeight: "500",
    marginTop: 2,
  },
  itemRow: {
    marginBottom: 4,
  },
  notFound: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginTop: 40,
  },
});

export default StorageEdit;
