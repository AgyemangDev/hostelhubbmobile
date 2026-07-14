"use client";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

/**
 * Read-only representation of a location, used in place of the full
 * LocationSelector when the delivery address is synced to pickup.
 * Showing a clean summary (instead of a second, disabled set of
 * dropdowns) keeps the synced state feeling intentional rather than
 * like a broken form.
 */
export default function LocationSummaryCard({ info, onEdit }) {
  if (!info?.area) return null;

  const primaryLine = info.area === "Off Campus" ? info.offCampusArea : info.area;
  const secondaryParts = [];
  if (info.area === "Off Campus" && info.hostel) secondaryParts.push(info.hostel);
  if (info.room) secondaryParts.push(`Room ${info.room}`);

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="location" size={16} color={COLORS.teal} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.primary} numberOfLines={1}>
          {primaryLine || "—"}
        </Text>
        {secondaryParts.length > 0 && (
          <Text style={styles.secondary} numberOfLines={1}>
            {secondaryParts.join(" · ")}
          </Text>
        )}
      </View>

      {onEdit && (
        <Pressable onPress={onEdit} hitSlop={8} style={styles.editButton}>
          <Text style={styles.editText}>Change</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0fdfa",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  primary: {
    fontSize: 14.5,
    fontWeight: "600",
    color: COLORS.textDark,
  },
  secondary: {
    marginTop: 2,
    fontSize: 12.5,
    color: COLORS.textMuted,
  },
  editButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  editText: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.link,
  },
});