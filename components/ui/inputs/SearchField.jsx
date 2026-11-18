import React from "react";
import { StyleSheet, View } from "react-native";
import { Searchbar, TouchableRipple } from "react-native-paper";
import Icon from "../icons/Icon";
import Text from "../typography/Text";
import { colors, radius, space, type } from "../../../constants/theme";

const variants = {
  // White pill on a soft shadow, for the top of Home and search screens.
  floating: { container: { backgroundColor: colors.surface, borderRadius: radius.pill, height: 56, elevation: 6, shadowColor: "#000", shadowOpacity: 0.14, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } } },
  // Grey, flat and shorter, for search inside a section (shop).
  filled: { container: { backgroundColor: colors.fill, borderRadius: radius.md, height: 44, elevation: 0 } },
  // iOS search bar: translucent grey, 10pt corners, left-aligned muted prompt.
  inset: { container: { backgroundColor: "rgba(118,118,128,0.12)", borderRadius: 10, height: 40, elevation: 0 } },
};

/**
 * Search input. Paper's Searchbar, with a clear button once there is text.
 *
 * variant: floating (default) | filled | inset (iOS-style, Home header)
 * onPress: turns it into a button that opens a search screen (no typing here)
 * align:   "center" centres the placeholder in button mode
 */
export default function SearchField({ value, onChangeText, placeholder = "Search", onPress, variant = "floating", align, autoFocus, style }) {
  const v = variants[variant] || variants.floating;

  if (onPress) {
    return (
      <TouchableRipple onPress={onPress} borderless accessibilityRole="search" accessibilityLabel={placeholder} style={[styles.base, v.container, style]}>
        {variant === "inset" ? (
          <View style={[styles.button, styles.insetButton]}>
            <Icon name="search" size={18} tone="secondary" />
            <Text tone="secondary" style={styles.insetText} numberOfLines={1}>{placeholder}</Text>
          </View>
        ) : (
          <View style={[styles.button, align === "center" && styles.center]}>
            <Icon name="search" size={20} />
            <Text variant="bodyStrong" numberOfLines={1}>{placeholder}</Text>
          </View>
        )}
      </TouchableRipple>
    );
  }

  return (
    <Searchbar
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoFocus={autoFocus}
      icon="search"
      clearIcon="close-circle"
      iconColor={colors.text}
      placeholderTextColor={colors.textMuted}
      elevation={0}
      style={[styles.base, v.container, style]}
      inputStyle={[styles.input, variant === "filled" && styles.inputFilled]}
    />
  );
}

const styles = StyleSheet.create({
  base: { width: "100%", justifyContent: "center" },
  button: { flexDirection: "row", alignItems: "center", gap: space.xs, paddingHorizontal: space.md },
  center: { justifyContent: "center" },
  insetButton: { gap: 6, paddingHorizontal: 10 },
  insetText: { fontSize: 16, lineHeight: 21, fontWeight: "400", flexShrink: 1 },
  input: { ...type.body, color: colors.text, minHeight: 0 },
  inputFilled: { fontSize: 15 },
});
