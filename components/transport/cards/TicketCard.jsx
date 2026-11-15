import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

// Shared vocabulary for every ticket-style card in the payment flow.
export const TICKET = {
  ink: "#161A2B",
  slate: "#6B7280",
  line: "#E4E7F0",
  amber: "#F5A524",
  amberDeep: "#B9770E",
};

// Monospace for anything that's data — times, seat numbers, money — so it
// reads like it came off a ticket printer rather than a settings screen.
export const MONO = Platform.select({ ios: "Courier", android: "monospace", default: "monospace" });

const NOTCH = 12;

/** A punched, dashed tear-line — the seam a real ticket stub would fold on. */
export const TicketDivider = () => (
  <View style={styles.dividerRow}>
    <View style={styles.notch} />
    <View style={styles.dashLine} />
    <View style={styles.notch} />
  </View>
);

/** Small corner tag identifying what this stub is, in place of an icon + title row. */
export const TicketTab = ({ children }) => (
  <View style={styles.tab}>
    <Text style={styles.tabText}>{children}</Text>
  </View>
);

const TicketCard = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export default TicketCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TICKET.line,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 18,
    gap: 12,
  },
  tab: {
    alignSelf: "flex-start",
    backgroundColor: "#FEF3E2",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 2,
  },
  tabText: {
    fontFamily: MONO,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: TICKET.amberDeep,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: -18, // bleeds to the card's edge so notches sit on the border
  },
  notch: {
    width: NOTCH,
    height: NOTCH,
    borderRadius: NOTCH / 2,
    backgroundColor: "#F3F4F8", // matches the screen canvas — "punches" the card
  },
  dashLine: {
    flex: 1,
    height: 1,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: TICKET.line,
    marginHorizontal: -1,
  },
});