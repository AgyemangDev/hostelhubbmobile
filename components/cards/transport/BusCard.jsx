import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon, StatusPill, Text } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

/** Seats left on a trip. UniGo sends a count; in-house buses send the seat map. */
const seatsLeft = (bus) => bus.seatsAvailable ?? (Array.isArray(bus.seats) ? bus.seats.filter((s) => s.status === "available").length : 0);

/** One bus in the search results. The whole card is the tap target. */
export default function BusCard({ bus, onSelect }) {
  const left = seatsLeft(bus);
  const full = left === 0;
  const route = bus.route || { from: "—", to: "—" };
  const price = money(bus.price, { decimals: 0 });

  return (
    <Card
      onPress={full ? undefined : () => onSelect(bus)}
      accessibilityLabel={`${bus.departureTime || ""} ${route.from} to ${route.to}, ${price}, ${full ? "fully booked" : `${left} seats left`}`}
      style={[styles.card, full && styles.full]}
    >
      <View style={styles.top}>
        <Text variant="title">{bus.departureTime || "—"}</Text>
        <Text variant="price">{price}</Text>
      </View>
      <Text variant="caption" tone="secondary" numberOfLines={1}>
        {route.from} → {route.to}
        {bus.pickupDate ? ` · ${bus.pickupDate}` : ""}
      </Text>
      <View style={styles.bottom}>
        <Text variant="caption" style={styles.meta} numberOfLines={1}>
          {[bus.name, bus.type].filter(Boolean).join(" · ")}
          {full ? "" : ` · ${left} seat${left === 1 ? "" : "s"} left`}
        </Text>
        {full ? (
          <StatusPill label="Fully booked" />
        ) : left <= 5 ? (
          <StatusPill label="Filling fast" tone="warning" />
        ) : (
          <Icon name="chevron-forward" size={18} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.xs },
  full: { opacity: 0.55 },
  top: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  bottom: { flexDirection: "row", alignItems: "center", gap: space.xs, marginTop: 2 },
  meta: { fontWeight: "600", flex: 1 },
});
