import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const DANGER_COLOR = COLORS.error || "#EF4444";

const FunctionalButton = ({
  text,
  onPress,
  icon,
  disabled = false,
  loading = false,
  variant = "primary", // primary | secondary | danger
}) => {
  const getButtonStyle = () => {
    if (disabled) return styles.btnDisabled;
    switch (variant) {
      case "secondary":
        return styles.btnSecondary;
      case "danger":
        return styles.btnDanger;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextColor = () => {
    if (disabled) return COLORS.white;
    if (variant === "secondary") return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      style={[styles.btn, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      accessibilityLabel={text}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          <Text style={[styles.btnText, { color: getTextColor() }]}>{text}</Text>
          {icon && <Ionicons name={icon} size={16} color={getTextColor()} />}
        </>
      )}
    </TouchableOpacity>
  );
};

export default FunctionalButton;

const styles = StyleSheet.create({
  btn: {
    minHeight: 52, // keeps height stable between the text+icon state and the spinner-only loading state
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btnPrimary: {
    backgroundColor: COLORS.button,
    shadowColor: COLORS.button,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  btnSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    // No shadow — an outlined button should read as lighter-weight than primary, not compete with it.
  },
  btnDanger: {
    backgroundColor: DANGER_COLOR,
    shadowColor: DANGER_COLOR,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  btnDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0,
    elevation: 0,
  },
  btnText: {
    fontWeight: "700",
    fontSize: 17,
  },
});