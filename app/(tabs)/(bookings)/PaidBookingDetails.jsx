import React, { useContext, useEffect, useState } from "react";
import { View, Text, ScrollView, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../../../context/UserContext";
import API_BASE_URL from "../../../utils/api/api";
import COLORS from "../../../constants/Colors";

const TEAL = "#0D9488";

// PaidBookingList.jsx has always navigated here with { bookingId }, but this
// screen read a nonexistent `item` param and tried to JSON.parse it — always
// undefined, so it showed "Booking not found" unconditionally regardless of
// which booking was tapped. Fetching by id (same pattern as PayNow.jsx) both
// fixes that and adds the missing hubclip fallback the accommodation-only
// version never had.
const PaidBookingDetails = () => {
  const { bookingId } = useLocalSearchParams();
  const { user } = useContext(UserContext);

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId || !user) return;

    let cancelled = false;

    (async () => {
      try {
        const token = await user.getIdToken(false);
        const res = await fetch(`${API_BASE_URL}/bookings/accommodation/fetch/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Booking not found");
        if (!cancelled) setBooking(data.booking);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [bookingId, user]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={TEAL} />
      </View>
    );
  }

  if (error || !booking) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Booking not found"}</Text>
      </View>
    );
  }

  const listing = booking.type === "hubclip" ? booking.hubclip : booking.accommodation;
  const name = listing?.accommodation_name || "Hostel";
  const imageUri = listing?.front_image || null;
  const managerName = `${booking.owner?.first_name || ""} ${booking.owner?.surname || ""}`.trim();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="home-outline" size={32} color="#99D8CE" />
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.title}>{name}</Text>

        <View style={styles.paidBadge}>
          <Ionicons name="checkmark-circle" size={13} color="#fff" />
          <Text style={styles.paidBadgeText}>Paid</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Room type</Text>
          <Text style={styles.value}>{booking.room_type || "N/A"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Amount paid</Text>
          <Text style={styles.value}>GHS {Number(booking.payment_option || 0).toFixed(2)}</Text>
        </View>

        {booking.payment_date && (
          <View style={styles.row}>
            <Text style={styles.label}>Paid on</Text>
            <Text style={styles.value}>{new Date(booking.payment_date).toDateString()}</Text>
          </View>
        )}

        {listing?.location && (
          <View style={styles.row}>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.value}>{listing.location}</Text>
          </View>
        )}

        {managerName && (
          <View style={styles.row}>
            <Text style={styles.label}>Manager</Text>
            <Text style={styles.value}>{managerName}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F9FAFB",
    paddingBottom: 32,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 14,
    color: "#B91C1C",
  },
  image: {
    width: "100%",
    height: 200,
    backgroundColor: "#F0FDFA",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: TEAL,
    margin: 16,
    padding: 18,
  },
  title: {
    fontSize: 19,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 14,
  },
  paidBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
});

export default PaidBookingDetails;
