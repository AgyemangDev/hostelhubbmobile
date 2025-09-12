import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PaymentRange = ({ paymentRanges }) => {
  // The desired order for the room types
  const roomOrder = [
    "Apartment",
    "OneInARoom",
    "TwoInARoom",
    "ThreeInARoom",
    "FourInARoom",
  ];

  console.log("Payment Ranges", paymentRanges);

  // Function to format the room type (e.g., "ThreeInARoom" -> "Three In A Room")
  const formatRoomType = (roomType) => {
    return roomType.replace(/([A-Z])/g, " $1").trim();
  };

  // Get appropriate icon for room type
  const getRoomIcon = (roomType) => {
    const iconMap = {
      'OneInARoom': 'person',
      'TwoInARoom': 'people',
      'ThreeInARoom': 'people-outline',
      'FourInARoom': 'people-circle',
      'Apartment': 'home',
    };

    return iconMap[roomType] || 'bed';
  };

  // Determine if a room type is popular (for highlighting)
  const isPopular = (roomType) => {
    return roomType === "ThreeInARoom" || roomType === "TwoInARoom";
  };

  // Function to get sorted payment options for a room type
  const getSortedPaymentOptions = (roomType, options) => {
    if (roomType === "OneInARoom") {
      // Sort OneInARoom from highest to lowest price
      return [...options].sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    // Return original order for other room types
    return options;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accommodation Pricing</Text>
      {roomOrder.map((roomType, roomIndex) => {
        // Check if the room type exists in paymentRanges and has at least one entry
        if (paymentRanges.hasOwnProperty(roomType) && paymentRanges[roomType].length > 0) {
          const sortedOptions = getSortedPaymentOptions(roomType, paymentRanges[roomType]);
          
          return (
            <View
              key={roomIndex}
              style={[
                styles.roomTypeCard,
                isPopular(roomType) && styles.popularCard
              ]}
            >
              <View style={styles.roomTypeHeader}>
                <View style={styles.roomTypeIconContainer}>
                  <Ionicons name={getRoomIcon(roomType)} size={24} color="#610b0c" />
                </View>
                <Text style={styles.roomTypeName}>{formatRoomType(roomType)}</Text>
                {isPopular(roomType) && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>Popular</Text>
                  </View>
                )}
              </View>

              {/* Map through all payment options for this room type */}
              {sortedOptions.map((details, optionIndex) => (
                <View key={optionIndex} style={styles.paymentOption}>
                  <View style={styles.paymentDetailsRow}>
                    <View style={styles.leftSection}>
                      <Text style={styles.paymentDescription}>{details.description}</Text>
                    </View>
                    <View style={styles.rightSection}>
                      <Text style={styles.priceLabel}>Per Year</Text>
                      <Text style={styles.priceValue}>
                        GHc {(parseFloat(details.price) * 1.05).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          );
        }
        return null; // If the room type is not available, return null to not render anything
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {

  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  roomTypeCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  popularCard: {
    borderColor: "#610b0c",
    borderWidth: 2,
  },
  roomTypeHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  roomTypeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f8f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  roomTypeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  popularBadge: {
    backgroundColor: "#610b0c",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  paymentOption: {
    marginTop: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  paymentDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSection: {
    flex: 1,
    paddingRight: 12,
  },
  rightSection: {
    alignItems: "flex-end",
  },
  paymentDescription: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  availabilityText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  priceLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#610b0c",
  },
  unavailableContainer: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  unavailableText: {
    color: "#999",
    fontStyle: "italic",
  },
});

export default PaymentRange;