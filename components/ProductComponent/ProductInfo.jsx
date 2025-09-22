import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductInfo = ({ product }) => {
  const discountPercentage = 5;
  const originalPrice = (product.price * (1 + discountPercentage / 100)).toFixed(2);

  return (
    <View style={styles.infoContainer}>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.category}>{product.category}</Text>

      <View style={styles.priceContainer}>
        <Text style={styles.price}>GHC {product.price.toFixed(2)}</Text>
        <Text style={styles.originalPrice}>GHC {originalPrice}</Text>
      </View>

      <Text style={styles.description}>{product.description}</Text>
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  infoContainer: { padding: 16 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  category: { fontSize: 14, color: '#888', marginBottom: 12, textTransform: 'uppercase' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 18, fontWeight: '700', color: '#e74c3c', marginRight: 8 },
  originalPrice: { fontSize: 14, color: '#999', textDecorationLine: 'line-through' },
  description: { fontSize: 14, color: '#555', marginBottom: 20 },
});
