import React from "react";
import { StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import IconButton from "../buttons/IconButton";
import Text from "../typography/Text";
import { minTouch, space } from "../../../constants/theme";
import { goBack } from "./goBack";

/**
 * Screen title row with a back button.
 * variant: default | large (big title under the back button, for top-level pages)
 * backIcon: "chevron-back" (default) | "close" for screens presented as a modal
 */
export default function ScreenHeader({ title, subtitle, onBack, right, hideBack, variant = "default", backIcon = "chevron-back" }) {
  const router = useRouter();
  const back = hideBack ? (
    <View style={{ width: space.xs }} />
  ) : (
    <IconButton icon={backIcon} accessibilityLabel={backIcon === "close" ? "Close" : "Go back"} onPress={onBack || (() => goBack(router))} />
  );

  if (variant === "large") {
    return (
      <View>
        <View style={styles.header}>
          {back}
          <View style={{ flex: 1 }} />
          <View style={styles.right}>{right}</View>
        </View>
        <View style={styles.largeTitle}>
          {title ? <Text variant="title" accessibilityRole="header">{title}</Text> : null}
          {subtitle ? <Text variant="caption" tone="secondary">{subtitle}</Text> : null}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.header}>
      {back}
      <View style={{ flex: 1 }}>
        {title ? (
          <Text variant="heading" numberOfLines={1} accessibilityRole="header">
            {title}
          </Text>
        ) : null}
        {subtitle ? (
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={styles.right}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: space.xs, paddingVertical: space.xxs, gap: space.xxs, minHeight: 52 },
  right: { minWidth: minTouch, alignItems: "flex-end", paddingRight: space.xs },
  largeTitle: { paddingHorizontal: space.lg, paddingBottom: space.sm, gap: 2 },
});
