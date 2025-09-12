// components/MapComponent/CategoryTabs.js
import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';

const CATEGORIES = ['All', 'Hostel', 'Homestel', 'Hotel', 'Guest House'];

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.tabButton,
              activeCategory === category && styles.activeTab,
            ]}
            onPress={() => onCategoryChange(category)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.tabText,
                activeCategory === category && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  scrollViewContent: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activeTab: {
    backgroundColor: '#3563E9',
    borderColor: '#3563E9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default CategoryTabs;