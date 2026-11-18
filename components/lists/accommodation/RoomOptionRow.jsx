import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, ListRow, StatusPill, Text } from "../../ui";
import { money } from "../../../utils/formatMoney";
import { colors, space } from "../../../constants/theme";

const leftLabel = (n) => (n === 1 ? "1 room left" : `${n} rooms left`);

/**
 * One payment option for a room type: what it covers, the yearly price
 * (fees included), and how many rooms are left.
 *
 * selectable: true in the booking flow (shows a check and takes onPress),
 *             false on the hostel page (read-only price list)
 * decimals:   0 for browsing; 2 in the booking flow, where it's what gets charged
 */
export default function RoomOptionRow({ description, price, available, roomsLeft, selected, onPress, last, selectable = true, decimals = 0 }) {
  const left = Number(roomsLeft);
  return (
    <ListRow
      title={description || "Room"}
      subtitle={available ? (Number.isFinite(left) && left > 0 ? leftLabel(left) : null) : null}
      last={last}
      onPress={selectable && available ? onPress : undefined}
      style={!available && styles.unavailable}
      right={
        <View style={styles.right}>
          <View style={styles.price}>
            <Text variant="price" tone={selected ? "brand" : "default"}>{money(price, { decimals })}</Text>
            <Text variant="caption" tone="secondary">/ year</Text>
          </View>
          {!available ? (
            <StatusPill label="Full" tone="danger" />
          ) : selectable ? (
            <Icon name={selected ? "checkmark-circle" : "ellipse-outline"} size={22} color={selected ? colors.brand : colors.borderStrong} />
          ) : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  right: { flexDirection: "row", alignItems: "center", gap: space.sm },
  price: { alignItems: "flex-end" },
  unavailable: { opacity: 0.5 },
});
