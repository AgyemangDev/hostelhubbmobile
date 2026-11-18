import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from "react-native";
import PaidBookingList from "../../../components/lists/bookings/PaidBookingList";
import { useBookingsContext } from "../../../context/BookingsContext";
import { PLATFORM_MARKUP_RATE } from "../../../constants/bookingConstants";
import { EmptyState } from "../../../components/ui";
import { colors } from "../../../constants/theme";

const PaidBookings = ({ navigation, refreshing, onRefresh }) => {
  const { bookings, storageBookings, transportBookings, loading, error, refetchTransport } =
    useBookingsContext();

  const paidBookings = useMemo(() => {
    const paidHostelBookings = (bookings || [])
      .filter((booking) => booking.payment_status === true)
      .map((booking) => ({
        ...booking,
        payment_option: booking.payment_option
          ? parseFloat(booking.payment_option) * PLATFORM_MARKUP_RATE
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
        <ActivityIndicator size="large" color={colors.success} />
        <Text style={{ marginTop: 10, color: colors.textSecondary }}>Loading paid bookings...</Text>
      </View>
    );
  }

if (error) {
  return (
    <View style={[styles.container, styles.centered]}>
      <EmptyState illustration="error"
        title="Couldn't load your bookings"
        body="We're currently having trouble fetching your bookings. If it persists, kindly contact customer care."
      />
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
        <EmptyState illustration="empty" title="No Paid Bookings Found." />
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
  container: { flex: 1, backgroundColor: colors.surface },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PaidBookings;