// TransportBookingCard.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

/**
 * A UniGo bus trip in the Bookings tab.
 *
 * These bookings live in UniGo's system rather than HostelHubb's, so the card
 * says so — the passenger boards a UniGo bus, and support questions about the
 * trip belong to UniGo.
 */
const STATUS_META = {
  success: { label: "Confirmed", color: COLORS.success, icon: "checkmark-circle" },
  pending: { label: "Awaiting payment", color: COLORS.warning, icon: "time-outline" },
  partial: { label: "Partly paid", color: COLORS.warning, icon: "alert-circle-outline" },
  failed: { label: "Payment failed", color: COLORS.error, icon: "close-circle-outline" },
};

const TransportBookingCard = ({ booking, onPress }) => {
  const meta = STATUS_META[booking.status] || STATUS_META.pending;
  const seats = booking.seatNumbers?.join(", ");

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconWrap}>
            <Ionicons name="bus" size={16} color={COLORS.button} />
          </View>
          <View>
            <Text style={styles.title}>Bus trip</Text>
            <Text style={styles.subtitle}>via UniGo Transport</Text>
          </View>
        </View>

        <View style={[styles.statusPill, { backgroundColor: `${meta.color}18` }]}>
          <Ionicons name={meta.icon} size={12} color={meta.color} />
          <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
        </View>
      </View>

      <View style={styles.routeRow}>
        <Text style={styles.city} numberOfLines={1}>
          {booking.from}
        </Text>
        <Ionicons name="arrow-forward" size={14} color={COLORS.textFaint} />
        <Text style={[styles.city, styles.cityRight]} numberOfLines={1}>
          {booking.to}
        </Text>
      </View>

      <View style={styles.metaRow}>
        {booking.departureTime ? (
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>{booking.departureTime}</Text>
          </View>
        ) : null}
        {seats ? (
          <View style={styles.metaChip}>
            <Ionicons name="person-outline" size={12} color={COLORS.textMuted} />
            <Text style={styles.metaText}>
              {booking.seatCount > 1 ? `Seats ${seats}` : `Seat ${seats}`}
            </Text>
          </View>
        ) : null}
        <View style={styles.metaChip}>
          <Ionicons name="pricetag-outline" size={12} color={COLORS.textMuted} />
          <Text style={styles.metaText}>GH₵{Number(booking.total || 0).toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.reference}>{booking.partnerRef}</Text>
        <View style={styles.cta}>
          <Text style={styles.ctaText}>
            {booking.status === "success" ? "View ticket" : "Continue"}
          </Text>
          <Ionicons name="chevron-forward" size={14} color={COLORS.button} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TransportBookingCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#EFEFEF",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${COLORS.button}15`,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 14, fontWeight: "700", color: COLORS.textDark },
  subtitle: { fontSize: 11, color: COLORS.textFaint },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  routeRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  city: { flex: 1, fontSize: 15, fontWeight: "700", color: COLORS.textDark },
  cityRight: { textAlign: "right" },
  metaRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F5F6F8",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaText: { fontSize: 11, color: COLORS.textMuted, fontWeight: "500" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 10,
  },
  reference: { fontSize: 11, color: COLORS.textFaint },
  cta: { flexDirection: "row", alignItems: "center", gap: 2 },
  ctaText: { fontSize: 13, fontWeight: "700", color: COLORS.button },
});
