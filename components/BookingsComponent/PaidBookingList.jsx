import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import PaidBookingCard from "./PaidBookingCard";
import StorageBookingCard from "./StorageBookingCard";
import { useNavigation } from "expo-router";

const PaidBookingList = ({ userBookings }) => {
  const navigation = useNavigation();
  const renderBookingItem = ({ item }) => {
    if (item.type === "accommodation") {
      return (
<PaidBookingCard
  booking={item}
  onPress={() =>
    navigation.navigate('PaidBookingDetails', { bookingId: item.id })
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

export default PaidBookingList;
