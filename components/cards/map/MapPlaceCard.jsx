import React from "react";
import { Linking, Platform, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { IconButton, PressableScale } from "../../ui";
import FavoriteHeartButton from "../../buttons/map/FavoriteHeartButton";
import { distanceKm, distanceLabel, priceTag } from "../../../utils/mapFormat";
import roomLabel from "../../../utils/roomLabel";
import { colors, elevation, radius, space } from "../../../constants/theme";

const CATEGORY = { hostel: "Hostel", homestel: "Homestel", hotel: "Hotel", "guest house": "Guest house", apartment: "Apartment" };

/**
 * The card for a tapped pin, in the swipeable row above the map (Airbnb's
 * map carousel): photo with heart, name, rating, where, distance and price.
 * Tap to open; the arrow button gets directions.
 */
export default function MapPlaceCard({ place, kind, from, width, onOpen }) {
  const clip = kind === "hubclip";
  const price = priceTag(clip ? place.price : place.min_price);
  const away = distanceLabel(distanceKm(from, place));
  const what = clip ? ["Video tour", roomLabel(place.room_type)].filter(Boolean).join(" · ") : CATEGORY[place.category] || "Hostel";

  const directions = () => {
    const { latitude: lat, longitude: lng } = place;
    const url = Platform.OS === "ios"
      ? `http://maps.apple.com/?daddr=${lat},${lng}&q=${encodeURIComponent(place.name || "Hostel")}`
      : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <PressableScale onPress={onOpen} accessibilityRole="button" accessibilityLabel={`Open ${place.name}`} style={[styles.card, { width }]}>
      <View style={styles.photoWrap}>
        <Image source={place.image ? { uri: place.image } : null} style={styles.photo} contentFit="cover" transition={150} />
        {!place.image ? (
          <View style={[styles.photo, styles.placeholder]}>
            <Ionicons name="home-outline" size={28} color={colors.brand} />
          </View>
        ) : null}
        {clip ? (
          <View style={styles.play}><Ionicons name="play" size={14} color={colors.textInverse} /></View>
        ) : null}
        <FavoriteHeartButton id={place.id} kind={kind} size={20} style={styles.heart} />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name} numberOfLines={1}>{place.name || "Unnamed place"}</Text>
          {place.rating ? (
            <View style={styles.rating}>
              <Ionicons name="star" size={11} color={colors.text} />
              <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.muted} numberOfLines={1}>{what}</Text>
        {place.location ? <Text style={styles.muted} numberOfLines={1}>{place.location}</Text> : null}
        <View style={styles.bottomRow}>
          <View style={styles.flex}>
            {price ? (
              <Text style={styles.priceLine} numberOfLines={1}>{clip ? "" : "From "}<Text style={styles.price}>{price}</Text></Text>
            ) : null}
            {away ? <Text style={styles.muted} numberOfLines={1}>{away}</Text> : null}
          </View>
          <IconButton icon="navigate" variant="tonal" size={16} onPress={directions} accessibilityLabel="Directions" />
        </View>
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    overflow: "hidden",
    ...elevation.floating,
  },
  photoWrap: { width: 124, alignSelf: "stretch" },
  photo: { width: 124, height: "100%", minHeight: 124, backgroundColor: colors.brandSoft },
  placeholder: { position: "absolute", top: 0, left: 0, alignItems: "center", justifyContent: "center" },
  play: {
    position: "absolute",
    left: 48,
    top: "50%",
    marginTop: -14,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
  },
  heart: { position: "absolute", top: space.sm, left: space.sm },
  info: { flex: 1, paddingVertical: space.sm, paddingLeft: space.sm + 2, paddingRight: space.xs, gap: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: space.xs, paddingRight: space.xs },
  name: { flex: 1, fontSize: 15, fontWeight: "700", color: colors.text },
  rating: { flexDirection: "row", alignItems: "center", gap: 2 },
  ratingText: { fontSize: 13, color: colors.text },
  muted: { fontSize: 13, color: colors.textSecondary },
  bottomRow: { flexDirection: "row", alignItems: "center", marginTop: 2 },
  flex: { flex: 1 },
  priceLine: { fontSize: 13, color: colors.text },
  price: { fontSize: 15, fontWeight: "800" },
});
