import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../../ui";
import { colors, space } from "../../../constants/theme";

/** Placeholder shaped like a transaction row: title and date left, amount and status right. */
export default function TransactionCardShimmer() {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Skeleton variant="text" width="70%" height={16} />
        <Skeleton variant="text" width="50%" />
      </View>
      <View style={styles.right}>
        <Skeleton variant="text" width={60} height={16} />
        <Skeleton variant="text" width={45} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14, paddingHorizontal: 6, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  left: { flex: 1, gap: space.xs, paddingRight: 10 },
  right: { alignItems: "flex-end", gap: 6, minWidth: 90 },
});
