// screens/SearchScreen.jsx - USE CONTEXT

import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { AccommodationContext } from "../context/AccommodationContext";
import CardListScreen from "../components/Cards/VerticalScroll/CardListScreen";
import SearchBar from "../components/SearchComponents/SearchInput";
import EmptyFeedState from "../components/hubclipps/EmptyFeedState"
import FilterSheet from "../components/FilterComponents/FilterSheet";
import FilterButton from "../components/FilterComponents/FilterButton";
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
  } = useContext(AccommodationContext);

  const [filterOpen, setFilterOpen] = useState(false);

  const dataToShow = searchQuery ? searchAccommodations : accommodations;
  const isLoading = searchQuery ? searchLoading : loading;

  return (
    <View style={styles.container}>
      
      {/* SEARCH + FILTER ROW */}
      <View style={styles.searchRow}>
        <View style={styles.searchFlex}>
          <SearchBar
            placeholder="Search accommodation..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <FilterButton onPress={() => setFilterOpen(true)} />
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
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 10,
    gap: 10,
  },

  searchFlex: {
    flex: 1,
  },

  listContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
});