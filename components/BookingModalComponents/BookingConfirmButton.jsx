import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
      <Text
        style={styles.confirmButton}
        onPress={handlePress}
      >
        Confirm Booking
      </Text>
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
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20
  },
});

export default BookingConfirmButton;