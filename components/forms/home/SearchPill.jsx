import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon, PressableScale, Text } from "../../ui";
import { colors, radius, space } from "../../../constants/theme";

/** White search pill on Home: icon, two-line prompt, and a round filter button. */
export default function SearchPill({ onPress, onFilter }) {
  return (
    <PressableScale onPress={onPress} accessibilityRole="search" accessibilityLabel="Find your student accommodation" style={styles.pill}>
      <Icon name="search" size={20} />
      <View style={styles.text}>
        <Text style={styles.title} numberOfLines={1}>Find your next accommodation</Text>
        <Text variant="caption" tone="secondary" numberOfLines={1}>Any school · Any area · Any budget</Text>
      </View>
      <Pressable
        onPress={onFilter}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Filters"
        style={({ pressed }) => [styles.filter, pressed && { backgroundColor: colors.fill }]}
      >
        <Icon name="options-outline" size={18} />
      </Pressable>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    minHeight: 60,
    paddingLeft: space.md + 2,
    paddingRight: space.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  text: { flex: 1, gap: 1 },
  title: { fontSize: 15, lineHeight: 20, fontWeight: "700", color: colors.text },
  filter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
});
