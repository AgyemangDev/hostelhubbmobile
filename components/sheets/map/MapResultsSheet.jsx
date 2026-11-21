import React, { forwardRef, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import MapListingCard from "../../cards/map/MapListingCard";
import { colors, space } from "../../../constants/theme";

/**
 * Airbnb's pull-up list over the map: peeks with "N places", drags up to
 * show every place in the current map view as large photo cards.
 * `places` is [{ place, kind }], already filtered and sorted by the screen.
 */
const MapResultsSheet = forwardRef(function MapResultsSheet({ places, from, loading, onOpen, onChange }, ref) {
  const snapPoints = useMemo(() => [96, "50%", "92%"], []);
  const hostels = places.filter((p) => p.kind === "hostel").length;
  const clips = places.length - hostels;
  const title = loading ? "Finding places…" : places.length ? `${places.length} place${places.length === 1 ? "" : "s"}` : "No places in this area";
  const subtitle = loading ? null : places.length
    ? [hostels ? `${hostels} hostel${hostels === 1 ? "" : "s"}` : null, clips ? `${clips} hubclip${clips === 1 ? "" : "s"}` : null].filter(Boolean).join(" · ")
    : "Zoom out or move the map to see more";

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      onChange={onChange}
      enableDynamicSizing={false}
      handleIndicatorStyle={styles.handle}
      backgroundStyle={styles.background}
      style={styles.shadow}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      <BottomSheetFlatList
        data={places}
        keyExtractor={(item) => `${item.kind}-${item.place.id}`}
        renderItem={({ item }) => (
          <MapListingCard place={item.place} kind={item.kind} from={from} onPress={() => onOpen(item)} />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </BottomSheet>
  );
});

export default MapResultsSheet;

const styles = StyleSheet.create({
  background: { backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  shadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 16,
  },
  handle: { backgroundColor: colors.borderStrong, width: 40 },
  header: { alignItems: "center", paddingBottom: space.md, gap: 2 },
  title: { fontSize: 15, fontWeight: "800", color: colors.text },
  subtitle: { fontSize: 12, color: colors.textSecondary },
  list: { paddingHorizontal: space.lg, paddingBottom: space.xl * 2, gap: space.lg + space.xs },
});
