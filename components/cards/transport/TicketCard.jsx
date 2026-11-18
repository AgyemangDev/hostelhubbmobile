import React from "react";
import { StyleSheet, View } from "react-native";
import { TICKET } from "../../../constants/ticket";
import { colors } from "../../../constants/theme";

/** White stub with a thin border; compose with TicketTab and TicketDivider. */
export default function TicketCard({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: TICKET.line,
    paddingTop: 14,
    paddingBottom: 18,
    paddingHorizontal: 18,
    gap: 12,
  },
});
