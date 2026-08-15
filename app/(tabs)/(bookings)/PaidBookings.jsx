import React, { useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, RefreshControl } from "react-native";
import PaidBookingList from "../../../components/BookingsComponent/PaidBookingList";
import EmptyState from "../../../components/BookingsComponent/EmptyState";
import { useBookingsContext } from "../../../context/BookingsContext";

const PaidBookings = ({ navigation, refreshing, onRefresh }) => {
  const { bookings, loading, error } = useBookingsContext();

  const paidBookings = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];
    return bookings
      .filter((booking) => {
        if (booking.type === "storage") return true;
        // UniGo trips carry their own status; only paid trips have a ticket.
        if (booking.type === "transport") return booking.status === "success";
        return booking.payment_status === true;
      })
      .map((booking) => {
        if (booking.type === "accommodation") {
          return {
            ...booking,
            payment_option: booking.payment_option
              ? parseFloat(booking.payment_option) * 1.05
              : 0,
          };
        }
        return booking;
      });
  }, [bookings]);

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
        onChanged={onRefresh}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default PaidBookings;