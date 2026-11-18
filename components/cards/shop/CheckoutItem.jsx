import React from 'react';
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { useCart } from '../../../context/CartContext';
import { IconButton, QuantityStepper } from "../../ui";
import { colors } from "../../../constants/theme";

const CheckoutItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrease = () => updateQuantity(item.id, (item.quantity || 1) + 1);
  const handleDecrease = () => {
    if ((item.quantity || 1) > 1) updateQuantity(item.id, item.quantity - 1);
  };

  const handleRemove = () => {
    Alert.alert(
      "Remove Item",
      `Are you sure you want to remove ${item.name} from the cart?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => removeItem(item.id) }
      ]
    );
  };

  const totalPrice = ((item.quantity || 1) * item.price).toFixed(2);

  return (
    <View style={styles.card}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.mainImage }} style={styles.image} />
      </View>

      {/* Product Info */}
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>

        {/* Display selected color & size on the same line */}
        {(item.selectedColor || item.selectedSize) && (
          <Text style={styles.selectionText}>
            {item.selectedColor ? `Color: ${item.selectedColor}` : ''}
            {item.selectedColor && item.selectedSize ? ' | ' : ''}
            {item.selectedSize ? `Size: ${item.selectedSize}` : ''}
          </Text>
        )}

        <Text style={styles.productPrice}>
          GHC {item.price.toFixed(2)}
        </Text>

        {/* Quantity and Total Row */}
        <View style={styles.bottomRow}>
          <QuantityStepper value={item.quantity || 1} min={1} onIncrease={handleIncrease} onDecrease={handleDecrease} label={item.name || "item"} />

          <View style={styles.priceAndRemove}>
            <Text style={styles.totalPrice}>GHC {totalPrice}</Text>
            <IconButton icon="trash-outline" color={colors.danger} size={18} accessibilityLabel="Remove from cart" onPress={handleRemove} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default CheckoutItem;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: colors.fill,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    lineHeight: 22,
    marginBottom: 4,
  },
  selectionText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.success,
    marginBottom: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.fill,
    borderRadius: 22,
    padding: 2,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButton: {
    backgroundColor: colors.fill,
  },
  increaseButton: {
    backgroundColor: colors.brand,
  },
  quantityDisplay: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  priceAndRemove: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
});
