import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Button } from "../../ui";
import DeadlineTimer from "../../feedback/bookings/DeadlineTimer";
import RemindHostelButton from "../../buttons/bookings/RemindHostelButton";
import { money } from "../../../utils/formatMoney";
import roomLabel from "../../../utils/roomLabel";
import { colors, elevation } from "../../../constants/theme";

const STATUS = {
  paid: { label: "Paid", icon: "checkmark-circle-outline", fg: colors.success, bg: colors.successBg, border: colors.success },
  pending: { label: "Waiting for the hostel", icon: "time-outline", fg: colors.warningText, bg: colors.warningBg, border: colors.warningText },
  accepted: { label: "Accepted · pay to secure", icon: "checkmark-done-outline", fg: colors.brand, bg: colors.brandSoft, border: colors.brand },
  expired: { label: "Expired", icon: "close-circle-outline", fg: colors.textSecondary, bg: colors.fill, border: colors.border },
  cancelled: { label: "Cancelled", icon: "close-circle-outline", fg: colors.danger, bg: colors.dangerBg, border: colors.danger },
};

const shortDate = (value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

/**
 * A room booking in My Bookings. Same shape as StorageBookingCard and
 * PaidBookingCard. While the hostel hasn't replied it shows how long until the
 * system cancels it and a button to remind the hostel; once accepted it shows
 * how long is left to pay and the Pay now button.
 */
const BookingCard = ({ booking }) => {
  const router = useRouter();
  const listing = booking.accommodation ?? booking.hubclip ?? {};
  const hostelName = listing.accommodation_name || "Unknown hostel";

  const paid = booking.payment_status === true;
  const expired = booking.status === "expired" || booking.lifecycle_status === "expired";
  const pending = !paid && !expired && booking.status === "pending";
  const awaitingPayment = !paid && !expired && booking.status === "accepted";
  const status = paid ? STATUS.paid
    : expired ? STATUS.expired
      : STATUS[booking.status] || { ...STATUS.expired, label: booking.status || "Unknown" };

  const moveIn = booking.move_in_date ? new Date(`${String(booking.move_in_date).slice(0, 10)}T00:00:00`) : null;
  const amount = Number(booking.payment_option || 0);

  // PayNow loads the booking by id; a JSON route param corrupted image URLs.
  const payNow = () => router.push({ pathname: "/PayNow", params: { bookingId: booking.id } });

  return (
    <View style={styles.card}>
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
      <View style={[styles.status, { backgroundColor: status.bg, borderColor: status.border }]}>
        <Ionicons name={status.icon} size={14} color={status.fg} />
        <Text style={[styles.statusText, { color: status.fg }]}>{status.label}</Text>
      </View>

      {/* ---------- ROOM + DATES ---------- */}
      {booking.room_type ? (
        <View style={styles.line}>
          <Ionicons name="bed-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.lineText} numberOfLines={1}>{roomLabel(booking.room_type)}</Text>
        </View>
      ) : null}
      {moveIn ? (
        <View style={styles.line}>
          <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.lineText} numberOfLines={1}>Moves in {shortDate(moveIn)}</Text>
        </View>
      ) : null}

      {/* ---------- DEADLINE + ACTION ---------- */}
      {pending ? (
        <>
          <DeadlineTimer dueAt={booking.response_due_at} kind="response" />
          <RemindHostelButton bookingId={booking.id} />
        </>
      ) : null}

      {awaitingPayment ? (
        <>
          <DeadlineTimer dueAt={booking.payment_due_at} kind="payment" />
          <Button title={`Pay now · ${money(amount)}`} icon="lock-closed" size="sm" onPress={payNow} />
        </>
      ) : null}
    </View>
  );
};

// Matches StorageBookingCard / PaidBookingCard.
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
  price: { fontWeight: "700", color: colors.brand, fontSize: 16 },
  place: { flexDirection: "row", alignItems: "center", gap: 3 },
  placeText: { flex: 1, fontSize: 13, color: colors.textSecondary },
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
  statusText: { marginLeft: 6, fontSize: 12, fontWeight: "600" },
  line: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6 },
  lineText: { flex: 1, fontSize: 13, marginLeft: 6, color: colors.text, lineHeight: 18 },
});

export default BookingCard;
