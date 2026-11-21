// StorageBookingCard.jsx
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { getStatusMeta } from "../../../utils/bookingStatus";
import { UserContext } from "../../../context/UserContext";
import API_BASE_URL from "../../../utils/api/api";
import { Button, Card } from "../../ui";
import { colors, elevation } from "../../../constants/theme";
import { DEMO } from "../../../constants/demo";

// Delivery info can be changed until the day before the first delivery date.
// Update this single value for each new cycle.

const StorageBookingCard = ({ booking, onPress }) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [currentPickupStatus, setCurrentPickupStatus] = useState(booking.pickup_status);
  const [currentDeliveryStatus, setCurrentDeliveryStatus] = useState(booking.delivery_status);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const effectivePickupStatus = currentPickupStatus || booking.pickup_status;
  const effectiveDeliveryStatus = currentDeliveryStatus || booking.delivery_status;
  const statusMeta = getStatusMeta(effectivePickupStatus, effectiveDeliveryStatus);

  // Firestore's Storage docs use totalPrice/bookingReference — fall back to
  // price/id in case an older shape is ever passed in.
  const displayPrice = Number(booking.totalPrice ?? booking.price ?? 0);
  const displayRef = booking.bookingReference ?? booking.id ?? "";

  const isPickupPending = effectivePickupStatus === "pending";
  const isPickupCompleted = effectivePickupStatus === "picked_up" || effectivePickupStatus === "completed";
  const isDelivered = effectiveDeliveryStatus === "completed" || effectiveDeliveryStatus === "delivered";

  const confirmReceivedItems = () => {
    Alert.alert(
      "Confirm Delivery",
      "Have you received all your items? This will mark your order as delivered successfully.",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => updateStudentStatus("delivered") },
      ],
      { cancelable: true }
    );
  };

  const confirmPickedUp = () => {
    Alert.alert(
      "Confirm Pickup",
      "Have all your items been picked up from you? This will update your order status successfully.",
      [
        { text: "No", style: "cancel" },
        { text: "Yes", onPress: () => updateStudentStatus("picked_up") },
      ],
      { cancelable: true }
    );
  };

  const updateStudentStatus = async (action) => {
    if (!user || updatingStatus) return;
    setUpdatingStatus(true);
    try {
      if (__DEV__ && DEMO) {
        const { demoBookings } = require("../../../services/demoData");
        const { order } = await demoBookings.updateStorage(booking.id, action);
        setCurrentPickupStatus(order.pickup_status);
        setCurrentDeliveryStatus(order.delivery_status);
        return;
      }
      const token = await user.getIdToken(false);
      const response = await fetch(`${API_BASE_URL}/bookings/storage/${booking.id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update storage status");
      setCurrentPickupStatus(result.order.pickup_status);
      setCurrentDeliveryStatus(result.order.delivery_status);
    } catch (error) {
      Alert.alert("Unable to update booking", error.message);
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Determine status text and location
  let statusText = "";
  let locationIcon = "";

  if (isPickupPending) {
    // Items awaiting pick up at location
    statusText = `Items awaiting pick up at ${booking.pickup_info?.area || "Pending"}`;
    locationIcon = "cube-outline";
  } else if (isPickupCompleted && !isDelivered) {
    // Items picked up at location, to be delivered at location
    statusText = `Items picked up at ${booking.pickup_info?.area || "Unknown"}`;
    locationIcon = "checkmark-done-outline";
  } else if (isDelivered) {
    // Items delivered at location
    statusText = `Items delivered at ${booking.delivery_info?.area || "Unknown"}`;
    locationIcon = "home-outline";
  } else {
    statusText = "Status unknown";
    locationIcon = "help-circle-outline";
  }

  // Add delivery destination if picked up but not delivered
  let deliveryDestText = "";
  if (isPickupCompleted && !isDelivered && booking.delivery_info?.area) {
    deliveryDestText = `Items to be delivered at ${booking.delivery_info.area}`;
  }

  // Students who chose "decide later" during booking have no delivery
  // location on file yet — offer to add one right from the card, as long
  // as the order hasn't already been delivered.
  const hasDeliveryLocation = !!(
    booking.delivery_info?.area || booking.delivery_info?.hostel
  );
  const canAddDeliveryLocation = !hasDeliveryLocation && !isDelivered;

  // The delivery date can be changed until 07:00 on the currently booked day.
  const bookedDeliveryDate = booking.delivery_info?.date
    ? String(booking.delivery_info.date).slice(0, 10)
    : null;
  const deliveryDayStarted =
    !!bookedDeliveryDate &&
    Date.now() >= new Date(`${bookedDeliveryDate}T07:00:00Z`).getTime();
  const canChangeDeliveryDate = !isDelivered && !deliveryDayStarted;
  const canEditDeliveryInfo = false;
  const deliveryNote = "";

  return (
    <Card onPress={onPress} padded={false} style={styles.card}>
      {/* ---------- IMAGE + HEADER ---------- */}
      <View style={styles.topRow}>
        <Image source={{ uri: booking.image_url }} style={styles.image} />
        <View style={styles.headerInfo}>
          <View style={styles.nameAndId}>
            <Text style={styles.title}>Storage Booking</Text>
            <Text style={styles.ref}>#{displayRef.slice(0, 13)}</Text>
          </View>
          <Text style={styles.price}>GH₵{displayPrice.toFixed(2)}</Text>
        </View>
      </View>

      {/* ---------- STATUS BADGE ---------- */}
      <View style={[styles.status, { backgroundColor: statusMeta.bg, borderColor: statusMeta.border }]}>
        <Ionicons name={statusMeta.icon} size={14} color={statusMeta.color} />
        <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
      </View>

      {/* ---------- PICKUP/DELIVERY STATUS TEXT ---------- */}
      <View style={styles.statusTextRow}>
        <Ionicons name={locationIcon} size={16} color={colors.textSecondary} />
        <Text style={styles.statusDescription} numberOfLines={2}>
          {statusText}
        </Text>
      </View>

      {/* ---------- DELIVERY DESTINATION (if picked up but not delivered) ---------- */}
      {deliveryDestText ? (
        <View style={styles.statusTextRow}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.statusDescription} numberOfLines={2}>
            {deliveryDestText}
          </Text>
        </View>
      ) : null}

      {/* ---------- DELIVERY NOTE ---------- */}
      {deliveryNote ? (
        <View style={styles.noteContainer}>
          <Ionicons
            name={canEditDeliveryInfo ? "information-circle-outline" : "alert-circle-outline"}
            size={14}
            color={canEditDeliveryInfo ? colors.brand : colors.danger}
          />
          <Text style={[styles.note, { color: canEditDeliveryInfo ? colors.brand : colors.danger }]}>
            {deliveryNote}
          </Text>
        </View>
      ) : null}

      {/* ---------- ADD DELIVERY LOCATION ---------- */}
      {!canAddDeliveryLocation && canChangeDeliveryDate ? (
        <Button title="Edit delivery details" icon="calendar-outline" variant="secondary" size="sm" onPress={() => router.push({ pathname: "/StorageEdit", params: { booking: JSON.stringify(booking) } })} />
      ) : null}

      {canAddDeliveryLocation ? (
        <Button title={canChangeDeliveryDate ? "Add location / edit details" : "Add delivery location"} icon="add-circle-outline" variant="secondary" size="sm" onPress={() => router.push({ pathname: "/StorageEdit", params: { booking: JSON.stringify(booking) } })} />
      ) : null}

      {!isDelivered && isPickupPending ? (
        <Button title="My items have been picked up" icon="cube-outline" variant="tonal" size="sm" loading={updatingStatus} onPress={confirmPickedUp} />
      ) : null}

      {!isDelivered && isPickupCompleted ? (
        <Button title="I have received my items" icon="checkmark-circle-outline" variant="tonal" size="sm" loading={updatingStatus} onPress={confirmReceivedItems} />
      ) : null}

      {isDelivered ? (
        <View style={styles.thankYouContainer}>
          <Ionicons name="heart-circle-outline" size={20} color={colors.success} />
          <Text style={styles.thankYouText}>Thank you for using HostelHubb Storage.</Text>
        </View>
      ) : null}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
    ...elevation.listCard,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: colors.fill,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nameAndId: {
    flex: 1,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  ref: {
    fontSize: 13,
    color: colors.text,
    fontFamily: "monospace",
  },
  price: {
    fontWeight: "700",
    color: colors.brand,
    fontSize: 16,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 8,
  },
  statusText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  statusDescription: {
    fontSize: 13,
    marginLeft: 6,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: colors.surfaceSunken,
    padding: 8,
    borderRadius: 6,
  },
  note: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  addLocationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.brand,
  },
  addLocationText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: colors.brand,
  },
  statusActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.brand,
  },
  statusActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textInverse,
  },
  thankYouContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: colors.brandSoft,
  },
  thankYouText: {
    marginLeft: 7,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.success,
  },
});

export default StorageBookingCard;