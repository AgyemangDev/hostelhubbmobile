import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CloseButton = ({ onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
      hitSlop={12}
    >
      <Ionicons name="close" size={20} color="#111" />
    </Pressable>
  );
};

export default CloseButton;

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e9e1e1",
  },
  pressed: {
    opacity: 0.7,
  },
});