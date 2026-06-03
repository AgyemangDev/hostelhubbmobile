import React from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import COLORS from '../../constants/Colors';

const BookingConfirmButton = ({ isFormComplete, onConfirm }) => {
  const handlePress = () => {
    if (isFormComplete()) {
      onConfirm();
    } else {
      Alert.alert('Incomplete Form', 'Please complete all required fields.');
    }
  };

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 10,
    width: '100%',
  },
  confirmButton: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: COLORS.button,
    alignItems: 'center',
    marginBottom: 20,
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default BookingConfirmButton;