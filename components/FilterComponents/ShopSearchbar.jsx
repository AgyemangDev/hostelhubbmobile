// components/ShopSearchBar.jsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // ✅ Expo icons

const ShopSearchBar = ({ value, onChange }) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={18} color="#999" style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={value}
        onChangeText={onChange}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default ShopSearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#f8f9fa',
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 0,
  },
});
