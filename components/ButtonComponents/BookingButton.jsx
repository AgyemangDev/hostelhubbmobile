import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import COLORS from "../../constants/Colors";


const BookingButton = ({ onPress, disabled }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
    >
      <Text style={styles.buttonText}>
        {disabled ? "Processing..." : "Make a Reservation"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.teal,
    borderRadius: 10,
    paddingVertical: 15,
    marginHorizontal: 16,
    marginVertical: 8,
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default BookingButton;