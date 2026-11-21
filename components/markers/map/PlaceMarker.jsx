import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { priceTag } from "../../../utils/mapFormat";
import { colors } from "../../../constants/theme";

const INK = colors.text;

/**
 * One place on the map, Airbnb-style:
 *   white pill with the price, black when selected, light grey once viewed.
 *   Hubclips carry a small play icon, since they open a video tour.
 * Zoomed out (`compact`), pills shrink to dots so the map stays readable.
 */
export default function PlaceMarker({ place, kind, selected, visited, compact, onPress }) {
  // Custom views must be tracked once to draw, then frozen for smooth panning.
  const [track, setTrack] = useState(true);
  useEffect(() => {
    setTrack(true);
    const t = setTimeout(() => setTrack(false), 600);
    return () => clearTimeout(t);
  }, [selected, visited, compact]);

  const clip = kind === "hubclip";
  const price = priceTag(clip ? place.price : place.min_price);
  const label = price || (place.name || "").split(" ").slice(0, 2).join(" ");

  const bg = selected ? INK : visited ? colors.fill : colors.surface;
  const fg = selected ? colors.textInverse : INK;

  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={(e) => { e.stopPropagation?.(); onPress(place, kind); }}
      tracksViewChanges={track}
      anchor={{ x: 0.5, y: 0.5 }}
      zIndex={selected ? 1000 : 1}
      accessibilityLabel={`${clip ? "Hubclip" : "Hostel"}: ${place.name}${price ? `, ${price}` : ""}`}
    >
      {compact ? (
        <View style={styles.dotHit}>
          <View style={[styles.dot, selected && styles.dotSelected, { backgroundColor: selected ? INK : clip ? INK : colors.brand }]} />
        </View>
      ) : (
        <View style={styles.hit}>
          <View style={[styles.pill, { backgroundColor: bg }, selected && styles.pillSelected]}>
            {clip ? <Ionicons name="play" size={11} color={fg} /> : null}
            <Text style={[styles.text, { color: fg }]} numberOfLines={1}>{label}</Text>
          </View>
        </View>
      )}
    </Marker>
  );
}

const styles = StyleSheet.create({
  hit: { padding: 6 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.12)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  pillSelected: { transform: [{ scale: 1.12 }], borderColor: INK },
  text: { fontSize: 13, fontWeight: "800", maxWidth: 120, letterSpacing: -0.1 },
  dotHit: { padding: 6 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.surface },
  dotSelected: { width: 18, height: 18, borderRadius: 9 },
});
