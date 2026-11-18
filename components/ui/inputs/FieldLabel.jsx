import React from "react";
import { HelperText } from "react-native-paper";
import Text from "../typography/Text";
import { colors, type } from "../../../constants/theme";

/** Bold label above a field. */
export function FieldLabel({ children }) {
  if (!children) return null;
  return (
    <Text variant="caption" style={{ fontWeight: "700" }}>
      {children}
    </Text>
  );
}

/** Error (red) or hint (grey) under a field. Paper's HelperText. */
export function FieldHelp({ error, hint }) {
  if (!error && !hint) return null;
  return (
    <HelperText
      type={error ? "error" : "info"}
      visible
      padding="none"
      style={[type.caption, { color: error ? colors.danger : colors.textMuted }]}
    >
      {error || hint}
    </HelperText>
  );
}
