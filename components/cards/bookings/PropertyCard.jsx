import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Card, Icon, StatusPill, Text } from "../../ui";
import { colors, space } from "../../../constants/theme";

/** The place being paid for: photo, name, school and area, and the room type. */
export default function PropertyCard({ accommodationInfo, room_type }) {
  const imageUrl = accommodationInfo?.front_image ?? null;
  return (
    <Card padded={false}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          // Logs the image loader's actual reason (network, decode, format)
          // instead of failing silently.
          onError={(e) => console.warn("[PropertyCard] Image failed to load:", imageUrl, e.nativeEvent?.error)}
        />
      ) : (
        <View style={[styles.image, styles.placeholder]}>
          <Icon name="home-outline" size={40} tone="brand" />
        </View>
      )}
      <View style={styles.info}>
        <Text variant="heading" numberOfLines={1}>{accommodationInfo?.accommodation_name ?? "Accommodation"}</Text>
        <Text variant="caption" tone="secondary" numberOfLines={2}>
          {accommodationInfo?.institution} · {accommodationInfo?.location}
        </Text>
        {room_type ? <StatusPill label={room_type} tone="success" /> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  image: { width: "100%", height: 160, backgroundColor: colors.brandSoft },
  placeholder: { alignItems: "center", justifyContent: "center" },
  info: { padding: space.md, gap: 6 },
});
