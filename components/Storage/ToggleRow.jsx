"use client";
import React from "react";
import { View, Text, Switch, StyleSheet, Platform } from "react-native";
import COLORS from "../../constants/Colors";

/**
 * A single labeled row with a native Switch. Used for the two
 * "Same as pickup" / "Decide later" options so they read as
 * proper settings rather than ad-hoc checkboxes.
 */
export default function ToggleRow({ label, description, value, onValueChange, disabled }) {
  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.textContainer}>
        <Text style={[styles.label, disabled && styles.textDisabled]}>{label}</Text>
        {description ? (
          <Text style={[styles.description, disabled && styles.textDisabled]}>
            {description}
          </Text>
        ) : null}
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: "#d1d5db", true: COLORS.teal }}
        thumbColor={COLORS.white}
        ios_backgroundColor="#d1d5db"
        style={Platform.OS === "android" ? styles.androidSwitch : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  label: {
    fontSize: 14.5,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  description: {
    marginTop: 2,
    fontSize: 12.5,
    color: COLORS.textMuted,
    lineHeight: 17,
  },
  textDisabled: {
    color: COLORS.placeholder,
  },
  androidSwitch: {
    transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
  },
});