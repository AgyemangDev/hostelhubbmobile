// SearchScreen.js - Updated
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { shuffleArray } from "../utils/arrayUtils";
import { useHostels } from "../context/HostelsContext";
import CardListScreen from "../components/Cards/VerticalScroll/CardListScreen";
import SearchInput from "../components/SearchComponents/SearchInput";
import EmptyState from "../components/BookingsComponent/EmptyState";

const SearchScreen = () => {
  const { hostels, loading } = useHostels();
  const [searchQuery, setSearchQuery] = useState("");
  const [shuffledHostels, setShuffledHostels] = useState([]);

  // Shuffle the hostels once when hostels data changes
  useEffect(() => {
    setShuffledHostels(shuffleArray(hostels));
  }, [hostels]);

  // Filter hostels based on search query
  const filteredHostels = shuffledHostels.filter((hostel) => {
    const query = searchQuery.toLowerCase();
    return (
      hostel.hostelName.toLowerCase().includes(query) ||
      hostel.description.toLowerCase().includes(query) ||
      hostel.location.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      {/* Input Field */}
      <View style={styles.searchContainer}>
        <SearchInput
          placeholder="Search for hostels..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Conditional Rendering: If no hostels match the search, show EmptyState */}
      {filteredHostels.length === 0 ? (
        <EmptyState message="No hostels found matching your search criteria." />
      ) : (
        <View style={styles.listContainer}>
          <CardListScreen hostels={filteredHostels} loading={loading} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  listContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal:15
  }
});

export default SearchScreen;