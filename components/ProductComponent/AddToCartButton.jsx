import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const AddToCartButton = ({ onPress }) => (
  <View style={styles.footer}>
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Add to Cart 🛒</Text>
    </TouchableOpacity>
  </View>
);

export default AddToCartButton;

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  text: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
