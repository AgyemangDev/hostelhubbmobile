import React from "react";
import { Platform, Switch, Text, View } from "react-native";
import { colors, space, type } from "../../constants/theme";

/** A labelled setting with a switch ("Same as pickup", "Decide later"). */
export default function ToggleRow({ label, description, value, onValueChange, disabled }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: space.md, minHeight: 48, opacity: disabled ? 0.45 : 1 }}>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.bodyStrong}>{label}</Text>
        {description ? <Text style={[type.caption, { color: colors.textSecondary }]}>{description}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        accessibilityLabel={label}
        trackColor={{ false: "#D6D3D1", true: colors.text }}
        thumbColor={colors.surface}
        ios_backgroundColor="#D6D3D1"
        style={Platform.OS === "android" ? { transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }] } : undefined}
      />
    </View>
  );
}
