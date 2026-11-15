import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { onVideo } from "../../constants/theme";

const CATEGORY_LABELS = { hostel: "Hostel", homestel: "Homestel", apartment: "Apartment" };

/** Bottom-left of a clip: place, room, location, amenities (tap to expand). */
export default function LeftInfo({ item }) {
  const [expanded, setExpanded] = useState(false);
  const category = CATEGORY_LABELS[item.category?.toLowerCase()] || item.category;
  const amenities = Array.isArray(item.amenities) ? item.amenities : [];
  const title = item.hostel_name || [item.room_type, category].filter(Boolean).join(" · ");

  return (
    <View style={styles.wrap}>
      <Text style={styles.title} numberOfLines={2}>{title}</Text>
      <Text style={styles.meta} numberOfLines={1}>
        {[item.room_type, category].filter(Boolean).join(" · ")}
      </Text>
      <View style={styles.row}>
        <Ionicons name="location-outline" size={14} color="#FFFFFF" style={shadow} />
        <Text style={styles.meta} numberOfLines={1}>
          {[item.location, item.institution].filter(Boolean).join(" · ")}
        </Text>
      </View>
      {amenities.length ? (
        <Pressable onPress={() => setExpanded((v) => !v)} accessibilityRole="button" accessibilityLabel={expanded ? "Show fewer amenities" : "Show all amenities"} hitSlop={6}>
          <Text style={styles.amenities} numberOfLines={expanded ? undefined : 1}>
            {amenities.join(" · ")}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const shadow = onVideo.text;
const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 4, paddingRight: 12 },
  title: { color: "#FFFFFF", fontSize: 22, lineHeight: 27, fontWeight: "800", letterSpacing: -0.2, ...shadow },
  meta: { color: "#E7E5E4", fontSize: 14, fontWeight: "600", ...shadow },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },
  amenities: { color: "#E7E5E4", fontSize: 13, lineHeight: 18, fontWeight: "500", marginTop: 2, ...shadow },
});
