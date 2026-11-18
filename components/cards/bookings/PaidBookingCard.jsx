import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui";
import { colors } from "../../../constants/theme";

const TEAL = "#0D9488";

const PaidBookingCard = ({ booking, onPress }) => {
  // Same fallback pattern as BookingCard.jsx — booking.accommodation is null
  // for a hubclip-type booking (its data lives under booking.hubclip
  // instead), so reading only the accommodation path left every paid
  // hubclip booking showing as "Unnamed Hostel" with no image.
  const hostelName =
    booking?.accommodation?.accommodation_name ??
    booking?.hubclip?.accommodation_name ??
    "Unnamed Hostel";

  const imageUri =
    booking?.accommodation?.front_image ??
    booking?.hubclip?.front_image ??
    null;

  const roomType = booking?.room_type;

  return (
    <Card onPress={onPress} padded={false} style={styles.card}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Ionicons name="home-outline" size={28} color="#99D8CE" />
        </View>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {hostelName}
        </Text>

        <Text style={styles.roomType}>Room Type: {roomType || "N/A"}</Text>

        <View style={styles.statusRow}>
          <View style={styles.paidBadge}>
            <Ionicons name="checkmark-circle" size={13} color={colors.textInverse} />
            <Text style={styles.paidBadgeText}>Paid</Text>
          </View>

          {booking.payment_date && (
            <Text style={styles.paidDate}>
              on {new Date(booking.payment_date).toDateString()}
            </Text>
          )}
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1.5,
    borderColor: TEAL,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
    backgroundColor: colors.brandSoft,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    padding: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  roomType: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: TEAL,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  paidBadgeText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: "600",
  },
  paidDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default PaidBookingCard;
