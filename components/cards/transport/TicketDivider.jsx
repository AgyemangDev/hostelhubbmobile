import React from "react";
import { StyleSheet, View } from "react-native";
import { TICKET } from "../../../constants/ticket";

const NOTCH = 12;

/** A punched, dashed tear-line — the seam a real ticket stub would fold on. */
export default function TicketDivider() {
  return (
    <View style={styles.row}>
      <View style={styles.notch} />
      <View style={styles.dash} />
      <View style={styles.notch} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Bleeds to the card's edge so the notches sit on the border.
  row: { flexDirection: "row", alignItems: "center", marginHorizontal: -18 },
  // Matches the screen canvas so it "punches" the card.
  notch: { width: NOTCH, height: NOTCH, borderRadius: NOTCH / 2, backgroundColor: TICKET.canvas },
  dash: { flex: 1, height: 1, borderStyle: "dashed", borderWidth: 1, borderColor: TICKET.line, marginHorizontal: -1 },
});
