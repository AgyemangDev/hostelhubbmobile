// NavigationButtons.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

export const BackButton = ({ onPress }) => (
  <TouchableOpacity style={styles.backButton} onPress={onPress}>
    <MaterialIcons name="arrow-back" size={20} color="#fff" />
    <Text style={styles.buttonText}>Back</Text>
  </TouchableOpacity>
);

export const ContinueButton = ({ onPress }) => (
  <TouchableOpacity style={styles.nextButton} onPress={onPress}>
    <Text style={styles.buttonText}>Continue</Text>
    <MaterialIcons name="arrow-forward" size={20} color="#fff" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  backButton: {
    backgroundColor: "#A0AEC0",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  nextButton: {
    backgroundColor: COLORS.background,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 5,
  },
});
