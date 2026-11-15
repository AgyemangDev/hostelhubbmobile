import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmptyState, PressableScale, StatusPill, money, useReducedMotion } from "../../ui/ds";
import { colors, radius, space, type } from "../../../constants/theme";

/** One bus in the search results. The whole card is the tap target. */
const BusCard = ({ bus, onSelect }) => {
  // UniGo's trip list sends a count instead of the seat map; fall back to
  // counting when a full seat array is present (in-house buses).
  const left =
    bus.seatsAvailable ?? (Array.isArray(bus.seats) ? bus.seats.filter((s) => s.status === "available").length : 0);
  const full = left === 0;
  const route = bus.route || { from: "—", to: "—" };

  return (
    <PressableScale
      onPress={() => !full && onSelect(bus)}
      disabled={full}
      accessibilityRole="button"
      accessibilityLabel={`${bus.departureTime || ""} ${route.from} to ${route.to}, ${money(bus.price, { decimals: 0 })}, ${full ? "fully booked" : `${left} seats left`}`}
      style={[styles.card, full && { opacity: 0.55 }]}
    >
      <View style={styles.top}>
        <Text style={styles.time}>{bus.departureTime || "—"}</Text>
        <Text style={type.price}>{money(bus.price, { decimals: 0 })}</Text>
      </View>
      <Text style={[type.caption, { color: colors.textSecondary }]} numberOfLines={1}>
        {route.from} → {route.to}{bus.pickupDate ? ` · ${bus.pickupDate}` : ""}
      </Text>
      <View style={styles.bottom}>
        <Text style={[type.caption, { fontWeight: "600", flex: 1 }]} numberOfLines={1}>
          {[bus.name, bus.type].filter(Boolean).join(" · ")}{full ? "" : ` · ${left} seat${left === 1 ? "" : "s"} left`}
        </Text>
        {full ? <StatusPill label="Fully booked" /> : left <= 5 ? <StatusPill label="Filling fast" tone="warning" /> : (
          <Ionicons name="chevron-forward" size={18} color={colors.text} />
        )}
      </View>
    </PressableScale>
  );
};

export default BusCard;

/** Calm pulsing placeholder while results load. */
export const BusCardSkeleton = () => {
  const v = useRef(new Animated.Value(0.5)).current;
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(v, { toValue: 0.5, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [v, reduced]);
  return (
    <Animated.View style={[styles.card, { opacity: v, gap: space.sm }]} accessibilityLabel="Loading buses">
      <View style={[styles.bar, { width: "40%", height: 22 }]} />
      <View style={[styles.bar, { width: "75%" }]} />
      <View style={[styles.bar, { width: "55%" }]} />
    </Animated.View>
  );
};

export const BusEmptyState = () => (
  <EmptyState icon="bus-outline" title="No buses on this route yet" body="Try another day or route. New trips are added close to the break." />
);

const styles = StyleSheet.create({
  card: { gap: space.xs, padding: space.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  time: { fontSize: 22, lineHeight: 28, fontWeight: "800", color: colors.text, letterSpacing: -0.3 },
  bottom: { flexDirection: "row", alignItems: "center", gap: space.xs, marginTop: 2 },
  bar: { height: 14, borderRadius: 7, backgroundColor: colors.fill },
});
