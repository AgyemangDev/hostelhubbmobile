import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

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
    if (variant === "secondary" && !disabled) return COLORS.primary;
    return COLORS.white;
  };

  return (
    <TouchableOpacity
      style={[styles.btn, getButtonStyle()]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color={getTextColor()} />
      ) : (
        <>
          <Text style={[styles.btnText, { color: getTextColor() }]}>{text}</Text>
          {icon && (
            <Ionicons name={icon} size={16} color={getTextColor()} />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default FunctionalButton;

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  btnPrimary: {
    backgroundColor: COLORS.button,
    shadowColor: COLORS.button,
  },
  btnSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowOpacity: 0.1,
  },
  btnDanger: {
    backgroundColor: COLORS.error || "#EF4444",
    shadowColor: COLORS.error || "#EF4444",
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