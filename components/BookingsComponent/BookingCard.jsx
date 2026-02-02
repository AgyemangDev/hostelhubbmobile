import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';

const BookingCard = ({ booking }) => {
  const navigation = useNavigation();

  // Get hostel info
  const hostelName = booking.hostelName || booking.hostelInfo?.accommodation_name || "Unknown Hostel";
  const imageUri = booking.frontImage || booking.hostelInfo?.images?.[0];
  const adminId = booking.adminUid || booking.accommodation_owner_id;

  const formatRoomType = (roomType) => {
    if (!roomType) return "N/A";
    return roomType
      .replace(/(\d+)/, (match) => `${match} `)
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  const handlePayNowPress = () => {
    navigation.navigate("PayNow", {
      bookingData: booking,
      hostelData: booking.hostelInfo,
      adminId: adminId
    });
  };

  const getStatusConfig = () => {
    switch (booking.status) {
      case "pending":
        return {
          icon: "time-outline",
          color: "#FF9500",
          bgColor: "#FFF3E0",
          label: "Pending Approval"
        };
      case "accepted":
        return {
          icon: "checkmark-circle",
          color: "#34C759",
          bgColor: "#E8F5E9",
          label: booking.paymentStatus ? "Confirmed" : "Ready to Pay"
        };
      case "paid":
        return {
          icon: "checkmark-circle",
          color: "#34C759",
          bgColor: "#E8F5E9",
          label: "Paid"
        };
      case "cancelled":
        return {
          icon: "close-circle",
          color: "#FF3B30",
          bgColor: "#FFEBEE",
          label: "Cancelled"
        };
      default:
        return {
          icon: "information-circle-outline",
          color: "#8E8E93",
          bgColor: "#F2F2F7",
          label: booking.status
        };
    }
  };

  const statusConfig = getStatusConfig();
  const showPayButton = booking.status === "accepted" && !booking.paymentStatus;

  return (
    <View style={styles.container}>
      {/* Image and Basic Info Section */}
      <View style={styles.contentWrapper}>
        <View style={styles.imageContainer}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={[styles.image, styles.placeholderImage]}>
              <Ionicons name="bed-outline" size={32} color="#C7C7CC" />
            </View>
          )}
          {/* Status Badge Overlay */}
          <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
            <Ionicons name={statusConfig.icon} size={12} color={statusConfig.color} />
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.hostelName} numberOfLines={1}>
            {hostelName}
          </Text>
          <View style={styles.roomRow}>
            <Ionicons name="key-outline" size={14} color="#8E8E93" />
            <Text style={styles.roomType} numberOfLines={1}>
              {formatRoomType(booking.selectedRoomType || booking.room_type)}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Total:</Text>
            <Text style={styles.price}>
              GHC {((booking.selectedPayment || booking.payment_option) * 1.05).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Status and Action Section */}
      <View style={styles.footerSection}>
        <View style={[styles.statusChip, { backgroundColor: statusConfig.bgColor }]}>
          <Ionicons name={statusConfig.icon} size={14} color={statusConfig.color} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>

        {showPayButton && (
          <TouchableOpacity style={styles.payButton} onPress={handlePayNowPress}>
            <LinearGradient
              colors={['#34C759', '#30B350']}
              style={styles.payButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="card-outline" size={16} color="#fff" />
              <Text style={styles.payButtonText}>Pay Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {booking.status === "pending" && (
          <Text style={styles.helperText}>
            Awaiting acceptance
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  contentWrapper: {
    flexDirection: "row",
    padding: 14,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  statusBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "space-between",
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1C1C1E",
    marginBottom: 4,
  },
  roomRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  roomType: {
    fontSize: 13,
    color: "#8E8E93",
    marginLeft: 6,
    flex: 1,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  priceLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginRight: 6,
  },
  price: {
    fontSize: 17,
    fontWeight: "700",
    color: "#34C759",
  },
  footerSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 5,
  },
  payButton: {
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  payButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  helperText: {
    fontSize: 12,
    color: "#8E8E93",
    fontStyle: "italic",
  },
});

export default BookingCard;