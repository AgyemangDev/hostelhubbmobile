import React from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Skeleton } from "../../ui";
import { space } from "../../../constants/theme";

/**
 * Placeholder shaped like ListingCard while listings load.
 * variant: rail (home rows, 236 wide) | full (search results, full width)
 */
export default function ListingCardSkeleton({ variant = "full" }) {
  const { width } = useWindowDimensions();
  const rail = variant === "rail";
  const photo = rail ? 236 : width - space.md * 2;
  return (
    <View style={[styles.card, rail && { width: 236 }]}>
      <Skeleton variant="image" height={photo} />
      <View style={styles.text}>
        <Skeleton variant="text" height={16} width="70%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="40%" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: "100%" },
  text: { gap: 6, paddingTop: space.sm, paddingHorizontal: 2 },
});
