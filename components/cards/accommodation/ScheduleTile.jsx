import React from "react";
import { Animated, Image, StyleSheet, View } from "react-native";
import { Text } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

/**
 * One move-in / move-out tile: image icon, label, date and a status hint.
 * anim: an Animated.Value 0→1 that fades and lifts the tile in.
 */
export default function ScheduleTile({ image, title, dateLabel, empty, hint, anim }) {
  const motion = anim
    ? {
        opacity: anim,
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) },
          { scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.96, 1] }) },
        ],
      }
    : null;
  return (
    <Animated.View style={[styles.tile, motion]}>
      <View style={styles.header}>
        <Image source={image} style={styles.image} resizeMode="contain" />
        <Text variant="caption" tone="secondary" style={{ fontWeight: "600" }}>{title}</Text>
      </View>
      <Text variant="bodyStrong" tone={empty ? "muted" : "default"} style={{ fontWeight: "600" }}>{dateLabel}</Text>
      <Text variant="caption" tone="muted">{hint}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md + 2,
    padding: space.sm,
    backgroundColor: colors.surfaceSunken,
    marginHorizontal: 4,
    gap: 2,
  },
  header: { flexDirection: "row", alignItems: "center", gap: space.xs, marginBottom: 6 },
  image: { width: 26, height: 26 },
});
