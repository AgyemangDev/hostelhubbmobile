import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Icon from "../icons/Icon";
import Text from "../typography/Text";
import { colors, onVideo } from "../../../constants/theme";

/**
 * Icon with a short label underneath ("♥ Save", "↗ Share"), the side actions on a clip.
 * Without onPress it renders as a read-only stat ("👁 1.2k").
 *
 * variant:       default (ink, on white) | onVideo (white with a shadow, over video)
 * selectedIcon / selectedColor: icon and colour while `selected`
 */
export default function LabeledIconButton({ icon, selectedIcon, label, onPress, selected, selectedColor, variant = "default", size = 28, accessibilityLabel }) {
  const video = variant === "onVideo";
  const color = selected && selectedColor ? selectedColor : video ? colors.textInverse : colors.text;
  const body = (
    <>
      <View style={video ? styles.shadow : null}>
        <Icon name={selected && selectedIcon ? selectedIcon : icon} size={size} color={color} />
      </View>
      <Text variant="label" style={[styles.label, video && onVideo.text, !video && { color: colors.text }]}>
        {label}
      </Text>
    </>
  );
  if (!onPress) return <View style={styles.item}>{body}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={selected !== undefined ? { selected } : undefined}
      accessibilityLabel={accessibilityLabel || label}
      hitSlop={10}
      style={({ pressed }) => [styles.item, pressed && { opacity: 0.7 }]}
    >
      {body}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: { alignItems: "center", gap: 4 },
  label: { letterSpacing: 0 },
  shadow: { shadowColor: "#000", shadowOpacity: 0.75, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 2 },
});
