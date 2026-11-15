import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "../ui/ds";
import { colors, radius, space, type } from "../../constants/theme";

/** Read-only location, shown when delivery is synced to pickup. */
export default function LocationSummaryCard({ info, onEdit }) {
  if (!info?.area) return null;
  const primary = info.area === "Off Campus" ? info.offCampusArea : info.area;
  const secondary = [info.area === "Off Campus" && info.hostel, info.room && `Room ${info.room}`].filter(Boolean).join(" · ");
  return (
    <View style={styles.card}>
      <Ionicons name="location-outline" size={20} color={colors.text} />
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={type.bodyStrong} numberOfLines={1}>{primary || "—"}</Text>
        {secondary ? <Text style={[type.caption, { color: colors.textSecondary }]} numberOfLines={1}>{secondary}</Text> : null}
      </View>
      {onEdit ? <Button title="Change" variant="ghost" size="sm" onPress={onEdit} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: space.sm, padding: space.sm + 2, borderRadius: radius.md, backgroundColor: colors.fill },
});
