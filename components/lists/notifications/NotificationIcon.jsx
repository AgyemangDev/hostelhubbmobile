import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon } from "../../ui";
import { colors, radius } from "../../../constants/theme";

const tones = {
  info: { bg: colors.fill, fg: colors.text },
  brand: { bg: colors.brandSoft, fg: colors.brand },
  warning: { bg: colors.warningBg, fg: colors.warningText },
  danger: { bg: colors.dangerBg, fg: colors.danger },
  success: { bg: colors.successBg, fg: colors.success },
};

// Booking updates pick their icon and tone from the booking status.
const BOOKING = {
  accepted: { icon: "checkmark-circle-outline", tone: "success" },
  cancelled: { icon: "close-circle-outline", tone: "danger" },
  pending: { icon: "time-outline", tone: "warning" },
};

/**
 * Tinted icon tile on the left of a notification.
 * Pass `icon` + `tone`, or a booking `type` + `status`.
 */
export default function NotificationIcon({ icon, tone, type, status }) {
  const booking = type === "booking" ? BOOKING[status] || { icon: "calendar-outline", tone: "brand" } : null;
  const t = tones[booking?.tone || tone] || tones.info;
  return (
    <View style={[styles.tile, { backgroundColor: t.bg }]}>
      <Icon name={booking?.icon || icon || "notifications-outline"} size={20} color={t.fg} />
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { width: 40, height: 40, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
});
