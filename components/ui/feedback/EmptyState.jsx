import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Avatar } from "react-native-paper";
import Text from "../typography/Text";
import { colors, space } from "../../../constants/theme";

const illustrations = {
  empty: require("../../../assets/images/Empty.gif"),
  error: require("../../../assets/images/Errors/General.gif"),
};

const defaultTitles = { error: "Oops! Something went wrong" };

/**
 * Centred empty or error state with one optional action.
 *
 * variant:      default | compact (less padding, for inside cards and sheets)
 *               | fill (takes the whole screen, centred vertically)
 * illustration: "empty" | "error" — shows the animated illustration instead of the icon
 * image:        any node shown instead of the icon (custom illustration, animation)
 */
export default function EmptyState({ icon = "file-tray-outline", illustration, image, title, body, action, variant = "default", style }) {
  const art = image || (illustration && illustrations[illustration] ? (
    <Image source={illustrations[illustration]} style={styles.illustration} resizeMode="contain" />
  ) : (
    <Avatar.Icon icon={icon} size={56} color={colors.text} style={styles.icon} />
  ));
  const heading = title ?? defaultTitles[illustration];
  return (
    <View style={[styles.empty, variant === "compact" && styles.compact, variant === "fill" && styles.fill, style]}>
      {art}
      {heading ? <Text variant="heading" style={styles.center}>{heading}</Text> : null}
      {body ? <Text tone="secondary" style={styles.center}>{body}</Text> : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: "center", gap: space.xs, padding: space.xl },
  compact: { padding: space.md },
  fill: { flex: 1, justifyContent: "center", backgroundColor: colors.background },
  icon: { backgroundColor: colors.fill, marginBottom: space.xs },
  illustration: { width: 200, height: 200, marginBottom: space.xs },
  center: { textAlign: "center" },
  action: { alignSelf: "stretch", marginTop: space.xs },
});
