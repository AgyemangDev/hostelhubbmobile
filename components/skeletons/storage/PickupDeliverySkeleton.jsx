import React from "react";
import { StyleSheet, View } from "react-native";
import { Skeleton } from "../../ui";
import { radius, space } from "../../../constants/theme";

const Field = () => (
  <View style={{ gap: 6 }}>
    <Skeleton variant="text" width={90} height={11} />
    <Skeleton height={52} radius={radius.md} />
  </View>
);

const Toggle = () => (
  <View style={styles.toggle}>
    <View style={{ flex: 1, gap: space.xs }}>
      <Skeleton variant="text" width="45%" height={14} />
      <Skeleton variant="text" width="75%" height={11} />
    </View>
    <Skeleton variant="pill" width={48} height={28} />
  </View>
);

/** Placeholder shaped like the pickup & delivery form while the school's dates load. */
export default function PickupDeliverySkeleton() {
  return (
    <View style={styles.wrap} accessibilityLabel="Loading storage dates" accessible>
      <Skeleton variant="text" width="65%" height={28} />
      <View style={styles.section}>
        <Skeleton variant="text" width={70} height={16} />
        <Skeleton variant="text" width="60%" height={11} />
        <Field />
        <Field />
      </View>
      <View style={styles.section}>
        <Skeleton variant="text" width={80} height={16} />
        <Skeleton variant="text" width="60%" height={11} />
        <Toggle />
        <Toggle />
        <Field />
        <Field />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space.lg, gap: space.xl },
  section: { gap: space.md },
  toggle: { flexDirection: "row", alignItems: "center", gap: space.md },
});
