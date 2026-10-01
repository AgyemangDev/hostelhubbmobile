// StorageBookingCard.jsx
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useContext, useState } from "react";
import { getStatusMeta } from "../../utils/bookingStatus";
import COLORS from "../../constants/Colors";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

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
    locationIcon = "checkmark-circle-outline";
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

  // Calculate diffDays if delivery info exists
  let diffDays = null;
  let deliveryNote = "";

  if (booking.delivery_info?.date && !isDelivered) {
    const deliveryDate = new Date(booking.delivery_info.date);
    const now = new Date();
    const diffTime = deliveryDate - now;
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Show note only if not delivered
    if (diffDays >= 14) {
      deliveryNote = "Delivery info can still be updated.";
    } else if (diffDays >= 0) {
      deliveryNote = "Cannot change delivery info. Contact Customer Service.";
    }
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
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
        <Ionicons name={locationIcon} size={16} color="#6B7280" />
        <Text style={styles.statusDescription} numberOfLines={2}>
          {statusText}
        </Text>
      </View>

      {/* ---------- DELIVERY DESTINATION (if picked up but not delivered) ---------- */}
      {deliveryDestText ? (
        <View style={styles.statusTextRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.statusDescription} numberOfLines={2}>
            {deliveryDestText}
          </Text>
        </View>
      ) : null}

      {/* ---------- DELIVERY NOTE ---------- */}
      {deliveryNote ? (
        <View style={styles.noteContainer}>
          <Ionicons
            name={diffDays >= 14 ? "information-circle-outline" : "alert-circle-outline"}
            size={14}
            color={diffDays >= 14 ? "#3B82F6" : "#EF4444"}
          />
          <Text style={[styles.note, { color: diffDays >= 14 ? "#3B82F6" : "#EF4444" }]}>
            {deliveryNote}
          </Text>
        </View>
      ) : null}

      {/* ---------- ADD DELIVERY LOCATION ---------- */}
      {canAddDeliveryLocation ? (
        <TouchableOpacity
          style={styles.addLocationButton}
          onPress={() =>
            router.push({
              pathname: "/StorageEdit",
              params: { booking: JSON.stringify(booking) },
            })
          }
          activeOpacity={0.85}
        >
          <Ionicons name="add-circle-outline" size={16} color={COLORS.background} />
          <Text style={styles.addLocationText}>Add delivery location</Text>
        </TouchableOpacity>
      ) : null}

{!isDelivered && isPickupPending ? (
  <TouchableOpacity
    style={styles.statusActionButton}
    onPress={(event) => {
      event.stopPropagation?.();
      confirmPickedUp();
    }}
    disabled={updatingStatus}
    activeOpacity={0.85}
  >
    {updatingStatus ? <ActivityIndicator color={COLORS.background} /> : <Ionicons name="cube-outline" size={16} color={COLORS.background} />}
    <Text style={styles.statusActionText}>My items have been picked up</Text>
  </TouchableOpacity>
) : null}

{!isDelivered && isPickupCompleted ? (
  <TouchableOpacity
    style={styles.statusActionButton}
    onPress={(event) => {
      event.stopPropagation?.();
      confirmReceivedItems();
    }}
    disabled={updatingStatus}
    activeOpacity={0.85}
  >
    {updatingStatus ? <ActivityIndicator color={COLORS.background} /> : <Ionicons name="checkmark-circle-outline" size={16} color={COLORS.background} />}
    <Text style={styles.statusActionText}>I have received my items</Text>
  </TouchableOpacity>
) : null}

      {isDelivered ? (
        <View style={styles.thankYouContainer}>
          <Ionicons name="heart-circle-outline" size={20} color="#047857" />
          <Text style={styles.thankYouText}>Thank you for using HostelHubb Storage.</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
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
    backgroundColor: "#F3F4F6",
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
    color: "#1F2937",
    marginBottom: 4,
  },
  ref: {
    fontSize: 13,
    color: "#333538",
    fontFamily: "monospace",
  },
  price: {
    fontWeight: "700",
    color: COLORS.background,
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
    color: "#374151",
    flex: 1,
    lineHeight: 18,
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    backgroundColor: "#F9FAFB",
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
    borderColor: COLORS.background,
  },
  addLocationText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.background,
  },
  statusActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  statusActionText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
  },
  thankYouContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#ECFDF5",
  },
  thankYouText: {
    marginLeft: 7,
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#047857",
  },
});

export default StorageBookingCard;