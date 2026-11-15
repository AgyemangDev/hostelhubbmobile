import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, space, type } from "../../constants/theme";

/**
 * A titled section of a form. Flat by design: sections are separated by a
 * hairline, not boxed in cards, so the form reads as one calm page.
 * (`icon` is accepted for older callers and intentionally not drawn.)
 */
export default function SectionCard({ title, subtitle, right, children, first }) {
  return (
    <View style={[styles.section, first && { borderTopWidth: 0, paddingTop: 0 }]}>
      <View style={styles.header}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={type.heading} accessibilityRole="header">{title}</Text>
          {subtitle ? <Text style={[type.caption, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
        </View>
        {right ? <View>{right}</View> : null}
      </View>
      <View style={{ gap: space.md }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { gap: space.md, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  header: { flexDirection: "row", alignItems: "flex-start", gap: space.sm },
});
