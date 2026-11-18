import React from "react";
import { StyleSheet, View } from "react-native";
import SectionHeader from "../headers/SectionHeader";
import { colors, space } from "../../../constants/theme";

/**
 * A titled block of a screen or form: SectionHeader plus its content.
 *
 * variant: plain (default) — title sits right above the content
 *          divided — separated from the previous section by a hairline,
 *                    for long forms that should read as one calm page
 * first:   drops the hairline on the first divided section
 * gap:     space between header and children (default md)
 * Header props: title, subtitle, hint, icon, right, headerVariant
 */
export default function Section({
  title,
  subtitle,
  hint,
  icon,
  right,
  headerVariant,
  variant = "plain",
  first,
  gap = space.md,
  children,
  style,
}) {
  const divided = variant === "divided";
  return (
    <View style={[{ gap }, divided && styles.divided, divided && first && styles.first, style]}>
      {title ? <SectionHeader title={title} subtitle={subtitle} hint={hint} icon={icon} right={right} variant={headerVariant} /> : null}
      <View style={{ gap }}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  divided: { paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderStrong },
  first: { borderTopWidth: 0, paddingTop: 0 },
});
