import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from "react-native";
import BookingList from "../../../components/BookingsComponent/BookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const AllBookings = ({ navigation, refreshing, onRefresh }) => {
  const { bookings, loading, error } = useBookingsContext();

  // Derive processed bookings directly — no local state/effect needed
  const processedBookings = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    return bookings.map((booking) => ({
      ...booking,
      payment_option: booking.payment_option
        ? parseFloat(booking.payment_option) * 1.05
        : 0,
    }));
  }, [bookings]);

  if (loading && !refreshing) {
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

  if (processedBookings.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#e74c3c"]} />}
        style={styles.container}
      >
        <EmptyState message="No Bookings Found." />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <BookingList
        userBookings={processedBookings}
        navigation={navigation}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AllBookings;