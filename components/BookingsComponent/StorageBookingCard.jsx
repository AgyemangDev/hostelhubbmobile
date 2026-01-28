import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getStatusMeta } from "../../utils/bookingStatus";

const StudentCard = ({ booking }) => {
  const router = useRouter();

  // ---------- FORMAT DATE ----------
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    if (
      dateString.includes("Day") ||
      dateString.includes("Monday") ||
      dateString.includes("Saturday") ||
      dateString.includes("Sunday")
    ) {
      return dateString;
    }

    let date;
    if (dateString.includes("/")) {
      const [day, month, year] = dateString.split("/");
      date = new Date(year, month - 1, day);
    } else {
      date = new Date(dateString);
    }

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });
  };

  const statusMeta = getStatusMeta(booking.status);

  const handleCardPress = () => {
    router.push({
      pathname: "/StorageEdit",
      params: { booking: JSON.stringify(booking) },
    });
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      style={styles.card}
      activeOpacity={0.95}
    >
      {/* ---------- HEADER ---------- */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="locker" size={20} color="#4A6FA5" />

        <View style={styles.headerInfo}>
          <Text style={styles.title}>Storage Booking</Text>
          <Text style={styles.reference}>#{booking.bookingReference}</Text>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ₵{Number(booking.totalPrice).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* ---------- STATUS BADGE ---------- */}
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: statusMeta.bg,
            borderColor: statusMeta.border,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={statusMeta.icon}
          size={14}
          color={statusMeta.color}
        />
        <Text style={[styles.statusText, { color: statusMeta.color }]}>
          {statusMeta.label}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* ---------- INFO SECTION ---------- */}
      <View style={styles.infoSection}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={14} color="#6B7280" />
          <Text style={styles.locationText} numberOfLines={1}>
            {booking.deliveryLocation || "Yet to be provided"}
          </Text>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Booked</Text>
            <Text style={styles.dateValue}>
              {formatDate(booking.bookingDate)}
            </Text>
          </View>

          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Pickup</Text>
            <Text style={styles.dateValue}>
              {formatDate(booking.pickupDate)}
            </Text>
          </View>

          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Delivery</Text>
            <Text style={styles.dateValue} numberOfLines={1}>
              {formatDate(booking.deliveryDate)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
  },
  reference: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "monospace",
  },
  priceContainer: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  price: {
    fontSize: 15,
    fontWeight: "700",
    color: "#047857",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginLeft: 16,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
  },
  infoSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 13,
    color: "#6B7280",
    marginLeft: 6,
    flex: 1,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    textTransform: "uppercase",
    fontWeight: "600",
    marginBottom: 3,
  },
  dateValue: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
});

export default StudentCard;