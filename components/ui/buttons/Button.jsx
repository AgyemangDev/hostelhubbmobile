import React from "react";
import { StyleSheet } from "react-native";
import { Button as PaperButton } from "react-native-paper";
import { colors, radius, type } from "../../../constants/theme";

const WHATSAPP = colors.whatsapp;

// Each variant is a Paper button mode plus our colours.
const variants = {
  // The one main action on a screen.
  primary: { mode: "contained", buttonColor: colors.brand, textColor: colors.onBrand },
  // Outline, for the second action next to a primary.
  secondary: { mode: "outlined", textColor: colors.text, style: { borderColor: colors.text, backgroundColor: colors.surface } },
  // White button on dark or photo backgrounds.
  inverse: { mode: "contained", buttonColor: colors.surface, textColor: colors.text },
  // Underlined text link that still has a button's touch target.
  ghost: { mode: "text", textColor: colors.text, labelStyle: { textDecorationLine: "underline" } },
  // Destructive action (delete account, cancel booking).
  danger: { mode: "contained", buttonColor: colors.danger, textColor: colors.textInverse },
  // Destructive but secondary (log out).
  dangerOutline: { mode: "outlined", textColor: colors.danger, style: { borderColor: colors.danger, backgroundColor: colors.surface } },
  // Soft grey, for low-emphasis actions inside cards.
  tonal: { mode: "contained-tonal", buttonColor: colors.fill, textColor: colors.text },
  whatsapp: { mode: "contained", buttonColor: WHATSAPP, textColor: colors.textInverse },
};

const sizes = {
  lg: { content: { minHeight: 52 }, label: type.bodyStrong },
  sm: { content: { minHeight: 44 }, label: type.caption },
};

/**
 * Every button in the app. Built on Paper's Button.
 *
 * variant: primary | secondary | inverse | ghost | danger | dangerOutline | tonal | whatsapp
 * size:    lg (default, full-height form button) | sm (inside cards and rows)
 * icon:    Ionicons name, or a render function ({ size, color }) => node
 * iconPosition: "left" (default) | "right"
 */
export default function Button({
  title,
  children,
  onPress,
  variant = "primary",
  size = "lg",
  loading,
  disabled,
  icon,
  iconPosition = "left",
  compact,
  style,
  labelStyle,
  contentStyle,
  accessibilityLabel,
  testID,
}) {
  const v = variants[variant] || variants.primary;
  const s = sizes[size] || sizes.lg;
  const label = title ?? children;
  return (
    <PaperButton
      mode={v.mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled || loading}
      icon={icon}
      compact={compact}
      buttonColor={v.buttonColor}
      textColor={v.textColor}
      uppercase={false}
      accessibilityLabel={accessibilityLabel || (typeof label === "string" ? label : undefined)}
      testID={testID}
      style={[styles.button, v.style, style]}
      contentStyle={[s.content, iconPosition === "right" && styles.iconRight, contentStyle]}
      labelStyle={[s.label, styles.label, v.labelStyle, labelStyle]}
    >
      {label}
    </PaperButton>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.md },
  label: { fontWeight: "700", letterSpacing: 0, marginVertical: 0 },
  iconRight: { flexDirection: "row-reverse" },
});
