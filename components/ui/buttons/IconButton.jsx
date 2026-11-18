import React from "react";
import { StyleSheet } from "react-native";
import { IconButton as PaperIconButton } from "react-native-paper";
import { colors, minTouch, onVideo } from "../../../constants/theme";

const variants = {
  // Bare icon (back, close, share in a header).
  plain: { iconColor: colors.text },
  // White circle with a soft shadow, floating over photos.
  floating: { mode: "contained", iconColor: colors.text, containerColor: colors.surface, style: { elevation: 3, shadowColor: "#1C1917", shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } } },
  // Thin outline circle.
  outlined: { mode: "outlined", iconColor: colors.text, style: { borderColor: colors.borderStrong } },
  // Grey circle.
  tonal: { mode: "contained", iconColor: colors.text, containerColor: colors.fill },
  // Translucent circle over full-screen video.
  onVideo: { mode: "contained", iconColor: colors.textInverse, containerColor: onVideo.button.backgroundColor },
};

/**
 * Icon-only button. Built on Paper's IconButton; always a 44pt touch target.
 *
 * variant: plain | floating | outlined | tonal | onVideo
 * icon:    Ionicons name, or a render function ({ size, color }) => node
 * color:   overrides the variant's icon colour
 */
export default function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  variant = "plain",
  color,
  size = 22,
  selected,
  disabled,
  style,
  testID,
}) {
  const v = variants[variant] || variants.plain;
  return (
    <PaperIconButton
      icon={icon}
      mode={v.mode}
      size={size}
      iconColor={color || v.iconColor}
      containerColor={v.containerColor}
      selected={selected}
      disabled={disabled}
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
      testID={testID}
      style={[styles.base, v.style, style]}
    />
  );
}

const styles = StyleSheet.create({
  base: { margin: 0, width: minTouch, height: minTouch, borderRadius: minTouch / 2 },
});
