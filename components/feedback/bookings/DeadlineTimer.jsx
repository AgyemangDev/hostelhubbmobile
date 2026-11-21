import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useCountdown from "../../../hooks/useCountdown";
import { colors } from "../../../constants/theme";

const URGENT_MS = 6 * 60 * 60 * 1000;

const COPY = {
  // Waiting for the hostel to accept.
  response: {
    before: "Cancels automatically in ",
    after: " if the hostel doesn't accept",
    expired: "The hostel didn't reply in time. This booking is being cancelled.",
  },
  // Accepted, waiting for the student to pay.
  payment: {
    before: "Pay within ",
    after: " or it's cancelled",
    expired: "The time to pay has run out. This booking is being cancelled.",
  },
};

/**
 * Countdown strip on a booking card: how long until the system cancels it.
 * Amber while there's time, red in the last 6 hours.
 */
export default function DeadlineTimer({ dueAt, kind = "response" }) {
  const left = useCountdown(dueAt);
  if (!left) return null;
  const copy = COPY[kind] || COPY.response;
  const urgent = left.expired || left.ms < URGENT_MS;
  const fg = urgent ? colors.danger : colors.warningText;

  return (
    <View
      style={[styles.box, { backgroundColor: urgent ? colors.dangerBg : colors.warningBg }]}
      accessibilityRole="timer"
      accessibilityLabel={left.expired ? copy.expired : `${copy.before}${left.label}${copy.after}`}
    >
      <Ionicons name={left.expired ? "alert-circle-outline" : "hourglass-outline"} size={16} color={fg} />
      <Text style={[styles.text, { color: fg }]}>
        {left.expired ? copy.expired : (
          <>
            {copy.before}
            <Text style={styles.time}>{left.label}</Text>
            {copy.after}
          </>
        )}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, marginBottom: 8 },
  text: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "500" },
  time: { fontWeight: "800", fontVariant: ["tabular-nums"] },
});
