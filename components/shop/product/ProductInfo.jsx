import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProductInfo = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
}) => {
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

      {/* Color Selection */}
      {product.colors && product.colors.length > 0 && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionLabel}>Select Color:</Text>
          <View style={styles.optionsContainer}>
            {product.colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.optionButton,
                  selectedColor === color && styles.selectedOption,
                ]}
                onPress={() => setSelectedColor(color)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedColor === color && styles.selectedOptionText,
                  ]}
                >
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectionLabel}>Select Size:</Text>
          <View style={styles.optionsContainer}>
            {product.sizes.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  selectedSize === size && styles.selectedOption,
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSize === size && styles.selectedOptionText,
                  ]}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
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
  selectionContainer: { marginBottom: 16 },
  selectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: '#e74c3c',
    backgroundColor: '#ffe6e6',
  },
  optionText: { fontSize: 14 },
  selectedOptionText: { color: '#e74c3c', fontWeight: '700' },
});
