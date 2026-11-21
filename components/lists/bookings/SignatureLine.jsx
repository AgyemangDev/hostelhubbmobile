import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Icon, Text } from "../../ui";
import { colors, space } from "../../../constants/theme";

const SCRIPT = Platform.select({ ios: "Snell Roundhand", android: "cursive", default: undefined });
const when = (value) =>
  new Date(value).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

/**
 * One party's signature on the tenancy agreement: who signs, the signed name
 * in a handwriting face, and when, or what they are still waiting on.
 */
export default function SignatureLine({ role, name, signedName, signedAt, signed, pendingText, last }) {
  return (
    <View style={[styles.row, !last && styles.border]}>
      <Icon name={signed ? "checkmark-circle" : "ellipse-outline"} size={20} tone={signed ? "success" : "secondary"} />
      <View style={styles.main}>
        <Text variant="eyebrow">{role}</Text>
        {signed ? (
          <>
            <Text style={styles.signature} numberOfLines={1}>{signedName || name}</Text>
            <Text variant="caption" tone="secondary">{name}{signedAt ? ` · signed ${when(signedAt)}` : ""}</Text>
          </>
        ) : (
          <>
            <Text variant="bodyStrong">{name}</Text>
            <Text variant="caption" tone="warning">{pendingText}</Text>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: space.sm, paddingVertical: space.sm, alignItems: "flex-start" },
  border: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
  main: { flex: 1, gap: 2 },
  signature: { fontFamily: SCRIPT, fontStyle: SCRIPT ? "normal" : "italic", fontSize: 24, lineHeight: 32, color: colors.text },
});
