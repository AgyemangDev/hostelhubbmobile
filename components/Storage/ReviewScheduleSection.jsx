"use client";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/Colors";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not set";

const formatAddress = (info) => {
  if (!info) return "Not set";

  const parts = [];

  if (info.area === "Off Campus") {
    if (info.hostel) parts.push(info.hostel);
    if (info.offCampusArea) parts.push(info.offCampusArea);
  } else if (info.area) {
    parts.push(info.area);
  }

  if (info.room) parts.push(`Room ${info.room}`);

  return parts.length ? parts.join(", ") : "Not set";
};

export default function ReviewScheduleSection({ pickupInfo, deliveryInfo }) {
  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
        <Text style={styles.title}>Pickup & Delivery</Text>
      </View>

      <View style={styles.card}>
        <Ionicons name="arrow-up-circle" size={22} color={COLORS.success} />
        <View style={styles.details}>
          <Text style={styles.label}>Pickup</Text>
          <Text style={styles.date}>{formatDate(pickupInfo?.date)}</Text>
          <Text style={styles.location}>
            {formatAddress(pickupInfo)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Ionicons name="arrow-down-circle" size={22} color={COLORS.primary} />
        <View style={styles.details}>
          <Text style={styles.label}>Delivery</Text>
          <Text style={styles.date}>{formatDate(deliveryInfo?.date)}</Text>
          <Text style={styles.location}>
            {formatAddress(deliveryInfo)}
          </Text>
        </View>
        <Pressable>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        </Pressable>
      </View>

      <View style={styles.notice}>
        <Ionicons name="information-circle" size={20} color={COLORS.primary} />
        <Text style={styles.noticeText}>
          You can change delivery details up to{" "}
          <Text style={styles.bold}>1 week before delivery</Text>.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 14,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    marginBottom: 12,
  },
  details: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textMuted,
    textTransform: "uppercase",
  },
  date: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textDark,
  },
  location: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  notice: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  noticeText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
  },
  bold: {
    fontWeight: "700",
    color: COLORS.primary,
  },
});