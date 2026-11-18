import React from "react";
import { Icon as PaperIcon } from "react-native-paper";
import { colors } from "../../../constants/theme";

const tones = {
  default: colors.text,
  secondary: colors.textSecondary,
  inverse: colors.textInverse,
  brand: colors.brand,
  danger: colors.danger,
  success: colors.success,
  warning: colors.warningText,
};

/**
 * An icon by Ionicons name ("heart-outline"), drawn through Paper so it
 * matches the icons inside buttons, chips and list rows.
 * tone: default | secondary | inverse | brand | danger | success | warning (or pass `color`)
 */
export default function Icon({ name, size = 20, tone = "default", color }) {
  return <PaperIcon source={name} size={size} color={color || tones[tone] || tones.default} />;
}
