import React from "react";
import { TextField } from "../../ui";
import { normalizeGhanaPhone, WHATSAPP_HINT } from "../../../utils/phone";
import { colors } from "../../../constants/theme";

/**
 * The student's WhatsApp number. Accepts 024…, +233…, 233… and tidies a
 * valid number to 0XXXXXXXXX when the field loses focus.
 */
export default function WhatsAppNumberField({ value, onChangeText, error, hint = WHATSAPP_HINT, label = "WhatsApp number", ...props }) {
  const tidy = () => {
    const normalized = normalizeGhanaPhone(value);
    if (normalized && normalized !== value) onChangeText(normalized);
  };
  return (
    <TextField
      label={label}
      placeholder="e.g. 024 123 4567"
      value={value}
      onChangeText={onChangeText}
      onBlur={tidy}
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      maxLength={18}
      left={<TextField.Icon icon="logo-whatsapp" color={colors.whatsapp} />}
      error={error}
      hint={hint}
      {...props}
    />
  );
}
