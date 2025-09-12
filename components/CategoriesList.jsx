import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import COLORS from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';

const categories = [
  { id: '1', title: 'All Hostels', screen: 'AllHostels' },
  { id: '2', title: 'Recommended Nearby', screen: 'RecommendedNearby' },
  { id: '3', title: 'High Ratings', screen: 'HighRatings' },
];

const CategoriesList = () => {
  const [selectedId, setSelectedId] = useState('1');
  const flatListRef = useRef(null);
  const navigation = useNavigation();

  const handlePress = (item, index) => {
    setSelectedId(item.id);
    flatListRef.current.scrollToIndex({ index, animated: true });
    navigation.navigate(item.screen); // Navigate to the selected category screen
  };

  const renderItem = ({ item, index }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[
          styles.category,
          isSelected ? styles.selectedCategory : styles.unselectedCategory,
        ]}
        onPress={() => handlePress(item, index)}
      >
        <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={categories}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    paddingBottom: 10,
  },
  category: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedCategory: {
    backgroundColor: COLORS.background,
  },
  unselectedCategory: {
    backgroundColor: '#f0f0f0',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
});

export default CategoriesList;
