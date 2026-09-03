import React from "react";
import { View, Text, StyleSheet } from "react-native";
import TicketCard, { TicketDivider, TicketTab, TICKET, MONO } from "./TicketCard";

const PassengerInfoCard = ({ userInfo, user }) => {
  const fullName =
    userInfo?.first_name && userInfo?.surname
      ? `${userInfo.first_name} ${userInfo.surname}`
      : "—";
  const email = userInfo?.email || user?.email || "—";

  return (
    <TicketCard>
      <TicketTab>PASSENGER</TicketTab>

      <Text style={styles.name}>{fullName}</Text>

      <TicketDivider />

      <View>
        <Text style={styles.label}>TICKET SENT TO</Text>
        <Text style={styles.mono} numberOfLines={1}>{email}</Text>
      </View>
    </TicketCard>
  );
};

export default PassengerInfoCard;

const styles = StyleSheet.create({
  name: {
    fontSize: 17,
    fontWeight: "800",
    color: TICKET.ink,
  },
  label: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    color: TICKET.slate,
    marginBottom: 4,
  },
  mono: {
    fontFamily: MONO,
    fontSize: 14,
    fontWeight: "600",
    color: TICKET.ink,
  },
});