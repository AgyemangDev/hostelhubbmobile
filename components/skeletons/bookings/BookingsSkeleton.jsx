import React from "react";
import { StyleSheet, View } from "react-native";
import BookingCardSkeleton from "./BookingCardSkeleton";
import { space } from "../../../constants/theme";

/** A list of placeholder booking cards while bookings load. */
export default function BookingsSkeleton({ count = 5 }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <BookingCardSkeleton key={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: space.md, paddingTop: space.sm, gap: space.sm },
});
