import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

const EmptyState = () => (
  <View style={styles.container}>
    <Feather name="bell-off" size={60} color="#9CA3AF" />
    <Text style={styles.title}>No Notifications</Text>
    <Text style={styles.subtitle}>You’re all caught up!</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
});

export default EmptyState;
