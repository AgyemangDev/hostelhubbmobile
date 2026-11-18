import React from 'react';
import { View, Text, StyleSheet } from "react-native";
import { ChipGroup } from "../../ui";
import { colors } from "../../../constants/theme";

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
          <ChipGroup title="Colour" options={product.colors} value={selectedColor} onToggle={setSelectedColor} />
        </View>
      )}

      {/* Size Selection */}
      {product.sizes && product.sizes.length > 0 && (
        <View style={styles.selectionContainer}>
          <ChipGroup title="Size" options={product.sizes} value={selectedSize} onToggle={setSelectedSize} />
        </View>
      )}
    </View>
  );
};

export default ProductInfo;

const styles = StyleSheet.create({
  infoContainer: { padding: 16 },
  name: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  category: { fontSize: 14, color: colors.textMuted, marginBottom: 12, textTransform: 'uppercase' },
  priceContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  price: { fontSize: 18, fontWeight: '700', color: colors.danger, marginRight: 8 },
  originalPrice: { fontSize: 14, color: colors.textMuted, textDecorationLine: 'line-through' },
  description: { fontSize: 14, color: colors.textSecondary, marginBottom: 20 },
  selectionContainer: { marginBottom: 16 },
  selectionLabel: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  optionsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  optionButton: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerBg,
  },
  optionText: { fontSize: 14 },
  selectedOptionText: { color: colors.danger, fontWeight: '700' },
});
