import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useCart } from '../../context/CartContext';
import COLORS from "../../constants/Colors";

const CheckoutButton = ({ onPress }) => {
  const { cartItems } = useCart();

  // Calculate total cost
  const total = cartItems.reduce((sum, item) => {
    const qty = item.quantity || 1;
    return sum + item.price * qty;
  }, 0);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>
        Proceed to Checkout (GHC {total.toFixed(2)})
      </Text>
    </TouchableOpacity>
  );
};

export default CheckoutButton;

const styles = StyleSheet.create({
  button: {
    margin: 16,
    padding: 14,
    backgroundColor: COLORS.background,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
