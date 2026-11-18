import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, SectionHeader, StatusPill, Text } from "../../ui";
import RoomOptionRow from "../../lists/accommodation/RoomOptionRow";
import { ROOM_TYPE_DISPLAY_ORDER } from "../../../constants/roomTypes";
import { PLATFORM_MARKUP_RATE } from "../../../constants/bookingConstants";
import { money } from "../../../utils/formatMoney";
import { space } from "../../../constants/theme";

const ROOM_ICON = {
  Apartment: "home-outline",
  "1 in 1": "person-outline",
  "2 in 1": "people-outline",
  "3 in 1": "people-outline",
  "4 in 1": "people-circle-outline",
};

const studentPrice = (base) => Number(base) * PLATFORM_MARKUP_RATE;
const isAvailable = (opt) => (opt.roomsAvailable == null ? opt.available !== false : Number(opt.roomsAvailable) > 0);

/**
 * "Rooms and prices" on the hostel page: one card per room type, each option
 * with its yearly price (fees included) and how many rooms are left.
 */
export default function PaymentRange({ paymentRanges }) {
  const types = ROOM_TYPE_DISPLAY_ORDER.filter((t) => paymentRanges[t]?.some((o) => o?.price));

  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Text variant="title">Rooms and prices</Text>
        <Text variant="caption" tone="secondary">Yearly prices</Text>
      </View>

      {types.map((roomType) => {
        const options = paymentRanges[roomType].filter((o) => o?.price);
        const open = options.filter(isAvailable);
        const from = Math.min(...options.map((o) => studentPrice(o.price)));
        return (
          <Card key={roomType} style={styles.card}>
            <SectionHeader
              icon={ROOM_ICON[roomType] || "bed-outline"}
              title={roomType}
              subtitle={options.length > 1 ? `From ${money(from, { decimals: 0 })} a year` : null}
              variant="small"
              right={open.length ? null : <StatusPill label="Fully booked" tone="danger" />}
            />
            <View>
              {options.map((opt, i) => (
                <RoomOptionRow
                  key={i}
                  selectable={false}
                  description={opt.description}
                  price={studentPrice(opt.price)}
                  available={isAvailable(opt)}
                  roomsLeft={opt.roomsAvailable}
                  last={i === options.length - 1}
                />
              ))}
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: space.sm, marginTop: space.md, marginBottom: space.xl },
  head: { gap: 2, marginBottom: space.xxs },
  card: { gap: space.xxs, paddingBottom: space.xxs },
});
