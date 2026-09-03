import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import PaidBookingCard from "./PaidBookingCard";
import StorageBookingCard from "./StorageBookingCard";
import TransportBookingCard from "../Cards/transport/TransportBookingCard";
import { useNavigation, useRouter } from "expo-router";

const PaidBookingList = ({ userBookings, navigation, onChanged }) => {
  const navHook = useNavigation();
  // expo-router screens don't get a `navigation` prop automatically the way
  // React Navigation stack screens do — fall back to the hook if the caller
  // didn't (or couldn't) pass one down.
  const nav = navigation || navHook;
  const router = useRouter();

  const renderBookingItem = ({ item }) => {
    if (item.type === "accommodation") {
      return (
        <PaidBookingCard
          booking={item}
          onPress={() =>
            nav.navigate('PaidBookingDetails', { bookingId: item.id })
          }
        />
      );
    }

    if (item.type === "storage") {
      return (
        <StorageBookingCard
          booking={item}
          onPress={() =>
            nav.navigate("StorageBookingDetails", {
              booking: JSON.stringify(item),
            })
          }
        />
      );
    }

    // Bus trips live in UniGo's system; the Ticket screen loads them by group ref.
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

export default PaidBookingList;