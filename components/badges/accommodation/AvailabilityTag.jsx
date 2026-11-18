import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../ui";
import { colors, radius } from "../../../constants/theme";

/** "Rooms available" / "Fully booked" tag pinned to the top-left of a listing photo. */
export default function AvailabilityTag({ tag }) {
  if (!tag) return null;
  return (
    <View style={[styles.tag, tag.booked ? styles.booked : styles.open]}>
      {!tag.booked ? <View style={styles.dot} /> : null}
      <Text variant="label" tone={tag.booked ? "inverse" : "default"} style={styles.text}>
        {tag.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  open: { backgroundColor: "rgba(255,255,255,0.96)" },
  booked: { backgroundColor: "rgba(28,25,23,0.88)" },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  text: { fontWeight: "800", letterSpacing: 0 },
});
