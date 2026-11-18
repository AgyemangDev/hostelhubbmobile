import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

/** Placeholder shaped like the storage item list: photo, name, price and Add button per row. */
export default function StorageItemsSkeleton({ rows = 6 }) {
  return (
    <View accessibilityLabel="Loading storage items" accessible>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.row, i < rows - 1 && styles.border]}>
          <Skeleton width={60} height={60} radius={radius.md} />
          <View style={styles.text}>
            <Skeleton variant="text" width={i % 2 ? "50%" : "70%"} height={14} />
            <Skeleton variant="text" width="35%" height={11} />
          </View>
          <Skeleton width={64} height={34} radius={radius.pill} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm + 2, paddingVertical: space.sm },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  text: { flex: 1, gap: space.xs },
});
