import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const PaymentButton = ({ roomType, price, isSelected, onPress }) => {
  return (
    <TouchableOpacity
      style={isSelected ? styles.selectedButton : styles.button}
      onPress={onPress}
    >
      <Text style={isSelected ? styles.selectedButtonText : styles.buttonText}>
        {roomType} - GHS {price}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'black',
  },
  selectedButtonText: {
    color: 'white',
  },
});

export default PaymentButton;
