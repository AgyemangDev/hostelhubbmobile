import React from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "../../ui";
import { MONO, TICKET } from "../../../constants/ticket";
import { colors } from "../../../constants/theme";

/** Small corner tag naming what a ticket stub is ("TRIP", "PASSENGER"). */
export default function TicketTab({ children }) {
  return (
    <View style={styles.tab}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tab: { alignSelf: "flex-start", backgroundColor: colors.warningBg, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, marginBottom: 2 },
  text: { fontFamily: MONO, fontSize: 10, lineHeight: 14, fontWeight: "700", letterSpacing: 1.5, color: TICKET.amberDeep },
});
