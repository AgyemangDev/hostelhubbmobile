import React from "react";
import { Image, StyleSheet, View } from "react-native";
import AvailabilityTag from "../../badges/accommodation/AvailabilityTag";
import SaveHeartButton from "../../buttons/accommodation/SaveHeartButton";
import { colors, radius } from "../../../constants/theme";

/** One listing photo with its availability tag and save heart. */
export default function ListingPhoto({ item, tag, style }) {
  return (
    <View>
      <Image
        source={{ uri: item.front_image }}
        style={[styles.photo, style, tag?.booked && styles.dimmed]}
        resizeMode="cover"
      />
      <AvailabilityTag tag={tag} />
      <SaveHeartButton id={item.id} />
    </View>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: "100%",
    borderRadius: radius.xl,
    backgroundColor: colors.fill
  },
  dimmed: { opacity: 0.7 },
});
