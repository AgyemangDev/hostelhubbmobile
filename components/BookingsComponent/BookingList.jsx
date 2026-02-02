// components/BookingsComponent/BookingList.jsx
import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookingCard from "./BookingCard";
import StorageBookingCard from "./StorageBookingCard";

const BookingList = ({ userBookings, navigation }) => {
  const renderBookingItem = ({ item }) => {

    if (item.type === "accommodation") {
      return (
        <BookingCard
          booking={item}
          onPress={() =>
            navigation.navigate("BookingDetails", { bookingId: item.id })
          }
        />
      );
    }

    if (item.type === "storage") {
      return (
        <StorageBookingCard
          booking={item}
          onPress={() =>
            navigation.navigate("StorageBookingDetails", {
              bookingId: item.bookingReference,
            })
          }
        />
      );
    }

    console.warn("No matching type for booking:", item.id, item.type);
    return null;
  };

  if (!userBookings || userBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userBookings}
      renderItem={renderBookingItem}
      keyExtractor={(item, index) =>
        item.type === "storage" ? item.bookingReference : item.id || `booking-${index}`
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
    padding: 10,
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