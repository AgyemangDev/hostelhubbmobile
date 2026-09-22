import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RULE_LABELS = [
  ["visitors_allowed", "Visitors are allowed"],
  ["cooking_allowed", "Cooking is allowed"],
  ["student_id_required", "Student ID is required"],
  ["internet_available", "Internet is available"],
  ["water_available", "Water is available"],
  ["laundry_available", "Laundry is available"],
  ["caretaker_available", "Caretaker is available"],
  ["early_arrival_policy", "Early arrival arrangements are available"],
  ["late_departure_policy", "Late departure arrangements are available"],
];

export default function AccommodationRules({ rules = {} }) {
  const available = RULE_LABELS.filter(([key]) => rules[key] === true);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hostel rules</Text>
      {available.length ? available.map(([key, label]) => (
        <View key={key} style={styles.row}>
          <Text style={styles.check}>✓</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      )) : (
        <Text style={styles.empty}>The manager has not provided hostel rules yet.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 24 },
  title: { fontSize: 22, fontWeight: "600", marginBottom: 12, color: "#222" },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  check: { color: "#0F6E56", fontSize: 18, fontWeight: "700", width: 26 },
  label: { color: "#222", fontSize: 15 },
  empty: { color: "#777", fontSize: 14, lineHeight: 21 },
});
