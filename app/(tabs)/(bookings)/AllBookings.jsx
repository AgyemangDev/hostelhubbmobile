// app/(tabs)/(bookings)/AllBookings.jsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import BookingList from "../../../components/BookingsComponent/BookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const AllBookings = ({ navigation }) => {
  const { bookings, loading: contextLoading, error } = useBookingsContext();
  const [processedBookings, setProcessedBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (contextLoading) return;

    setLoading(true);

    try {
      if (!bookings || bookings.length === 0) {
        setProcessedBookings([]);
        setLoading(false);
        return;
      }

      // Apply 5% increment to payment_option (price)
      const updatedBookings = bookings.map((booking) => ({
        ...booking,
        payment_option: booking.payment_option
          ? parseFloat(booking.payment_option) * 1.05
          : 0,
      }));

      setProcessedBookings(updatedBookings);
    } catch (err) {
      console.error("Error processing bookings:", err);
      setProcessedBookings([]);
    } finally {
      setLoading(false);
    }
  }, [bookings, contextLoading]);

  if (contextLoading || loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading bookings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: "red" }}>Error fetching bookings: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {processedBookings.length === 0 ? (
        <EmptyState message="No Bookings Found." />
      ) : (
        <BookingList userBookings={processedBookings} navigation={navigation} />
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

export default AllBookings;
