import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Skeleton } from "../../ui";
import { colors, space } from "../../../constants/theme";

/** One room-type card from "Rooms and prices": icon + name, then option rows with a price on the right. */
export default function RoomCardSkeleton({ rows }) {
  return (
    <Card style={styles.card}>
      <View style={styles.row}>
        <Skeleton width={34} height={34} />
        <Skeleton variant="text" width="35%" height={14} />
      </View>
      {Array.from({ length: rows }).map((_, i) => (
        <View key={i} style={[styles.optionRow, i < rows - 1 && styles.optionBorder]}>
          <View style={styles.optionText}>
            <Skeleton variant="text" width="70%" height={14} />
            <Skeleton variant="text" width="35%" />
          </View>
          <View style={styles.optionPrice}>
            <Skeleton variant="text" width={86} height={16} />
            <Skeleton variant="text" width={40} />
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.xs },
  row: { flexDirection: "row", alignItems: "center", gap: space.xs },
  optionRow: { flexDirection: "row", alignItems: "center", gap: space.sm, paddingVertical: space.sm },
  optionBorder: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  optionText: { flex: 1, gap: 6 },
  optionPrice: { alignItems: "flex-end", gap: 6 },
});
