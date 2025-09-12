import { View, Text, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const StudentCard = ({ booking }) => {
  const router = useRouter();

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    // If it's already a descriptive string (like "1st Day (Saturday)"), return as is
    if (dateString.includes("Day") || dateString.includes("Monday") || dateString.includes("Saturday") || dateString.includes("Sunday")) {
      return dateString;
    }
    
    // Otherwise format as date
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
      year: "numeric",
    });
  };

  const canEdit = () => {
    if (!booking.deliveryDate) return false;
    // Skip validation for string-based delivery dates
    if (booking.deliveryDate.includes("Day")) return true;
    
    const deliveryDate = new Date(booking.deliveryDate);
    const oneWeekBefore = new Date(deliveryDate);
    oneWeekBefore.setDate(oneWeekBefore.getDate() - 7);
    return new Date() <= oneWeekBefore;
  };

  const handleCardPress = () => {
    router.push({
      pathname: "/StorageEdit",
      params: { booking: JSON.stringify(booking) },
    });
  };

  return (
    <TouchableOpacity onPress={handleCardPress} style={styles.card} activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="locker" size={26} color="#4A6FA5" />
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Storage Booking</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.currency}>₵</Text>
              <Text style={styles.price}>{booking.totalPrice}</Text>
            </View>
          </View>
          <Text style={styles.reference}>#{booking.bookingReference}</Text>
        </View>
      </View>

      <View style={styles.locationSection}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#6B7280" style={styles.locationIcon} />
          <Text style={styles.locationText} numberOfLines={2}>
            Delivery Location: {booking.deliveryLocation || "Yet to be provided"}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.datesSection}>
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Booked</Text>
          <Text style={styles.dateValue}>{formatDate(booking.bookingDate)}</Text>
        </View>
        <View style={styles.dateSeparator} />
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Pickup</Text>
          <Text style={styles.dateValue}>{formatDate(booking.pickupDate)}</Text>
        </View>
        <View style={styles.dateSeparator} />
        <View style={styles.dateColumn}>
          <Text style={styles.dateLabel}>Delivery</Text>
          <Text style={styles.dateValue} numberOfLines={2}>
            {formatDate(booking.deliveryDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EBF4FF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    shadowColor: "#4A6FA5",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    letterSpacing: -0.3,
  },
  reference: {
    fontSize: 13,
    color: "#64748B",
    fontFamily: "monospace",
    letterSpacing: 0.5,
    fontWeight: "500",
    marginTop: 2,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#BBF7D0",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  currency: {
    fontSize: 14,
    fontWeight: "600",
    color: "#059669",
  },
  price: {
    fontSize: 18,
    fontWeight: "800",
    color: "#047857",
    marginLeft: 2,
    letterSpacing: -0.5,
  },
  locationSection: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  locationIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#475569",
    flex: 1,
    lineHeight: 20,
    fontWeight: "500",
    letterSpacing: -0.1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 20,
  },
  datesSection: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FAFBFC",
  },
  dateColumn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 4,
  },
  dateSeparator: {
    width: 1,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 8,
  },
  dateLabel: {
    fontSize: 11,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
    lineHeight: 16,
    letterSpacing: -0.1,
  },
});

export default StudentCard;