import React from "react";
import { FlatList, Text, StyleSheet } from "react-native";
import PaidBookingCard from "../../cards/bookings/PaidBookingCard";
import StorageBookingCard from "../../cards/bookings/StorageBookingCard";
import TransportBookingCard from "../../cards/bookings/TransportBookingCard";
import { useNavigation, useRouter } from "expo-router";
import { colors } from "../../../constants/theme";

const PaidBookingList = ({ userBookings, navigation, onChanged }) => {
  const navHook = useNavigation();
  // expo-router screens don't get a `navigation` prop automatically the way
  // React Navigation stack screens do — fall back to the hook if the caller
  // didn't (or couldn't) pass one down.
  const nav = navigation || navHook;
  const router = useRouter();

  const renderBookingItem = ({ item }) => {
    // PaidBookingCard already reads both booking.accommodation and
    // booking.hubclip — this routing just never grew a "hubclip" case, so a
    // paid hubclip booking silently rendered as null (see the identical fix
    // in BookingList.jsx).
    if (item.type === "accommodation" || item.type === "hubclip") {
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
              pathname: "/(categories)/(transport)/unigo/Ticket",
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
        if (item.type === "storage") return `storage-${item.bookingReference || item.id || index}`;
        if (item.type === "transport") return `transport-${item.groupRef || index}`;
        return `booking-${item.id || index}`;
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
    color: colors.textMuted,
  },
});

export default PaidBookingList;