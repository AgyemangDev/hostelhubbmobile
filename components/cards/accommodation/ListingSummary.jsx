import React from "react";
import { StyleSheet, View } from "react-native";
import { Rating, Text } from "../../ui";
import { space } from "../../../constants/theme";

/**
 * The text under a listing photo: name and rating, place, school and "From GH₵ x a year".
 * size: md (rail cards) | lg (full-width cards)
 */
export default function ListingSummary({ name, place, institution, price, rating, reviews, size = "lg" }) {
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
});
