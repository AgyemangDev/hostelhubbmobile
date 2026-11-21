import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Rating, Text } from "../../ui";
import { space } from "../../../constants/theme";

/**
 * The text under a listing photo: name and rating, "Hostel in Bomso, KNUST",
 * how much interest it gets, and "From GH₵ x a year".
 * interest: { icon, label, count, hot } from listingInterest (utils/listingFacts);
 *           wraps to a second line rather than cutting off
 * size: md (rail cards) | lg (full-width cards)
 */
export default function ListingSummary({ name, place, institution, interest, price, rating, reviews, size = "lg" }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text variant="bodyStrong" numberOfLines={1} style={[styles.title, { fontSize: size === "md" ? 15 : 16 }]}>
          {name}
        </Text>
        <Rating value={rating} count={reviews} style={styles.rating} />
      </View>
      {place ? <Text tone="secondary" numberOfLines={1}>{place}</Text> : null}
      {institution ? <Text tone="secondary" numberOfLines={1}>Near {institution}</Text> : null}
      {interest ? (
        <View style={styles.interest}>
          <Icon name={interest.icon} size={14} tone={interest.hot ? "brand" : "secondary"} />
          <Text variant="caption" tone={interest.hot ? "brand" : "secondary"} numberOfLines={2} style={[styles.flex, interest.hot && styles.hot]}>
            {interest.label}{interest.count ? `, ${interest.count}` : ""}
          </Text>
        </View>
      ) : null}
      {price ? (
        <Text numberOfLines={1} style={{ marginTop: size === "md" ? 2 : 4 }}>
          <Text tone="secondary">From</Text>
          <Text style={{ fontWeight: "800" }}> {price}</Text>
          <Text tone="secondary"> a year</Text>
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 2, paddingTop: space.sm, paddingHorizontal: 2 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: space.xs },
  title: { flex: 1, fontWeight: "800", lineHeight: 21 },
  rating: { paddingTop: 3 },
  interest: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  flex: { flex: 1 },
  hot: { fontWeight: "700" },
});
