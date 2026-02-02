import React, { useState, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { useAccommodationSearch } from "../hooks/accommodationContext/useAccommodationSearch";
import { AccommodationContext } from "../context/AccommodationContext";
import CardListScreen from "../components/Cards/VerticalScroll/CardListScreen";
import SearchBar from "../components/SearchComponents/SearchInput";
import EmptyState from "../components/BookingsComponent/EmptyState";
import FilterSheet from "../components/FilterComponents/FilterSheet";
import FilterButton from "../components/FilterComponents/FilterButton";

const SearchScreen = () => {
  const { accommodations, loading, loadMore, hasMore } =
    useContext(AccommodationContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const { results: searchResults, loading: searchLoading } =
    useAccommodationSearch(searchQuery);

  const dataToShow = searchQuery ? searchResults : accommodations;
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
        <EmptyState message="No accommodation found matching your search." />
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
    flex: 1, // takes remaining width
  },

  listContainer: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 15,
  },
});