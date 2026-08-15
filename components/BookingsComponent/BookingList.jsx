import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import BookingCard from "./BookingCard";
import TransportBookingCard from "./TransportBookingCard";

const BookingList = ({ userBookings, navigation, onChanged }) => {
  const router = useRouter();

  // Accommodation, hubclips and bus trips. Transport is included at every
  // status — a trip still confirming must stay visible and reachable, or the
  // passenger has no way back to their ticket.
  const visibleBookings = userBookings.filter(
    (b) => b.type === "accommodation" || b.type === "hubclip" || b.type === "transport"
  );

  const renderBookingItem = ({ item }) => {
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

    return (
      <BookingCard
        booking={item}
        onPress={() => navigation.navigate("BookingDetails", { bookingData: item })}
      />
    );
  };

  if (!visibleBookings || visibleBookings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No bookings available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={visibleBookings}
      renderItem={renderBookingItem}
      keyExtractor={(item, index) => {
        if (item.type === "storage") return item.bookingReference;
        if (item.type === "transport") return item.groupRef;
        return item.id || `booking-${index}`;
      }}
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
