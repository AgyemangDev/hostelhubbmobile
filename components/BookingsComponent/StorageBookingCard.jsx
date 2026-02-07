// StorageBookingCard.jsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getStatusMeta } from "../../utils/bookingStatus";
import COLORS from "../../constants/Colors";

const StorageBookingCard = ({ booking, onPress }) => {
  const statusMeta = getStatusMeta(booking.pickup_status, booking.delivery_status);

  const isPickupPending = booking.pickup_status === "pending";
  const isPickupCompleted = booking.pickup_status === "picked_up" || booking.pickup_status === "completed";
  const isDelivered = booking.delivery_status === "completed" || booking.delivery_status === "delivered";

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
            <Text style={styles.ref}>#{booking.id.slice(0, 13)}</Text>
          </View>
          <Text style={styles.price}>GH₵{booking.price.toFixed(2)}</Text>
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
});

export default StorageBookingCard;