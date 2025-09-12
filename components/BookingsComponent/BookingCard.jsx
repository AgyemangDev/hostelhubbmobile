import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../app/firebase/FirebaseConfig";

const BookingCard = ({ booking }) => {
  const navigation = useNavigation();
  
  // Normalize hostel info from either hostelInfo or top-level fields
  const normalizedHostelInfo = booking.hostelInfo || {
    hostelName: booking.hostelName,
    frontImage: booking.frontImage,
    managerId: booking.adminUid,
  };

  const imageUri = normalizedHostelInfo.frontImage;
  const adminId = normalizedHostelInfo.managerId;

  if (!normalizedHostelInfo.hostelName) {
    return null; // still don't render if no useful hostel data
  }

  const formatRoomType = (roomType) => {
    return roomType
      .replace(/(\d+)/, (match) => `${match} `)
      .replace(/([A-Z])/g, " $1")
      .trim();
  };

  const handlePayNowPress = () => {
    navigation.navigate("PayNow", {
      bookingData: booking,
      hostelData: normalizedHostelInfo,
      adminId: adminId
    });
  };

  const handleDelete = async () => {
    const bookingDoc = doc(db, "Bookings", booking.id);
    try {
      await deleteDoc(bookingDoc);
    } catch (error) {
      console.error("Error deleting booking: ", error);
    }
  };

  const renderStatusContent = () => {
    switch (booking.status) {
      case "pending":
        return (
          <View style={styles.pendingContainer}>
            <View style={styles.statusBadge}>
              <Ionicons name="time-outline" size={14} color="#f39c12" />
              <Text style={styles.pendingText}>Pending</Text>
            </View>
            <Text style={styles.pendingMessage}>
              Waiting for hostel manager's approval. You'll be able to pay once accepted.
            </Text>
          </View>
        );
     
      case "accepted":
        return (
          <View style={styles.acceptedContainer}>
            <View style={styles.statusBadge}>
              <Ionicons name="checkmark-circle-outline" size={14} color="#27ae60" />
              <Text style={styles.acceptedText}>Accepted</Text>
            </View>
            {!booking.paymentStatus && (
              <TouchableOpacity style={styles.payNowButton} onPress={handlePayNowPress}>
                <Text style={styles.payNowButtonText}>Pay Now</Text>
              </TouchableOpacity>
            )}
            {booking.paymentStatus && (
              <View style={styles.paidBadge}>
                <Ionicons name="card-outline" size={14} color="#27ae60" />
                <Text style={styles.paidText}>Paid</Text>
              </View>
            )}
          </View>
        );
     
      case "cancelled":
        return (
          <View style={styles.statusBadge}>
            <Ionicons name="close-circle-outline" size={14} color="#e74c3c" />
            <Text style={styles.cancelledText}>Cancelled</Text>
          </View>
        );
     
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardHeader}>
        <View style={styles.hostelInfo}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
          <View style={styles.details}>
            <Text style={styles.hostelName}>{normalizedHostelInfo.hostelName}</Text>
            <Text style={styles.roomType}>
              {formatRoomType(booking.selectedRoomType)}
            </Text>
            <Text style={styles.price}>GHC {(booking.selectedPayment * 1.05).toFixed(2)}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
      <View style={styles.statusSection}>
        {renderStatusContent()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,

    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  hostelInfo: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  roomType: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    fontWeight: "600",
    color: "#27ae60",
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#ffeaea",
  },
  statusSection: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  pendingContainer: {
    alignItems: "flex-start",
  },
  pendingText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f39c12",
    marginLeft: 4,
  },
  pendingMessage: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
    lineHeight: 18,
  },
  acceptedContainer: {
    alignItems: "flex-start",
  },
  acceptedText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27ae60",
    marginLeft: 4,
  },
  cancelledText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#e74c3c",
    marginLeft: 4,
  },
  payNowButton: {
    backgroundColor: "#27ae60",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  payNowButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  paidBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 8,
  },
  paidText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27ae60",
    marginLeft: 4,
  },
});

export default BookingCard;