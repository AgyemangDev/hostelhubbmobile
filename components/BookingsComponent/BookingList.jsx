import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BookingCard from "./BookingCard";
import StorageBookingCard from "./StorageBookingCard"; // 👈 new component
import TransportBookingCard from "./TransportBookingCard";
import { useRouter } from "expo-router";

const BookingList = ({ userBookings, navigation, onChanged }) => {
  const router = useRouter();
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

    // An unpaid bus trip shows here too — its seat hold is still running, and
    // the card is the only place the user can resume that payment.
    if (item.type === "transport") {
      return (
        <TransportBookingCard
          booking={item}
          onChanged={onChanged}
          onPress={() =>
            router.push({
              pathname: "/(categories)/(transport)/Ticket",
              params: { groupRef: item.groupRef },
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
      keyExtractor={(item, index) => {
        if (item.type === "storage") return item.bookingReference;
        if (item.type === "transport") return item.groupRef;
        return item.id || `booking-${index}`;
      }}
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
