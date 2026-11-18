import React from "react";
import { StyleSheet, View } from "react-native";
import ListingCardSkeleton from "./ListingCardSkeleton";
import { space } from "../../../constants/theme";

/** A column of full-width placeholder listing cards (search results, saved places). */
export default function SkeletonCards({ count = 3 }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} variant="full" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: space.md, paddingTop: space.sm, gap: space.xl },
});
