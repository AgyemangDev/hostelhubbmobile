import React, { useState, useRef, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Animated } from "react-native";
import COLORS from "../../constants/Colors";

const BookingButton = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.05,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Animated.View style={[styles.buttonContent, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.buttonText}>Reserve a Space</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.button,
    borderRadius: 10,
    paddingVertical: 15,
    margin: 16,
    alignItems: "center",
    elevation: 2,
  },
  buttonContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default BookingButton;
