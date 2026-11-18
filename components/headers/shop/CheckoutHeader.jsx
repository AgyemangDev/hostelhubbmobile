import React from 'react';
import { View, Text, StyleSheet, Alert } from "react-native";
import { useCart } from '../../../context/CartContext';
import { IconButton } from "../../ui";
import { colors } from "../../../constants/theme";
import { useNavigation } from '@react-navigation/native'; // <-- Add this import

const CheckoutHeader = () => {
  const navigation = useNavigation(); // <-- Hook for navigation
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
      {/* Back Button */}
      <IconButton icon="arrow-back" variant="tonal" accessibilityLabel="Go back" onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Your Cart</Text>

      <IconButton icon="trash-outline" variant="tonal" color={colors.danger} accessibilityLabel="Clear cart" onPress={handleClearCart} />
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
    backgroundColor: colors.surface,
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
    color: colors.text,
  },
  clearButton: {
    backgroundColor: '#ff4757',
    padding: 8,
    borderRadius: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: colors.fill,
  },
});
