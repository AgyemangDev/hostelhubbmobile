// StorageBookingDetails.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import { useLocalSearchParams } from "expo-router";

const StorageBookingDetails = () => {
  const { booking } = useLocalSearchParams();

    const parsedBooking = typeof booking === "string" ? JSON.parse(booking) : booking;


  // Determine status
  const isPickupPending = parsedBooking.pickup_status === "pending";
  const isPickupCompleted = parsedBooking.pickup_status === "picked_up" || parsedBooking.pickup_status === "completed";
  const isDelivered = parsedBooking.delivery_status === "completed" || parsedBooking.delivery_status === "delivered";

  // Format dates
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate timeline progress (0-100%)
  const getProgress = () => {
    if (isDelivered) return 100;
    if (isPickupCompleted) return 50;
    return 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order ID Card */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>#{parsedBooking.id}</Text>
          <Text style={styles.orderDate}>
            Storage placed on {formatDate(parsedBooking.order_date)}
          </Text>
        </View>

        {/* Status Timeline */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Status Timeline</Text>

          <View style={styles.timeline}>
            {/* Pickup Status */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIcon,
                    {
                      backgroundColor: isPickupCompleted
                        ? COLORS.success
                        : isPickupPending
                        ? COLORS.primary
                        : COLORS.textMuted,
                    },
                  ]}
                >
                  <Ionicons
                    name={isPickupCompleted ? "checkmark" : "cube-outline"}
                    size={20}
                    color={COLORS.white}
                  />
                </View>
                {!isDelivered && <View style={styles.timelineLine} />}
              </View>

              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  {isPickupCompleted ? "Items Picked Up" : "Awaiting Pickup"}
                </Text>
                <Text style={styles.timelineLocation}>
                  {parsedBooking.pickup_info?.area || "Location pending"}
                </Text>
                <Text style={styles.timelineDate}>
                  {formatDate(parsedBooking.pickup_info?.date)}
                  {parsedBooking.pickup_date && ` • ${formatTime(parsedBooking.pickup_date)}`}
                </Text>
              </View>
            </View>

            {/* Delivery Status */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View
                  style={[
                    styles.timelineIcon,
                    {
                      backgroundColor: isDelivered
                        ? COLORS.success
                        : isPickupCompleted
                        ? COLORS.primary
                        : COLORS.textMuted,
                    },
                  ]}
                >
                  <Ionicons
                    name={isDelivered ? "checkmark-circle" : "location-outline"}
                    size={20}
                    color={COLORS.white}
                  />
                </View>
              </View>

              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  {isDelivered ? "Items Delivered" : "Awaiting Delivery"}
                </Text>
                <Text style={styles.timelineLocation}>
                  {parsedBooking.delivery_info?.area || "Location pending"}
                </Text>
                <Text style={styles.timelineDate}>
                  {formatDate(parsedBooking.delivery_info?.date)}
                  {parsedBooking.delivery_date && ` • ${formatTime(parsedBooking.delivery_date)}`}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${getProgress()}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>{getProgress()}% Complete</Text>
          </View>
        </View>

        {/* Stored Items */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stored Items</Text>

          {parsedBooking.items?.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>GH₵{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>GH₵{parsedBooking.price.toFixed(2)}</Text>
          </View>
        </View>

        {/* Items Photo */}
        {parsedBooking.image_url && (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Items Photo</Text>
            <Image source={{ uri: parsedBooking.image_url }} style={styles.storedImage} />
          </View>
        )}

        {/* Location Details */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Location Details</Text>

          {/* Pickup Location */}
          <View style={styles.locationRow}>
            <View style={[styles.locationIconBox, { backgroundColor: COLORS.success + "20" }]}>
              <Ionicons name="cube-outline" size={24} color={COLORS.success} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Pickup Location</Text>
              <Text style={styles.locationValue}>
                {parsedBooking.pickup_info?.area || "Pending"}
              </Text>
              {parsedBooking.pickup_info?.hostel && (
                <Text style={styles.locationSubtext}>
                  Hostel: {parsedBooking.pickup_info.hostel}
                </Text>
              )}
              {parsedBooking.pickup_info?.offCampusArea && (
                <Text style={styles.locationSubtext}>
                  Off-campus: {parsedBooking.pickup_info.offCampusArea}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Delivery Location */}
          <View style={styles.locationRow}>
            <View style={[styles.locationIconBox, { backgroundColor: COLORS.primary + "20" }]}>
              <Ionicons name="location-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Delivery Location</Text>
              <Text style={styles.locationValue}>
                {parsedBooking.delivery_info?.area || "Pending"}
              </Text>
              {parsedBooking.delivery_info?.hostel && (
                <Text style={styles.locationSubtext}>
                  Hostel: {parsedBooking.delivery_info.hostel}
                </Text>
              )}
              {parsedBooking.delivery_info?.offCampusArea && (
                <Text style={styles.locationSubtext}>
                  Off-campus: {parsedBooking.delivery_info.offCampusArea}
                </Text>
              )}
            </View>
          </View>
        </View>


        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollView: {
    flex: 1,
  },
  orderIdCard: {
    backgroundColor: COLORS.background,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  orderIdLabel: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.8,
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    fontFamily: "monospace",
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 12,
    color: COLORS.white,
    opacity: 0.9,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    marginBottom: 16,
  },
  timeline: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 20,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  timelineLocation: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: COLORS.success,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 8,
    textAlign: "center",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.success,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.background,
  },
  storedImage: {
    width: "100%",
    height: 250,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  locationIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textDark,
    marginBottom: 4,
  },
  locationSubtext: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
});

export default StorageBookingDetails;