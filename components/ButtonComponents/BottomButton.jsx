"use client";
import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import COLORS from "../../constants/Colors";

const BottomButton = ({
  buttonText,
  onPressFunction,
  icon,
  disabled = false,
  variant = "default",
  customStyle,
}) => {
  const isInverted = variant === "inverted";

  return (
    <View style={[styles.buttonWrapper, customStyle]}>
      <TouchableOpacity
        style={[styles.buttonContainer, isInverted && styles.invertedContainer]}
        onPress={onPressFunction}
        activeOpacity={0.8}
        disabled={disabled}
      >
        <View style={styles.content}>
          <Text style={[styles.buttonText, isInverted && styles.invertedText]}>
            {buttonText}
          </Text>
          {icon && <View style={styles.icon}>{icon}</View>}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButton;

const styles = StyleSheet.create({
  buttonWrapper: {
    width: "100%",
    backgroundColor: COLORS.white, // ✅ parent container background
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    // Shadow / elevation
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
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