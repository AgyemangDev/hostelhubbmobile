// app/(tabs)/(bookings)/components/BookingDetailsCard.jsx

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { normalizeFirebaseImageUrl } from "../../../utils/images/firebaseImageCheck";

const statusColors = {
  pending: "#F59E0B",
  accepted: "#2563EB",
  paid: "#10B981",
  cancelled: "#EF4444",
};

const BookingDetailsCard = ({
  accommodation,
  room_type,
  status,
  totalAmount,
  booking_date,
}) => {
  const imageUrl = normalizeFirebaseImageUrl(accommodation?.front_image);
  const statusColor = statusColors[status] || "#6B7280";

  return (
    <View style={styles.card}>
      {/* Image Header */}
      {imageUrl && (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      )}

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {accommodation?.accommodation_name}
          </Text>

          <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
            <Text style={styles.statusText}>{status}</Text>
          </View>
        </View>

        <Text style={styles.location}>
          {accommodation?.institution} • {accommodation?.location}
        </Text>

        <View style={styles.divider} />

        {/* Details */}
        <View style={styles.row}>
          <Text style={styles.label}>Room Type</Text>
          <Text style={styles.value}>{room_type || "N/A"}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Booking Date</Text>
          <Text style={styles.value}>
            {new Date(booking_date).toLocaleDateString()}
          </Text>
        </View>

        {/* Price */}
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Total Amount</Text>
          <Text style={styles.amount}>GHS {totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
};

export default BookingDetailsCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },

  image: {
    width: "100%",
    height: 240,
    backgroundColor: "#F3F4F6",
  },

  content: {
    padding: 16,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    flex: 1,
    marginRight: 8,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },

  location: {
    marginTop: 4,
    fontSize: 14,
    color: "#6B7280",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
   
  },

  label: {
    fontSize: 14,
    color: "#6B7280",
  },

  value: {
    fontSize: 14,
    fontWeight: "500",
    color: "#111827",
  },

  amountContainer: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    alignItems: "center",
  },

  amountLabel: {
    fontSize: 13,
    color: "#6B7280",
  },

  amount: {
    fontSize: 22,
    fontWeight: "800",
    color: "#10B981",
    marginTop: 4,
  },
});
