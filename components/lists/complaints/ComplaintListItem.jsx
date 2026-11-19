import React from "react";
import { StyleSheet, View } from "react-native";
import { Card, Icon, StatusPill, Text } from "../../ui";
import { COMPLAINT_CATEGORIES, COMPLAINT_STATUS } from "../../../constants/complaints";
import { colors, radius, space } from "../../../constants/theme";

/** One of the student's complaints: what, where, and how it is going. */
export default function ComplaintListItem({ complaint, onPress }) {
  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category) || COMPLAINT_CATEGORIES.at(-1);
  const status = COMPLAINT_STATUS[complaint.status] || COMPLAINT_STATUS.open;
  return (
    <Card onPress={onPress} style={styles.card} accessibilityLabel={`${complaint.title}, ${status.label}`}>
      <View style={styles.icon}><Icon name={category.icon} size={20} /></View>
      <View style={styles.body}>
        <Text variant="bodyStrong" numberOfLines={1}>{complaint.title}</Text>
        <Text variant="caption" tone="secondary" numberOfLines={1}>
          {complaint.accommodation_name} · {new Date(complaint.last_activity_at || complaint.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
        </Text>
        <StatusPill label={status.label} tone={status.tone} style={styles.pill} />
      </View>
      <Icon name="chevron-forward" size={18} tone="secondary" />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: space.sm },
  icon: { width: 44, height: 44, borderRadius: radius.md, backgroundColor: colors.fill, alignItems: "center", justifyContent: "center" },
  body: { flex: 1, gap: 2 },
  pill: { marginTop: 4 },
});
