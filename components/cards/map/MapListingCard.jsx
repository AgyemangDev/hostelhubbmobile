import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "../../ui";
import FavoriteHeartButton from "../../buttons/map/FavoriteHeartButton";
import { distanceKm, distanceLabel, priceTag } from "../../../utils/mapFormat";
import roomLabel from "../../../utils/roomLabel";
import { colors, radius, space } from "../../../constants/theme";

const CATEGORY = { hostel: "Hostel", homestel: "Homestel", hotel: "Hotel", "guest house": "Guest house", apartment: "Apartment" };

/**
 * A place in the map's results sheet, Airbnb-style: big rounded photo with a
 * heart, then name and rating on one line, what and where, distance, price.
 */
export default function MapListingCard({ place, kind, from, onPress }) {
  const clip = kind === "hubclip";
  const price = priceTag(clip ? place.price : place.min_price);
  const away = distanceLabel(distanceKm(from, place));
  const what = clip ? ["Video tour", roomLabel(place.room_type)].filter(Boolean).join(" · ") : CATEGORY[place.category] || "Hostel";

  return (
    <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={`${place.name}, ${what}${price ? `, ${price}` : ""}`} style={styles.card}>
      <View>
        <Image source={place.image ? { uri: place.image } : null} style={styles.photo} contentFit="cover" transition={200} />
        {!place.image ? (
          <View style={[styles.photo, styles.placeholder]}>
            <Ionicons name="home-outline" size={36} color={colors.brand} />
          </View>
        ) : null}
        {clip ? (
          <View style={styles.badge}>
            <Ionicons name="play" size={12} color={colors.text} />
            <Text style={styles.badgeText}>Hubclip</Text>
          </View>
        ) : place.available === false ? (
          <View style={styles.badge}><Text style={styles.badgeText}>Full</Text></View>
        ) : null}
        <FavoriteHeartButton id={place.id} kind={kind} style={styles.heart} />
      </View>

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name || "Unnamed place"}</Text>
          {place.rating ? (
            <View style={styles.rating}>
              <Ionicons name="star" size={12} color={colors.text} />
              <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.muted} numberOfLines={1}>{[what, place.location].filter(Boolean).join(" · ")}</Text>
        {away ? <Text style={styles.muted}>{away}</Text> : null}
        {price ? (
          <Text style={styles.priceLine}>
            {clip ? "" : "From "}<Text style={styles.price}>{price}</Text>
          </Text>
        ) : null}
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.sm },
  photo: { width: "100%", aspectRatio: 1.25, borderRadius: radius.lg, backgroundColor: colors.brandSoft },
  placeholder: { position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute",
    top: space.sm,
    left: space.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: { fontSize: 12, fontWeight: "800", color: colors.text },
  heart: { position: "absolute", top: space.sm + 2, right: space.sm + 2 },
  body: { gap: 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: space.sm },
  name: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingText: { fontSize: 14, color: colors.text },
  muted: { fontSize: 14, color: colors.textSecondary },
  priceLine: { fontSize: 14, color: colors.text, marginTop: 2 },
  price: { fontWeight: "800" },
});
