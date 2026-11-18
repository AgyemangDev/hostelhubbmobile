import React, { forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { FieldHelp, FieldLabel } from "./FieldLabel";
import { colors, radius } from "../../../constants/theme";

/**
 * Text input with the label above it and an error or hint below.
 * Built on Paper's outlined TextInput; takes every TextInput prop.
 *
 * variant: outlined (default) | filled (grey, borderless, for search-style fields)
 * left / right: adornments, e.g. <TextField.Icon icon="eye-outline" onPress={...} />
 */
const TextField = forwardRef(function TextField(
  { label, hint, error, variant = "outlined", style, inputStyle, left, right, multiline, ...inputProps },
  ref
) {
  const filled = variant === "filled";
  return (
    <View style={[styles.wrap, style]}>
      <FieldLabel>{label}</FieldLabel>
      <TextInput
        ref={ref}
        mode="outlined"
        accessibilityLabel={label}
        placeholderTextColor={colors.textMuted}
        textColor={colors.text}
        outlineColor={filled ? "transparent" : "#A8A29E"}
        activeOutlineColor={colors.text}
        outlineStyle={styles.outline}
        error={Boolean(error)}
        multiline={multiline}
        left={left}
        right={right}
        style={[styles.input, filled && styles.filled, multiline && styles.multiline, inputStyle]}
        {...inputProps}
      />
      <FieldHelp error={typeof error === "string" ? error : null} hint={hint} />
    </View>
  );
});

TextField.Icon = TextInput.Icon;
TextField.Affix = TextInput.Affix;

export default TextField;

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  outline: { borderRadius: radius.md },
  input: { backgroundColor: colors.surface, fontSize: 16, minHeight: 52 },
  filled: { backgroundColor: colors.fill },
  multiline: { minHeight: 110, textAlignVertical: "top", paddingTop: 8 },
});
