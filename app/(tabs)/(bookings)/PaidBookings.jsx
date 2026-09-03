import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from "react-native";
import PaidBookingList from "../../../components/BookingsComponent/PaidBookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const PaidBookings = ({ navigation, refreshing, onRefresh }) => {
  const { bookings, storageBookings, transportBookings, loading, error, refetchTransport } =
    useBookingsContext();

  const paidBookings = useMemo(() => {
    const paidHostelBookings = (bookings || [])
      .filter((booking) => booking.payment_status === true)
      .map((booking) => ({
        ...booking,
        payment_option: booking.payment_option
          ? parseFloat(booking.payment_option) * 1.05
          : 0,
      }));

    // Storage bookings don't carry a payment_status flag — a storage booking
    // only exists once it's paid for, so every one here counts as paid.
    const paidStorageBookings = storageBookings || [];

    // Only a UniGo trip that actually went through has a ticket.
    const paidTransportBookings = (transportBookings || []).filter(
      (booking) => booking.status === "success"
    );

    return [...paidHostelBookings, ...paidStorageBookings, ...paidTransportBookings];
  }, [bookings, storageBookings, transportBookings]);

  if (loading && !refreshing) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: "#666" }}>Loading paid bookings...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={{ color: "red" }}>
          Error fetching bookings: We are currently facing errors fetching your bookings. If it persists, kindly contact customer care.
        </Text>
      </View>
    );
  }

  if (paidBookings.length === 0) {
    return (
      <ScrollView
        contentContainerStyle={styles.centered}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#10B981"]} />}
        style={styles.container}
      >
        <EmptyState message="No Paid Bookings Found." />
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <PaidBookingList
        userBookings={paidBookings}
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

export default PaidBookings;