import React from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenHeader from "./ScreenHeader";
import { colors } from "../../../constants/theme";

/**
 * Header for an expo-router Stack screen: `options={{ header: () => <StackHeader title="…" showBack /> }}`.
 * ScreenHeader plus the status-bar inset and a hairline underneath.
 */
export default function StackHeader({ title, subtitle, showBack = false, right }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top }]}>
      <ScreenHeader title={title} subtitle={subtitle} hideBack={!showBack} right={right} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.background, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
});
