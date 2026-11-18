import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

/** Placeholder shaped like the school list: logo tile, name and code per row. */
export default function SchoolListSkeleton({ rows = 5 }) {
  return (
    <View accessibilityLabel="Loading schools" accessible>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.row, i < rows - 1 && styles.border]}>
          <Skeleton width={44} height={44} radius={radius.md} />
          <View style={styles.text}>
            <Skeleton variant="text" width={i % 2 ? "55%" : "75%"} height={14} />
            <Skeleton variant="text" width="25%" height={11} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: space.sm, minHeight: 56, paddingVertical: space.sm },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  text: { flex: 1, gap: space.xs },
});
