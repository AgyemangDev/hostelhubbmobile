// screens/SearchScreen.jsx - USE CONTEXT

import React, { useContext } from "react";
import { View, StyleSheet, Text, SafeAreaView, Platform } from "react-native";
import { colors, space, type } from "../constants/theme";
import { AccommodationContext } from "../context/AccommodationContext";
import CardListScreen from "../components/lists/accommodation/CardListScreen";
import EmptyFeedState from "../components/feedback/hubclipps/EmptyFeedState"
import FilterSheet from "../components/sheets/accommodation/FilterSheet";
import FilterButton from "../components/buttons/accommodation/FilterButton";
import { useState } from "react";
import { SearchField } from "../components/ui";
import { useLocalSearchParams } from "expo-router";

const SearchScreen = () => {
  const {
    accommodations,
    loading,
    loadMore,
    hasMore,
    searchAccommodations,
    searchLoading,
    searchQuery,
    setSearchQuery,
    filters,
  } = useContext(AccommodationContext);

  // Home's filter button opens this screen with ?filters=1 to go straight to the sheet.
  const { filters: openFilters } = useLocalSearchParams();
  const [filterOpen, setFilterOpen] = useState(openFilters === "1");

  const dataToShow = searchQuery ? searchAccommodations : accommodations;
  const isLoading = searchQuery ? searchLoading : loading;
  const activeFilterCount =
    filters.roomTypes.length +
    filters.buildingTypes.length +
    filters.amenities.length +
    filters.locations.length +
    filters.rules.length +
    (filters.institution ? 1 : 0) +
    (filters.availableOnly ? 1 : 0) +
    (filters.priceRange[0] > 2000 || filters.priceRange[1] < 30000 ? 1 : 0);

  return (
    <SafeAreaView style={styles.container}>

      {/* SEARCH + FILTER ROW */}
      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchField
            autoFocus
            placeholder="Hostel, area or school"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FilterButton onPress={() => setFilterOpen(true)} activeCount={activeFilterCount} />
      </View>

      <View style={styles.resultSummary}>
        <Text style={styles.resultCount}>
          {isLoading ? "Finding places…" : `${dataToShow.length} place${dataToShow.length === 1 ? "" : "s"} to stay`}
        </Text>
        {activeFilterCount > 0 && <Text style={styles.filteredLabel}>Filters applied</Text>}
      </View>

      <FilterSheet
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
      />

      {/* RESULTS */}
      {dataToShow.length === 0 && !isLoading ? (
        <EmptyFeedState />
      ) : (
        <View style={styles.listContainer}>
          <CardListScreen
            hostels={dataToShow}
            loading={isLoading}
            onEndReached={!searchQuery && hasMore ? loadMore : null}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: Platform.OS === "android" ? 30 : 0 },
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.lg, paddingTop: space.sm, marginBottom: space.sm, gap: space.xxs },
  searchFlex: { flex: 1 },
  listContainer: { flex: 1, width: "100%", paddingHorizontal: space.md },
  resultSummary: { paddingHorizontal: space.lg, marginBottom: space.sm, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  resultCount: { ...type.bodyStrong, color: colors.text },
  filteredLabel: { ...type.caption, fontWeight: "700", color: colors.brand },
});
