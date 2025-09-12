import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

const PaidBookingCard = ({ booking, onPress }) => {
  // Flatten data: prefer hostelInfo if available, else fallback to top-level
  const hostelName = booking?.hostelInfo?.hostelName || booking?.hostelName || "Unnamed Hostel";
  const imageUri = booking?.hostelInfo?.frontImage || booking?.frontImage || null;

  const formatRoomType = (roomType) => {
    return roomType
      .replace(/(\d+)/, (match) => `${match} `)
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Hostel Image */}
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      {/* Hostel Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{hostelName}</Text>
        <Text style={styles.roomType}>
          Room Type: {formatRoomType(booking.selectedRoomType)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  infoContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  roomType: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});

export default PaidBookingCard;
