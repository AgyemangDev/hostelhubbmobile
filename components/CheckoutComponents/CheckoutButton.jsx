import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/Colors';

const CheckoutButton = ({ onPress, text }) => {
  // Helper function to format numbers with commas and 2 decimals
  const formatCurrency = (num) => {
    return Number(num).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>
        {text ? text : `Proceed to Checkout (GHC ${formatCurrency(0)})`}
      </Text>
    </TouchableOpacity>
  );
};

export default CheckoutButton;

const styles = StyleSheet.create({
  button: {
    margin: 16,
    padding: 16,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
