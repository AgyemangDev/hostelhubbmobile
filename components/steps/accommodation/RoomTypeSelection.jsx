import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Section, SectionHeader } from "../../ui";
import RoomOptionRow from "../../lists/accommodation/RoomOptionRow";
import { ROOM_TYPE_DISPLAY_ORDER } from "../../../constants/roomTypes";
import { PLATFORM_MARKUP_RATE } from "../../../constants/bookingConstants";
import { space } from "../../../constants/theme";

const ROOM_ICON = {
  Apartment: "home-outline",
  "1 in 1": "bed-single",
  "2 in 1": "bed-queen",
  "3 in 1": "bed-outline",
  "4 in 1": "bunk-bed",
};

/** Step 1 of booking a room: pick a room type and one of its payment options. */
export default function RoomTypeSection({ roomTypes, selectedRoomType, selectedPayment, onSelect }) {
  const types = ROOM_TYPE_DISPLAY_ORDER.filter((type) => roomTypes[type]?.some((opt) => opt?.price));

  return (
    <Section title="Select room type" subtitle="Choose your preferred accommodation">
      {types.map((roomType) => {
        const options = roomTypes[roomType].filter((opt) => opt?.price);
        return (
          <Card key={roomType} style={styles.card}>
            <SectionHeader icon={ROOM_ICON[roomType] || "home-outline"} title={roomType} variant="small" />
            <View>
              {options.map((option, index) => {
                const available = Number(option?.roomsAvailable) > 0;
                return (
                  <RoomOptionRow
                    key={option.id ?? index}
                    description={option.description}
                    price={Number(option.price) * PLATFORM_MARKUP_RATE}
                    available={available}
                    roomsLeft={option.roomsAvailable}
                    decimals={2}
                    selected={selectedRoomType === roomType && selectedPayment === option.price}
                    last={index === options.length - 1}
                    onPress={() => onSelect(roomType, option.price, available, option.id)}
                  />
                );
              })}
            </View>
          </Card>
        );
      })}
    </Section>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.xs },
});
