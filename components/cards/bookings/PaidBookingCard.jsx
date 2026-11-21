import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "../../ui";
import { money } from "../../../utils/formatMoney";
import roomLabel from "../../../utils/roomLabel";
import { colors, elevation } from "../../../constants/theme";

const shortDate = (value, withYear = false) =>
  new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", ...(withYear ? { year: "numeric" } : {}) });

/**
 * A paid room booking. Same shape as StorageBookingCard so the two sit
 * evenly in the Paid Bookings list: photo and price on top, a status pill,
 * then the room and payment lines.
 */
const PaidBookingCard = ({ booking, onPress }) => {
  // booking.accommodation is null for a hubclip booking; its listing is under booking.hubclip.
  const listing = booking?.accommodation ?? booking?.hubclip ?? {};
  const hostelName = listing.accommodation_name || "Unnamed hostel";
  const moveIn = booking?.move_in_date ? new Date(`${String(booking.move_in_date).slice(0, 10)}T00:00:00`) : null;
  const roomLine = [roomLabel(booking?.room_type), moveIn ? `Moves in ${shortDate(moveIn)}` : null].filter(Boolean).join(" · ");
  const amount = Number(booking?.payment_option || 0);

  return (
    <Card onPress={onPress} padded={false} style={styles.card} accessibilityLabel={`${hostelName}, paid booking`}>
      {/* ---------- IMAGE + HEADER ---------- */}
      <View style={styles.topRow}>
        {listing.front_image ? (
          <Image source={{ uri: listing.front_image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Ionicons name="home-outline" size={26} color={colors.brand} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.title} numberOfLines={1}>{hostelName}</Text>
          {amount ? <Text style={styles.price}>{money(amount)}</Text> : null}
          {listing.location ? (
            <View style={styles.place}>
              <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
              <Text style={styles.placeText} numberOfLines={1}>{listing.location}</Text>
            </View>
          ) : null}
        </View>
      </View>

      {/* ---------- STATUS BADGE ---------- */}
      <View style={styles.status}>
        <Ionicons name="checkmark-circle-outline" size={14} color={colors.success} />
        <Text style={styles.statusText}>Paid</Text>
      </View>

      {/* ---------- ROOM + PAYMENT ---------- */}
      {roomLine ? (
        <View style={styles.line}>
          <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.lineText} numberOfLines={1}>{roomLine}</Text>
        </View>
      ) : null}
      {booking?.payment_date ? (
        <View style={styles.line}>
          <Ionicons name="receipt-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.lineText} numberOfLines={1}>Paid on {shortDate(booking.payment_date, true)}</Text>
        </View>
      ) : null}
    </Card>
  );
};

// Matches StorageBookingCard's card, header and status pill measurements.
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
  topRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 10 },
  image: { width: 70, height: 70, borderRadius: 8, backgroundColor: colors.brandSoft },
  placeholder: { alignItems: "center", justifyContent: "center" },
  headerInfo: { flex: 1, marginLeft: 12, gap: 2 },
  title: { fontWeight: "700", fontSize: 18, color: colors.text },
  place: { flexDirection: "row", alignItems: "center", gap: 3 },
  placeText: { flex: 1, fontSize: 13, color: colors.textSecondary },
  price: { fontWeight: "700", color: colors.brand, fontSize: 16 },
  status: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.success,
    backgroundColor: colors.successBg,
    marginBottom: 8,
  },
  statusText: { marginLeft: 6, fontSize: 12, fontWeight: "600", color: colors.success },
  line: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  lineText: { flex: 1, fontSize: 13, marginLeft: 6, color: colors.text, lineHeight: 18 },
});

export default PaidBookingCard;
