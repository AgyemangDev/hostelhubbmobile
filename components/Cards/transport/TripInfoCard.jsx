import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TicketCard, { TicketDivider, TicketTab, TICKET, MONO } from "./TicketCard";

const TripInfoCard = ({ bus, selectedSeats }) => {
  const seatList = selectedSeats.map((s) => s.number).join(", ");

  return (
    <TicketCard>
      <TicketTab>TRIP</TicketTab>

      <View style={styles.routeRow}>
        <Text style={styles.routeText} numberOfLines={1}>{bus?.route?.from}</Text>
        <Ionicons name="arrow-forward" size={14} color={TICKET.slate} style={{ marginHorizontal: 8 }} />
        <Text style={styles.routeText} numberOfLines={1}>{bus?.route?.to}</Text>
      </View>
      <Text style={styles.busName}>{bus?.name}</Text>

      <TicketDivider />

      <View style={styles.dataRow}>
        <View>
          <Text style={styles.label}>DEPARTS</Text>
          <Text style={styles.mono}>{bus?.departureTime || "—"}</Text>
        </View>
        <View style={styles.seatsBlock}>
          <Text style={[styles.label, { textAlign: "right" }]}>
            SEAT{selectedSeats.length > 1 ? "S" : ""}
          </Text>
          <Text style={[styles.mono, { textAlign: "right" }]} numberOfLines={1}>
            {seatList || "—"}
          </Text>
        </View>
      </View>
    </TicketCard>
  );
};

export default TripInfoCard;

const styles = StyleSheet.create({
  routeRow: { flexDirection: "row", alignItems: "center" },
  routeText: {
    fontSize: 17,
    fontWeight: "800",
    color: TICKET.ink,
    flexShrink: 1,
  },
  busName: {
    fontSize: 12,
    color: TICKET.slate,
    marginTop: 2,
  },
  dataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  seatsBlock: { maxWidth: "55%" },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: TICKET.slate,
    marginBottom: 4,
  },
  mono: {
    fontFamily: MONO,
    fontSize: 15,
    fontWeight: "700",
    color: TICKET.ink,
  },
});