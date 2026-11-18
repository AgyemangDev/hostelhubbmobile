import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import NotificationBell from "../../buttons/notifications/NotificationBell";
import ShortlistButton from "../../buttons/accommodation/ShortlistButton";
import { Text } from "../../ui";
import { colors, space } from "../../../constants/theme";

/**
 * Top of Home: "Discover" with saved + notifications. It scrolls away with
 * the page; the search bar under it (HomeSearchBar) stays pinned.
 * `onLayout` lets the screen know how far to scroll before the bar sticks.
 */
export default function HomeTitleRow({ onLayout }) {
  const router = useRouter();
  return (
    <View style={styles.row} onLayout={onLayout}>
      <Text style={styles.title} accessibilityRole="header">Discover</Text>
      <View style={styles.actions}>
        <ShortlistButton variant="plain" onPress={() => router.push("/Shortlist")} />
        <NotificationBell variant="plain" onPress={() => router.push("/NotificationScreen")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 48,
    paddingHorizontal: space.md,
    paddingBottom: space.xs,
    backgroundColor: colors.background,
  },
  title: { fontSize: 28, lineHeight: 34, fontWeight: "800", letterSpacing: -0.3, color: colors.text },
  // Pull the icon buttons' built-in margin in so they line up with the pill's edge.
  actions: { flexDirection: "row", alignItems: "center", marginRight: -space.xs },
});
