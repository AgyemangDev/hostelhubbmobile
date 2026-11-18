import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Skeleton } from "../../ui";
import { space } from "../../../constants/theme";

/** Placeholder shaped like a booking card: thumbnail, name, status pill, two lines and two actions. */
export default function BookingCardSkeleton() {
  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <Skeleton width={48} height={48} radius={10} />
        <View style={styles.info}>
          <Skeleton variant="text" width="70%" height={14} />
          <Skeleton variant="text" width="45%" height={11} />
        </View>
        <Skeleton variant="pill" width={60} height={20} />
      </View>
      <Skeleton variant="text" width="55%" height={11} />
      <Skeleton variant="text" width="40%" height={11} />
      <View style={styles.actions}>
        <Skeleton width={64} height={26} />
        <Skeleton width={64} height={26} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.xs },
  top: { flexDirection: "row", alignItems: "center", gap: space.sm, marginBottom: 4 },
  info: { flex: 1, gap: space.xs },
  actions: { flexDirection: "row", gap: space.xs, marginTop: 4 },
});
