import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../../constants/Colors";

// ─── Shimmer Card ────────────────────────────────────────────────────────────

const ShimmerBox = ({ width, height, style }) => {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.75],
  });

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: 8, backgroundColor: "#E0E0E0", opacity },
        style,
      ]}
    />
  );
};

export const BusCardSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <ShimmerBox width="55%" height={18} />
      <ShimmerBox width={60} height={24} style={{ borderRadius: 20 }} />
    </View>
    <View style={styles.routeRow}>
      <ShimmerBox width={90} height={14} />
      <ShimmerBox width={20} height={14} />
      <ShimmerBox width={90} height={14} />
    </View>
    <View style={styles.metaRow}>
      <ShimmerBox width={80} height={13} />
      <ShimmerBox width={80} height={13} />
      <ShimmerBox width={80} height={13} />
    </View>
    <ShimmerBox width="100%" height={46} style={{ borderRadius: 14, marginTop: 16 }} />
  </View>
);

// ─── Empty State ─────────────────────────────────────────────────────────────

export const BusEmptyState = () => (
  <View style={styles.emptyContainer}>
    <View style={styles.emptyIconWrap}>
      <Ionicons name="bus-outline" size={52} color={COLORS.button} />
    </View>
    <Text style={styles.emptyTitle}>No Buses Found</Text>
    <Text style={styles.emptyMessage}>
      We couldn't find any buses for this route right now. This could be
      temporary — our team is always updating schedules.
    </Text>
    <View style={styles.contactCard}>
      <Ionicons name="headset-outline" size={20} color={COLORS.button} />
      <Text style={styles.contactText}>
        Please reach out to our friendly customer care team and we'll get you
        sorted out.
      </Text>
    </View>
  </View>
);

// ─── Bus Card ─────────────────────────────────────────────────────────────────

const BusCard = ({ bus, onSelect }) => {
  // UniGo's trip list sends a count instead of the seat map (it never exposes
  // who booked what); fall back to counting when a full seat array is present.
  const availableSeats =
    bus.seatsAvailable ??
    (Array.isArray(bus.seats) ? bus.seats.filter((s) => s.status === "available").length : 0);
  const totalSeats = bus.totalSeats || availableSeats || 1;
  const occupancyRatio = Math.min(1, Math.max(0, (totalSeats - availableSeats) / totalSeats));

  const seatColor =
    availableSeats === 0
      ? "#FF4D4D"
      : availableSeats <= 5
      ? "#FFA500"
      : COLORS.button;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.busName}>{bus.name || "Bus"}</Text>
          <Text style={styles.busType}>{bus.type}</Text>
        </View>
        <View style={[styles.priceBadge, { backgroundColor: COLORS.button + "15" }]}>
          <Text style={[styles.priceText, { color: COLORS.button }]}>
            GH₵ {bus.price}
          </Text>
        </View>
      </View>

      {/* Route */}
      <View style={styles.routeRow}>
        <View style={styles.routeStop}>
          <Ionicons name="radio-button-on" size={14} color={COLORS.button} />
          <Text style={styles.routeText} numberOfLines={1}>
            {bus.route.from}
          </Text>
        </View>
        <View style={styles.routeLine}>
          <View style={styles.routeDash} />
          <Ionicons name="bus" size={14} color={COLORS.textMuted} />
          <View style={styles.routeDash} />
        </View>
        <View style={styles.routeStop}>
          <Ionicons name="location" size={14} color="#FF4D4D" />
          <Text style={styles.routeText} numberOfLines={1}>
            {bus.route.to}
          </Text>
        </View>
      </View>

      {/* Meta Info */}
      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Ionicons name="time-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{bus.departureTime}</Text>
        </View>
        <View style={styles.metaChip}>
          <Ionicons name="calendar-outline" size={13} color={COLORS.textMuted} />
          <Text style={styles.metaText}>{bus.pickupDate}</Text>
        </View>
        <View style={styles.metaChip}>
          <Ionicons name="people-outline" size={13} color={seatColor} />
          <Text style={[styles.metaText, { color: seatColor }]}>
            {availableSeats} seats left
          </Text>
        </View>
      </View>

      {/* Seat occupancy bar */}
      <View style={styles.occupancyBarBg}>
        <View
          style={[
            styles.occupancyBarFill,
            {
              width: `${occupancyRatio * 100}%`,
              backgroundColor:
                occupancyRatio > 0.85 ? "#FF4D4D" : occupancyRatio > 0.6 ? "#FFA500" : COLORS.button,
            },
          ]}
        />
      </View>

      {/* Select Button */}
      <TouchableOpacity
        style={[
          styles.selectButton,
          availableSeats === 0 && { backgroundColor: "#ccc" },
        ]}
        onPress={() => availableSeats > 0 && onSelect(bus)}
        disabled={availableSeats === 0}
        activeOpacity={0.85}
      >
        <Text style={styles.selectButtonText}>
          {availableSeats === 0 ? "Fully Booked" : "Select Seats"}
        </Text>
        {availableSeats > 0 && (
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default BusCard;

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  busName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  busType: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    fontWeight: "500",
  },
  priceBadge: {
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: {
    fontWeight: "800",
    fontSize: 15,
  },

  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  routeStop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flex: 1,
  },
  routeText: {
    fontSize: 13,
    color: COLORS.textDark,
    fontWeight: "600",
    flex: 1,
  },
  routeLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 4,
  },
  routeDash: {
    width: 16,
    height: 1.5,
    backgroundColor: "#D0D0D0",
  },

  metaRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  occupancyBarBg: {
    height: 4,
    backgroundColor: "#EFEFEF",
    borderRadius: 4,
    marginBottom: 16,
    overflow: "hidden",
  },
  occupancyBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  selectButton: {
    backgroundColor: COLORS.button,
    paddingVertical: 14,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  selectButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 8,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.button + "12",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textDark,
    marginBottom: 10,
  },
  emptyMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  contactCard: {
    flexDirection: "row",
    backgroundColor: COLORS.button + "10",
    borderRadius: 16,
    padding: 16,
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 16,
    width: "100%",
  },
  contactText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    lineHeight: 20,
    fontWeight: "500",
  },
  contactActions: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  contactChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: COLORS.button,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  contactChipText: {
    fontSize: 13,
    color: COLORS.button,
    fontWeight: "600",
  },
});