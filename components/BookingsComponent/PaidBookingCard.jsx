import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const PaidBookingCard = ({ booking, onPress }) => {
  // ✅ Correct data paths (based on your JSON)
  const hostelName =
    booking?.accommodation?.accommodation_name ?? "Unnamed Hostel";

  const imageUri =
    booking?.accommodation?.front_image ?? null;

  const roomType = booking?.room_type;

  const formatRoomType = (value) => {
    if (!value) return "N/A"; // ✅ guard
    return value.replace(/([A-Z])/g, " $1").trim();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.infoContainer}>
        <Text style={styles.title}>{hostelName}</Text>

        <Text style={styles.roomType}>
          Room Type: {formatRoomType(roomType)}
        </Text>

        {/* Optional but recommended */}
        {booking.payment_date && (
          <Text style={styles.paidDate}>
            Paid on {new Date(booking.payment_date).toDateString()}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  roomType: {
    marginTop: 6,
    fontSize: 14,
    color: "#6B7280",
  },
  paidDate: {
    marginTop: 6,
    fontSize: 12,
    color: "#10B981",
    fontWeight: "500",
  },
});

export default PaidBookingCard;
