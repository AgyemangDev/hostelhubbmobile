import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const BookingCard = ({ booking }) => {
  const router = useRouter();

  const hostelName = booking.accommodation?.accommodation_name || "Unknown Hostel";
  const imageUri = booking.accommodation?.front_image || null;

  const formatRoomType = (roomType) => {
    if (!roomType) return "N/A";
    return roomType.replace(/([A-Z])/g, " $1").trim();
  };

  const handlePayNowPress = () => {
    // Use router.push with query params
    router.push({
      pathname: "/PayNow",
      params: { booking: JSON.stringify(booking) } 
    });
  };

const getStatusConfig = () => {
  if (booking.payment_status === true) {
    return { color: "#10B981", label: "Paid" };
  }

  switch (booking.status) {
    case "pending":
      return { color: "#F59E0B", label: "Pending" };
    case "accepted":
      return { color: "#10B981", label: "Accepted" };
    case "cancelled":
      return { color: "#EF4444", label: "Cancelled" };
    default:
      return { color: "#6B7280", label: booking.status };
  }
};


  const statusConfig = getStatusConfig();
  const showPayButton =
  booking.status === "accepted" && booking.payment_status === false;


  return (
    <View style={styles.card}>
      {/* Image and Main Info */}
      <View style={styles.content}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ color: "#aaa" }}>No Image</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.hostelName} numberOfLines={1}>
            {hostelName}
          </Text>

          <Text style={styles.roomType} numberOfLines={1}>
            {formatRoomType(booking.room_type)}
          </Text>

          <Text style={styles.price}>
            GHS {(booking.payment_option ? parseFloat(booking.payment_option) * 1.05 : 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Status and Action */}
      <View style={styles.footer}>
        <View style={styles.status}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.color }]} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {showPayButton && (
          <TouchableOpacity
            style={styles.payButton}
            onPress={handlePayNowPress}
            activeOpacity={0.7}
          >
            <Text style={styles.payButtonText}>Pay Now</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  content: {
    flexDirection: "row",
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "500",
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  payButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BookingCard;