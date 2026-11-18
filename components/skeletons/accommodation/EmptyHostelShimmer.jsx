import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import ListingCardSkeleton from "./ListingCardSkeleton";
import { space } from "../../../constants/theme";

/** A home rail of placeholder listing cards while a row loads. */
export default function EmptyHostelShimmer({ count = 4 }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} scrollEnabled={false}>
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={i} variant="rail" />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: space.md, paddingVertical: space.sm, gap: space.md },
});
