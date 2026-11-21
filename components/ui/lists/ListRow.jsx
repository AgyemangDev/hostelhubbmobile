import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, List, RadioButton } from "react-native-paper";
import { colors, radius, space, type } from "../../../constants/theme";

/**
 * Row in a list. Built on Paper's List.Item.
 *
 * icon:     Ionicons name shown in a grey tile on the left (or pass `leading`)
 * right:    trailing node; otherwise a radio when `selected` is set, or a chevron when tappable
 * variant:  default | danger (red title, for "Delete account" rows)
 * last:     hides the bottom border
 */
export default function ListRow({ title, subtitle, icon, leading, onPress, right, last, selected, variant = "default", style }) {
  const isRadio = selected !== undefined;
  const danger = variant === "danger";
  const fg = danger ? colors.danger : colors.text;

  const left = leading
    ? () => leading
    : icon
    ? () => (
        <View style={[styles.icon, danger && { backgroundColor: colors.dangerBg }]}>
          <Icon source={icon} size={20} color={fg} />
        </View>
      )
    : undefined;

  const trailing =
    right !== undefined
      ? () => <View style={styles.side}>{right}</View>
      : isRadio
      ? () => (
          <RadioButton.Android
            value=""
            status={selected ? "checked" : "unchecked"}
            onPress={onPress}
            color={colors.text}
            uncheckedColor="#A8A29E"
          />
        )
      : onPress
      ? () => <View style={styles.side}><Icon source="chevron-forward" size={18} color={fg} /></View>
      : undefined;

  return (
    <List.Item
      title={title}
      description={subtitle}
      left={left}
      right={trailing}
      onPress={onPress}
      titleNumberOfLines={2}
      descriptionNumberOfLines={3}
      accessibilityRole={isRadio ? "radio" : onPress ? "button" : undefined}
      accessibilityState={isRadio ? { selected } : undefined}
      rippleColor={colors.fill}
      style={[styles.row, !last && styles.border, style]}
      contentStyle={[styles.content, !left && { paddingLeft: 0 }]}
      titleStyle={[type.body, styles.title, { color: fg }]}
      descriptionStyle={[type.caption, { color: colors.textSecondary }]}
    />
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 56, paddingVertical: space.sm, paddingRight: 0, paddingLeft: 0, justifyContent: "center" },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderStrong },
  content: { paddingLeft: space.sm, justifyContent: "center" },
  title: { fontWeight: "600" },
  // Trailing node (chevron, rating, badge) centred against the text block.
  side: { alignSelf: "center", justifyContent: "center", marginLeft: space.xs },
  icon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center", alignSelf: "center" },
});
