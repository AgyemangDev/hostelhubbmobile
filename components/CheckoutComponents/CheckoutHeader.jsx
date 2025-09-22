import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

const CheckoutHeader = () => {
  const { clearCart } = useCart();

  const handleClearCart = () => {
    Alert.alert(
      "Confirm Clear Cart",
      "Have you finished shopping or checked out? You are about to clear your cart.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes, clear", style: "destructive", onPress: () => clearCart() },
      ]
    );
  };

  return (
    <View style={styles.headerContainer}>
      {/* Optional Back Button */}
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#111" />
      </TouchableOpacity>

      <Text style={styles.title}>Your Cart</Text>

      <TouchableOpacity style={styles.clearButton} onPress={handleClearCart}>
        <Ionicons name="trash-outline" size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

export default CheckoutHeader;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginTop: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  clearButton: {
    backgroundColor: '#ff4757',
    padding: 8,
    borderRadius: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },
});
