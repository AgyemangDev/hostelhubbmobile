import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookingCard from "./BookingCard";

const BookingList = ({ userBookings, navigation }) => {
  // Filter only accommodation or hubclip bookings
  const accommodationBookings = userBookings.filter(
    (b) => b.type === "accommodation" || b.type === "hubclip"
  );

  const renderBookingItem = ({ item }) => (
    <BookingCard
      booking={item}
      onPress={() =>
        navigation.navigate("BookingDetails", { bookingData: item })
      }
    />
  );

  if (!accommodationBookings || accommodationBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={accommodationBookings}
      renderItem={renderBookingItem}
      keyExtractor={(item, index) =>
        item.type === "storage"
          ? item.bookingReference
          : item.id || `booking-${index}`
      }
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No bookings available.</Text>
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    color: "#888",
  },
});

export default BookingList;