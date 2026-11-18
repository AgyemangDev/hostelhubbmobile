import React from "react";
import { StyleSheet } from "react-native";
import { Chip as PaperChip } from "react-native-paper";
import { colors, onVideo, radius, type } from "../../../constants/theme";

// [unselected, selected] looks for each surface the chip sits on.
const tones = {
  // On white. Selected is ink, never green, so green always means "go".
  light: [
    { bg: colors.surface, fg: colors.text, border: colors.borderStrong },
    { bg: colors.text, fg: colors.textInverse, border: colors.text },
  ],
  // Raised white pill that looks pushed in when selected (pill tabs).
  raised: [
    { bg: colors.surface, fg: colors.text, border: colors.border, elevated: true },
    { bg: colors.text, fg: colors.textInverse, border: colors.text },
  ],
  // Over video or photos.
  dark: [
    { bg: onVideo.button.backgroundColor, fg: colors.textInverse, border: "rgba(255,255,255,0.55)", shadowText: true },
    { bg: "#FFFFFF", fg: colors.text, border: "#FFFFFF" },
  ],
};

/**
 * Selectable pill for filters and choices. Built on Paper's Chip.
 *
 * tone: light (default) | raised | dark
 * icon: Ionicons name
 * stretch: share the row's width with sibling chips
 */
export default function Chip({ label, selected, onPress, icon, tone = "light", stretch, accessibilityLabel, accessibilityRole, style }) {
  const t = (tones[tone] || tones.light)[selected ? 1 : 0];
  return (
    <PaperChip
      mode="outlined"
      selected={Boolean(selected)}
      showSelectedCheck={false}
      showSelectedOverlay={false}
      onPress={onPress}
      icon={icon}
      elevated={Boolean(t.elevated)}
      selectedColor={t.fg}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole={accessibilityRole}
      accessibilityState={{ selected: Boolean(selected) }}
      style={[styles.chip, { backgroundColor: t.bg, borderColor: t.border }, stretch && styles.stretch, style]}
      textStyle={[type.caption, styles.text, { color: t.fg, fontWeight: selected ? "800" : "700" }, t.shadowText && onVideo.text]}
    >
      {label}
    </PaperChip>
  );
}

const styles = StyleSheet.create({
  chip: { minHeight: 40, borderRadius: radius.pill, justifyContent: "center" },
  stretch: { flex: 1 },
  text: { marginVertical: 0, letterSpacing: 0, textAlign: "center" },
});
