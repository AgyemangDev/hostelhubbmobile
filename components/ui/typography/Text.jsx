import React from "react";
import { Text as PaperText } from "react-native-paper";
import { colors, type } from "../../../constants/theme";

const variants = {
  display: type.display,
  title: type.title,
  heading: type.heading,
  body: type.body,
  bodyStrong: type.bodyStrong,
  caption: type.caption,
  label: type.label,
  price: type.price,
  // Small uppercase label above a value ("PICKUP", "AVAILABLE BALANCE").
  eyebrow: type.label,
};

const tones = {
  default: colors.text,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  inverse: colors.textInverse,
  brand: colors.brand,
  danger: colors.danger,
  success: colors.success,
  warning: colors.warningText,
};

const defaultTone = { eyebrow: "secondary" };

/**
 * All text in the app. Paper's Text, set in our type scale.
 *
 * variant: display | title | heading | body | bodyStrong | caption | label | price | eyebrow
 * tone:    default | secondary | muted | inverse | brand | danger | success | warning
 */
export default function Text({ variant = "body", tone, style, ...props }) {
  const color = tones[tone || defaultTone[variant] || "default"];
  return <PaperText style={[variants[variant] || variants.body, { color }, style]} {...props} />;
}
