 import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import COLORS from "../../constants/Colors";

const Button = ({ buttonText, onPressFunction, icon, variant = "default", customStyle }) => {
  // Determine styles based on variant
  const isInverted = variant === "inverted";

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        isInverted && styles.invertedContainer,
        customStyle, // can still pass extra margin/padding
      ]}
      onPress={onPressFunction}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={[styles.buttonText, isInverted && styles.invertedText]}>
          {buttonText}
        </Text>
        {icon && <View style={styles.icon}>{icon}</View>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.background,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  invertedContainer: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.background,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
    color: COLORS.white,
  },
  invertedText: {
    color: COLORS.background,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginLeft: 10,
  },
});

export default Button;
