import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button } from "../../ui";
import { colors } from "../../../constants/theme";

const BookingCard = ({ booking }) => {
  const router = useRouter();

const hostelName = booking.accommodation?.accommodation_name || booking.hubclip?.accommodation_name || "Unknown Hostel";
const imageUri = booking.accommodation?.front_image || booking.hubclip?.front_image || null;

  const handlePayNowPress = () => {
    // PayNow fetches the full booking itself by id now — passing the whole
    // booking (image URL included) as a JSON string through a route param
    // was arriving corrupted for accommodation bookings specifically (their
    // Firebase Storage URLs contain characters that don't round-trip
    // cleanly through that encode/navigate/decode path), which is why the
    // property image never showed on that screen despite being present and
    // valid in the data.
    router.push({
      pathname: "/PayNow",
      params: { bookingId: booking.id },
    });
  };

const getStatusConfig = () => {
  if (booking.payment_status === true) {
    return { color: colors.success, label: "Paid" };
  }

  switch (booking.status) {
    case "pending":
      return { color: colors.warningText, label: "Pending" };
    case "accepted":
      return { color: colors.success, label: "Accepted" };
    case "cancelled":
      return { color: colors.danger, label: "Cancelled" };
    default:
      return { color: colors.textSecondary, label: booking.status };
  }
};


  const statusConfig = getStatusConfig();
  const showPayButton =
  booking.status === "accepted" && booking.payment_status === false;
    const lifecycleLabels = {
      awaiting_payment: "Awaiting payment",
      upcoming: "Upcoming move-in",
      active: "Active stay",
      completed: "Completed",
      expired: "Expired",
      cancelled: "Cancelled",
    };
    const lifecycleLabel = lifecycleLabels[booking.lifecycle_status];


  return (
    <View style={styles.card}>
      {/* Image and Main Info */}
      <View style={styles.content}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) =>
              console.warn("[BookingCard] Image failed to load:", imageUri, e.nativeEvent?.error)
            }
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={{ color: colors.textMuted }}>No Image</Text>
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.hostelName} numberOfLines={1}>
            {hostelName}
          </Text>

          <Text style={styles.roomType} numberOfLines={1}>
            {booking.room_type || "N/A"}
          </Text>

          <Text style={styles.price}>
          GHS {Number(booking.payment_option || 0).toLocaleString("en-GH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}
          </Text>
          {lifecycleLabel ? (
            <Text style={styles.lifecycle}>{lifecycleLabel}</Text>
          ) : null}
          {booking.move_in_date ? (
            <Text style={styles.dateText}>
              Move-in: {new Date(`${booking.move_in_date}T00:00:00`).toLocaleDateString("en-GH")}
            </Text>
          ) : null}
          {booking.payment_due_at && booking.lifecycle_status === "awaiting_payment" ? (
            <Text style={styles.dueText}>
              Payment due: {new Date(booking.payment_due_at).toLocaleDateString("en-GH")}
            </Text>
          ) : null}
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
          <Button title="Pay Now" icon="arrow-forward" iconPosition="right" size="sm" onPress={handlePayNowPress} />
        )}
      </View>
    </View>
  );
};

const TEAL = "#0D9488";

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
  content: {
    flexDirection: "row",
    padding: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: colors.brandSoft,
  },
  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#CCFBF1",
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "space-between",
  },
  hostelName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  roomType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "700",
    color: TEAL,
  },
  lifecycle: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.brand,
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 3,
  },
  dueText: {
    fontSize: 11,
    color: colors.warningText,
    marginTop: 3,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F0FDFA",
    backgroundColor: colors.brandSoft,
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
    backgroundColor: TEAL,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  payButtonText: {
    color: colors.textInverse,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default BookingCard;