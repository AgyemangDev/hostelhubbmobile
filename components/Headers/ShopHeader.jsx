// screens/shop/ShopHeader.jsx
import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Text, FlatList } from 'react-native';
import ShopFilterBar from '../FilterComponents/ShopFilterBar';
import ShopSearchBar from '../FilterComponents/ShopSearchbar';

const categories = [  "All",
      "Hostel & Lifestyle Essentials",
  "Electronics & Gadgets",
  "Apparel & Fashion",
  "Health & Fitness",];

const ShopHeader = ({ onSearch, onFilter }) => {
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const handleSearchChange = (text) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleCategorySelect = (category) => {
    onFilter(category);
    setFilterVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <ShopSearchBar value={searchText} onChange={handleSearchChange} />
      </View>
      <View style={styles.filterContainer}>
        <ShopFilterBar onPress={() => setFilterVisible(true)} />
      </View>

      {/* Filter Modal */}
      <Modal
        transparent={true}
        visible={filterVisible}
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filter by Category</Text>
            <FlatList
              data={categories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.categoryItem}
                  onPress={() => handleCategorySelect(item)}
                >
                  <Text style={styles.categoryText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default ShopHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  searchContainer: {
    flex: 0.8, // Takes up 4/5 of the width
  },
  filterContainer: {
    flex: 0.2, // Takes up 1/5 of the width
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  categoryItem: {
    paddingVertical: 14,
    borderBottomColor: '#f0f0f0',
    borderBottomWidth: 1,
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
});