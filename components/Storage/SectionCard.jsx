"use client";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

/**
 * Consistent "card" wrapper used to group a section of a form.
 * Keeps every section on the page visually identical: same padding,
 * radius, header treatment and divider — instead of each section
 * hand-rolling its own header markup.
 */
export default function SectionCard({ icon, title, subtitle, right, children }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {icon ? (
          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={18} color={COLORS.teal} />
          </View>
        ) : null}

        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        {right ? <View>{right}</View> : null}
      </View>

      <View style={styles.divider} />

      <View style={styles.body}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ECECEC",
    padding: 20,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#f0fdfa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
    letterSpacing: 0.1,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: "#ECECEC",
    marginTop: 16,
    marginBottom: 18,
  },
  body: {
    gap: 16,
  },
});