// components/home/HomeHeader.jsx
//
// Home header in the Airbnb manner: one wide rounded pill with the search
// icon and "Start your search" centred in it, saved + notifications beside it.
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import NotificationBell from "./NotificationBell";
import FavoriteIcon from "./FavoriteIcon";
import { PressableScale } from "../ui/ds";
import { colors, radius, space } from "../../constants/theme";

export default function HomeHeader() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.searchSlot}>
      <PressableScale
        onPress={() => router.push("/SearchScreen")}
        accessibilityRole="search"
        accessibilityLabel="Start your search"
        style={styles.search}
      >
        <Ionicons name="search" size={20} color={colors.text} />
        <Text style={styles.searchText} numberOfLines={1}>Start your search</Text>
      </PressableScale>
      </View>

      <View style={styles.icons}>
        <FavoriteIcon onPress={() => router.push("/Shortlist")} />
        <NotificationBell onPress={() => router.push("/NotificationScreen")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.xs,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "ios" ? space.sm : 34,
    paddingBottom: space.md,
    paddingHorizontal: space.md,
  },
  searchSlot: { flex: 1 },
  search: {
    width: "100%",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  searchText: { fontSize: 15, fontWeight: "700", color: colors.text },
  icons: { flexDirection: "row", alignItems: "center" },
});
