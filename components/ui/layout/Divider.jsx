import React from "react";
import { Divider as PaperDivider } from "react-native-paper";
import { colors, space } from "../../../constants/theme";

/**
 * Hairline separator. Built on Paper's Divider.
 * variant: full (default) | inset (indented to line up with list text) | spaced (adds vertical room)
 */
export default function Divider({ variant = "full", style }) {
  return (
    <PaperDivider
      horizontalInset={variant === "inset"}
      style={[{ backgroundColor: colors.borderStrong }, variant === "spaced" && { marginVertical: space.md }, style]}
    />
  );
}
