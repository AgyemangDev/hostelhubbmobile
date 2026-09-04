import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from "react-native";
import BookingList from "../../../components/BookingsComponent/BookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";
import BookingsSkeleton from "../../../components/Loading/BookingsSkeleton";

const AllBookings = ({ navigation, refreshing, onRefresh }) => {
  const { bookings, storageBookings, transportBookings, loading, error, refetchTransport } =
    useBookingsContext();

  // Derive processed bookings directly — no local state/effect needed
  const processedBookings = useMemo(() => {
    const enrichedHostelBookings = (bookings || []).map((booking) => ({
      ...booking,
      payment_option: booking.payment_option
        ? parseFloat(booking.payment_option) * 1.05
        : 0,
    }));

    // Unpaid bus trips belong here too: the seat hold is still running and this
    // list is where the user can go back and finish paying.
    const enrichedTransportBookings = (transportBookings || []).map((booking) => ({
      ...booking,
      bookingDate: booking.createdAt ? new Date(booking.createdAt).getTime() : 0,
    }));

    const combined = [
      ...enrichedHostelBookings,
      ...(storageBookings || []),
      ...enrichedTransportBookings,
    ];

    return combined.sort((a, b) => {
      if (a.acceptedDate && !b.acceptedDate) return -1;
      if (!a.acceptedDate && b.acceptedDate) return 1;
      if (a.acceptedDate && b.acceptedDate) return b.acceptedDate - a.acceptedDate;

      return (b.bookingDate || 0) - (a.bookingDate || 0);
    });
  }, [bookings, storageBookings, transportBookings]);

  if (loading && !refreshing) {
    return (
  <BookingsSkeleton count={5} />
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
        onChanged={refetchTransport}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default AllBookings;