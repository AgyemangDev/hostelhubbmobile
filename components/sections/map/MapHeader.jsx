import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchField, Tabs } from "../../ui";
import { colors, space } from "../../../constants/theme";

/** Filters across the top of the map: everything, a kind of place, or hubclips. */
export const MAP_CATEGORIES = [
  { value: "all", label: "All", icon: "apps-outline" },
  { value: "hostel", label: "Hostels", icon: "business-outline" },
  { value: "homestel", label: "Homestels", icon: "home-outline" },
  { value: "hubclips", label: "Hubclips", icon: "play-circle-outline" },
  { value: "guest house", label: "Guest houses", icon: "key-outline" },
  { value: "hotel", label: "Hotels", icon: "bed-outline" },
];

/**
 * Airbnb-style header over the map: a floating search pill and an icon
 * category bar with a sliding underline, on a white band.
 */
export default function MapHeader({ query, onQuery, category, onCategory }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.band, { paddingTop: insets.top + space.xs }]}>
      {/* SearchField is full width, so the gutter goes on a wrapper, not a margin. */}
      <View style={styles.searchRow}>
        <SearchField
          value={query}
          onChangeText={onQuery}
          placeholder="Search hostels, areas or schools"
        />
      </View>
      <Tabs
        variant="underline"
        scroll
        options={MAP_CATEGORIES}
        value={category}
        onChange={onCategory}
        style={styles.tabs}
        contentStyle={styles.tabsContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Positioned by the screen, which measures it to pad the map.
  band: {
    backgroundColor: colors.surface,
    gap: space.sm,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 6,
  },
  searchRow: { paddingHorizontal: space.md },
  tabs: { flexGrow: 0 },
  tabsContent: { paddingHorizontal: space.md, gap: space.lg + space.xs, borderBottomWidth: 0 },
});
