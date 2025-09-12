import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookingCard from "./BookingCard";
import StorageBookingCard from "./StorageBookingCard"; // 👈 new component

const BookingList = ({ userBookings, navigation }) => {
  console.log(userBookings)
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

    return null;
  };

  return (
    <FlatList
      data={userBookings}
      renderItem={renderBookingItem}
      keyExtractor={(item) =>
        item.type === "storage" ? item.bookingReference : item.id
      }
      contentContainerStyle={styles.listContainer}
      ListEmptyComponent={
        <Text style={styles.emptyText}>No bookings available.</Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#888",
  },
});

export default BookingList;
