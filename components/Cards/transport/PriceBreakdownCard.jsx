import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TicketCard, { TicketDivider, TicketTab, TICKET, MONO } from "./TicketCard";

const money = (amount) => `GH₵${Number(amount || 0).toFixed(2)}`;

/**
 * Payment breakdown for a UniGo trip.
 * `lines` comes straight from UniGo's pricing response, so what the user
 * sees here is exactly what Hubtel will charge.
 */
const PriceBreakdownCard = ({ lines = [], total = 0 }) => (
  <TicketCard>
    <TicketTab>FARE</TicketTab>

    {lines.map((line) => (
      <View key={line.label} style={styles.row}>
        <Text style={[styles.rowLabel, line.muted && styles.muted]}>{line.label}</Text>
        <Text style={[styles.rowMono, line.muted && styles.muted]}>{money(line.amount)}</Text>
      </View>
    ))}

    <TicketDivider />

    <View style={styles.totalRow}>
      <Text style={styles.totalLabel}>TOTAL</Text>
      <Text style={styles.totalValue}>{money(total)}</Text>
    </View>
  </TicketCard>
);

export default PriceBreakdownCard;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: {
    fontSize: 13,
    color: TICKET.ink,
    fontWeight: "500",
  },
  rowMono: {
    fontFamily: MONO,
    fontSize: 13,
    color: TICKET.ink,
    fontWeight: "600",
  },
  muted: {
    color: TICKET.slate,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    color: TICKET.slate,
  },
  totalValue: {
    fontFamily: MONO,
    fontSize: 22,
    fontWeight: "800",
    color: TICKET.amberDeep,
  },
});