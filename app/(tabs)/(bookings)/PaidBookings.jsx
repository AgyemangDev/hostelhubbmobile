// app/(tabs)/(bookings)/PaidBookings.jsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import PaidBookingList from "../../../components/BookingsComponent/PaidBookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const PaidBookings = ({ navigation }) => {
  const { bookings, loading: contextLoading, error } = useBookingsContext();
  const [paidBookings, setPaidBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextLoading) return;

    setLoading(true);

    try {
      if (!bookings || bookings.length === 0) {
        setPaidBookings([]);
        return;
      }

      // ✅ Only PAID bookings
      const filtered = bookings
        .filter((booking) => booking.payment_status === true)
        .map((booking) => ({
          ...booking,
          payment_option: booking.payment_option
            ? parseFloat(booking.payment_option) * 1.05
            : 0,
        }));

      setPaidBookings(filtered);
    } catch (err) {
      console.error("Error processing paid bookings:", err);
      setPaidBookings([]);
    } finally {
      setLoading(false);
    }
  }, [bookings, contextLoading]);

  if (contextLoading || loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: "#666" }}>
          Loading paid bookings...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: "red" }}>
          Error fetching bookings: {error}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {paidBookings.length === 0 ? (
        <EmptyState message="No Paid Bookings Found." />
      ) : (
        <PaidBookingList
          userBookings={paidBookings}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PaidBookings;
