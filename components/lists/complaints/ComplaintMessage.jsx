import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../ui";
import { COMPLAINT_STATUS } from "../../../constants/complaints";
import { colors, radius, space } from "../../../constants/theme";

const AUTHOR = { student: "You", owner: "Hostel", admin: "HostelHubb", system: "HostelHubb" };
const when = (iso) => new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

/** One message in a complaint thread; status changes show as a centred note. */
export default function ComplaintMessage({ message }) {
  if (message.status_change) {
    return (
      <Text variant="caption" tone="secondary" style={styles.event}>
        {AUTHOR[message.sender_type]} marked it {(COMPLAINT_STATUS[message.status_change]?.label || message.status_change).toLowerCase()}
        {message.body && !/^(Marked as|HostelHubb marked)/.test(message.body) ? `: ${message.body}` : ""} · {when(message.created_at)}
      </Text>
    );
  }
  const mine = message.sender_type === "student";
  return (
    <View style={[styles.wrap, mine ? styles.right : styles.left]}>
      <View style={[styles.bubble, mine ? styles.mine : message.sender_type === "admin" ? styles.admin : styles.theirs]}>
        <Text style={mine ? styles.mineText : null}>{message.body}</Text>
      </View>
      <Text variant="caption" tone="secondary">{AUTHOR[message.sender_type] || "Someone"} · {when(message.created_at)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { maxWidth: "85%", gap: 3 },
  left: { alignSelf: "flex-start" },
  right: { alignSelf: "flex-end", alignItems: "flex-end" },
  bubble: { paddingHorizontal: space.sm, paddingVertical: space.xs + 2, borderRadius: radius.lg },
  mine: { backgroundColor: colors.brand, borderBottomRightRadius: 4 },
  mineText: { color: colors.onBrand },
  theirs: { backgroundColor: colors.fill, borderBottomLeftRadius: 4 },
  admin: { backgroundColor: colors.warningBg, borderBottomLeftRadius: 4 },
  event: { textAlign: "center", paddingHorizontal: space.md },
});
