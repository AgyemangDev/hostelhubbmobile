// screens/SearchScreen.jsx - USE CONTEXT

import React, { useContext } from "react";
import { View, StyleSheet, Text, SafeAreaView, Platform } from "react-native";
import { colors, space, type } from "../constants/theme";
import { AccommodationContext } from "../context/AccommodationContext";
import CardListScreen from "../components/accommodation/cards/CardListScreen";
import SearchBar from "../components/accommodation/search/SearchInput";
import EmptyFeedState from "../components/hubclipps/EmptyFeedState"
import FilterSheet from "../components/accommodation/search/FilterSheet";
import FilterButton from "../components/accommodation/search/FilterButton";
import { useState } from "react";

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

  const [filterOpen, setFilterOpen] = useState(false);

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
          <SearchBar
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
