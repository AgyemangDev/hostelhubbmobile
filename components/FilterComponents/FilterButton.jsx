import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const FilterButton = ({ label, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    flex: 1,
    padding: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginVertical: 3,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FilterButton;
