// StorageBookingDetails.jsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";
import { useLocalSearchParams } from "expo-router";

// Helper: safely parse a field that may already be an object, or may be a
// JSON string (as it comes straight out of the DB row), or may be missing.
const safeParse = (value, fallback) => {
  if (value == null) return fallback;
  if (typeof value === "object") return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const StorageBookingDetails = () => {
  const { booking } = useLocalSearchParams();

  const rawBooking = typeof booking === "string" ? JSON.parse(booking) : booking;

  // items / pickup_info / delivery_info are stored as JSON strings in the
  // DB row, so they need a second parse pass here.
  const parsedBooking = {
    ...rawBooking,
    items: safeParse(rawBooking.items, []),
    pickup_info: safeParse(rawBooking.pickup_info, {}),
    delivery_info: safeParse(rawBooking.delivery_info, {}),
  };

  // Real rows carry pickup_status / delivery_status (not a single flat
  // `status`) — same fields the booking card uses.
  const isPickupPending = parsedBooking.pickup_status === "pending";
  const isPickupCompleted =
    parsedBooking.pickup_status === "picked_up" || parsedBooking.pickup_status === "completed";
  const isDelivered =
    parsedBooking.delivery_status === "completed" || parsedBooking.delivery_status === "delivered";

  // Format dates — handles both ISO ("2025-09-11") and DD/MM/YYYY ("20/09/2025").
  const formatDate = (dateString) => {
    if (!dateString) return "Not scheduled";
    let date;
    if (typeof dateString === "string" && dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }
    if (isNaN(date.getTime())) return "Not scheduled";
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
    if (isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getProgress = () => {
    if (isDelivered) return 100;
    if (isPickupCompleted) return 50;
    return 0;
  };

  // DB field is `price` (a string, e.g. "69.98"); `totalPrice` doesn't
  // exist on the real row, so it was always falling back to 0.
  const totalAmount = Number(parsedBooking.totalPrice ?? parsedBooking.price ?? 0);
  const displayRef = parsedBooking.bookingReference ?? parsedBooking.id ?? "";

  const pickupArea = parsedBooking.pickup_info?.area;
  const pickupRoom = parsedBooking.pickup_info?.room;
  const pickupHostel = parsedBooking.pickup_info?.hostel;
  const pickupLocation =
    pickupHostel || pickupArea
      ? [pickupHostel, pickupArea, pickupRoom ? `Room ${pickupRoom}` : null]
          .filter(Boolean)
          .join(" • ")
      : null;

  const deliveryArea = parsedBooking.delivery_info?.area;
  const deliveryRoom = parsedBooking.delivery_info?.room;
  const deliveryHostel = parsedBooking.delivery_info?.hostel;
  const deliveryOffCampusArea = parsedBooking.delivery_info?.offCampusArea;
  const deliveryLocation =
    deliveryHostel || deliveryArea || deliveryOffCampusArea
      ? [deliveryHostel, deliveryOffCampusArea || deliveryArea, deliveryRoom ? `Room ${deliveryRoom}` : null]
          .filter(Boolean)
          .join(" • ")
      : null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Order ID Card */}
        <View style={styles.orderIdCard}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>#{String(displayRef).slice(0, 13)}</Text>
          <Text style={styles.orderDate}>
            Storage placed on {formatDate(parsedBooking.order_date ?? parsedBooking.bookingDate)}
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
                  {pickupLocation || "Location pending"}
                </Text>
                <Text style={styles.timelineDate}>
                  {formatDate(parsedBooking.pickup_date ?? parsedBooking.pickup_info?.date)}
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
                  {deliveryLocation || "Location pending"}
                </Text>
                <Text style={styles.timelineDate}>
                  {formatDate(parsedBooking.delivery_date ?? parsedBooking.delivery_info?.date)}
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
            <View key={item.id ?? index} style={styles.itemRow}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              ) : (
                <View style={[styles.itemImage, styles.itemImagePlaceholder]}>
                  <Ionicons name="cube-outline" size={22} color="#9CA3AF" />
                </View>
              )}
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.category || item.name || "Item"}</Text>
                <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                GH₵
                {Number(
                  item.totalPrice ?? (item.unitPrice ?? item.price ?? 0) * (item.quantity ?? 1)
                ).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalAmount}>GH₵{totalAmount.toFixed(2)}</Text>
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
              <Text style={styles.locationValue}>{pickupLocation || "Pending"}</Text>
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
              <Text style={styles.locationValue}>{deliveryLocation || "Pending"}</Text>
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
  itemImagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
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