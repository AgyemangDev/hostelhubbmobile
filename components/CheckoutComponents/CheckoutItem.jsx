import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

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
        <Text style={styles.productPrice}>
          GHC {item.price}.00
        </Text>
        
        {/* Quantity and Total in same row */}
        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={handleDecrease} 
              style={[styles.quantityButton, styles.decreaseButton]}
              activeOpacity={0.7}
            >
              <Ionicons name="remove" size={14} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantityText}>{item.quantity || 1}</Text>
            </View>
            
            <TouchableOpacity 
              onPress={handleIncrease} 
              style={[styles.quantityButton, styles.increaseButton]}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.priceAndRemove}>
            <Text style={styles.totalPrice}>${totalPrice}</Text>
            <TouchableOpacity 
              onPress={handleRemove} 
              style={styles.removeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="trash-outline" size={16} color="#ff4757" />
            </TouchableOpacity>
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
    backgroundColor: '#fff',
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
    width: 100, // increased from 60
    height: 100, // increased from 60
    borderRadius: 10, // slightly bigger rounding
    backgroundColor: '#f8f9fa',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16, // slightly larger
    fontWeight: '600',
    color: '#1a1a1a',
    lineHeight: 22,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2ecc71',
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
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#e9ecef',
  },
  increaseButton: {
    backgroundColor: '#007AFF',
  },
  quantityDisplay: {
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1a',
    minWidth: 20,
    textAlign: 'center',
  },
  priceAndRemove: {
    alignItems: 'flex-end',
  },
  totalPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  removeButton: {
    padding: 4,
  },
});

