import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Skeleton } from "../../ui";
import { space } from "../../../constants/theme";

/** Placeholder for the room-booking form while the hostel's rooms load. */
export default function BookingFormSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.head}>
        <Skeleton variant="text" width="55%" height={13} />
        <Skeleton variant="text" width="75%" height={22} />
      </View>
      <View style={styles.head}>
        <Skeleton variant="text" width="40%" height={11} />
        <Skeleton variant="text" width="60%" height={13} />
      </View>
      {[0, 1, 2].map((i) => (
        <Card key={i} padded={false}>
          <View style={styles.cardHeader}>
            <Skeleton width={34} height={34} />
            <Skeleton variant="text" width="50%" height={14} />
          </View>
          <View style={styles.cardBody}>
            <Skeleton height={44} />
            <Skeleton height={44} />
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: space.lg, paddingTop: space.xl, gap: space.sm },
  head: { gap: 6, marginBottom: space.sm },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10, padding: space.sm },
  cardBody: { padding: 10, gap: space.xs },
});
