// components/accommodation/cards/ListingCard.jsx
//
// Two listing cards that share data rules:
//   variant="rail"  home rows: square photo, text underneath, fixed width
//   variant="full"  search results: Airbnb full-width card with swipeable photos
// Availability always shows as a tag on the photo, never as body text.
import React, { useMemo, useState } from "react";
import { FlatList, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFavorites } from "../../../context/FavoritesContext";
import { PressableScale, money } from "../../ui/ds";
import { colors, radius, space, type } from "../../../constants/theme";

const FEE_RATE = 0.05;
const CATEGORY = { hostel: "Hostel", homestel: "Homestel", apartment: "Apartment" };

/** Lowest yearly price students pay (room price + 5%) and rooms available. */
export function listingFacts(item) {
  const rooms = Array.isArray(item?.room_types) ? item.room_types : [];
  const prices = rooms.map((r) => Number(r.price)).filter((p) => Number.isFinite(p) && p > 0);
  const roomsLeft = rooms.reduce((n, r) => n + (Number(r.rooms_available) || 0), 0);
  return {
    fromPrice: prices.length ? Math.min(...prices) * (1 + FEE_RATE) : null,
    roomsLeft: rooms.length ? roomsLeft : null,
    rating: Number(item?.rating ?? item?.average_rating) || null,
    reviews: Number(item?.reviews_count ?? item?.review_count) || null,
  };
}

function availabilityTag(item, facts) {
  if (item.accommodation_availability === false || facts.roomsLeft === 0) return { label: "Fully booked", booked: true };
  if (facts.roomsLeft) return { label: `Room${facts.roomsLeft === 1 ? "" : "s"} available`, booked: false };
  if (item.accommodation_availability === true) return { label: "Available", booked: false };
  return null;
}

function Heart({ id }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const saved = isFavorite(id);
  return (
    <Pressable
      onPress={(e) => {
        e?.stopPropagation?.();
        toggleFavorite(id);
      }}
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? "Remove from saved" : "Save"}
      hitSlop={10}
      style={styles.heart}
    >
      <Ionicons name="heart" size={26} color={saved ? "#FF385C" : "rgba(0,0,0,0.35)"} style={StyleSheet.absoluteFill} />
      <Ionicons name="heart-outline" size={26} color="#FFFFFF" style={StyleSheet.absoluteFill} />
    </Pressable>
  );
}

function Tag({ tag }) {
  if (!tag) return null;
  return (
    <View style={[styles.tag, tag.booked ? styles.tagBooked : styles.tagOpen]}>
      {!tag.booked ? <View style={styles.tagDot} /> : null}
      <Text style={[styles.tagText, { color: tag.booked ? colors.textInverse : colors.text }]}>{tag.label}</Text>
    </View>
  );
}

function Photo({ item, tag, style }) {
  return (
    <View>
      <Image source={{ uri: item.front_image }} style={[styles.photo, style, tag?.booked && { opacity: 0.7 }]} resizeMode="cover" />
      <Tag tag={tag} />
      <Heart id={item.id} />
    </View>
  );
}

function Rating({ facts }) {
  if (!facts.rating) return null;
  return (
    <View style={styles.rating}>
      <Ionicons name="star" size={12} color={colors.text} />
      <Text style={[type.caption, { fontWeight: "700", color: colors.text }]}>
        {facts.rating.toFixed(2)}
        {facts.reviews ? ` (${facts.reviews})` : ""}
      </Text>
    </View>
  );
}

export default function ListingCard({ item, onPress, variant = "full", style }) {
  const facts = useMemo(() => listingFacts(item), [item]);
  const tag = availabilityTag(item, facts);
  const category = CATEGORY[String(item.category || "").toLowerCase()] || null;
  const place = [category, item.location].filter(Boolean).join(" in ");
  const price = facts.fromPrice ? money(facts.fromPrice, { decimals: 0 }) : null;
  const a11y = [item.accommodation_name, place, tag?.label, price ? `from ${price} a year` : null].filter(Boolean).join(", ");

  if (variant === "rail") {
    return (
      <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y} style={[styles.rail, style]}>
        <Photo item={item} tag={tag} style={{ aspectRatio: 1 }} />
        <View style={styles.railText}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, { fontSize: 15 }]} numberOfLines={1}>{item.accommodation_name}</Text>
            <Rating facts={facts} />
          </View>
          {place ? <Text style={styles.sub} numberOfLines={1}>{place}</Text> : null}
          {item.institution ? <Text style={styles.sub} numberOfLines={1}>Near {item.institution}</Text> : null}
          {price ? (
            <Text style={styles.price} numberOfLines={1}>
              <Text style={{ color: colors.textSecondary }}>From</Text>
              <Text style={{ fontWeight: "800" }}> {price}</Text>
              <Text style={{ color: colors.textSecondary }}> a year</Text>
            </Text>
          ) : null}
        </View>
      </PressableScale>
    );
  }

  return (
    <View style={[styles.full, style]}>
      <PhotoCarousel item={item} tag={tag} onPress={onPress} />
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y} style={styles.fullText}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { fontSize: 16 }]} numberOfLines={1}>{item.accommodation_name}</Text>
          <Rating facts={facts} />
        </View>
        {place ? <Text style={styles.sub} numberOfLines={1}>{place}</Text> : null}
        {item.institution ? <Text style={styles.sub} numberOfLines={1}>Near {item.institution}</Text> : null}
        {price ? (
          <Text style={[styles.price, { marginTop: 4 }]} numberOfLines={1}>
            <Text style={{ color: colors.textSecondary }}>From</Text>
            <Text style={{ fontWeight: "800" }}> {price}</Text>
            <Text style={{ color: colors.textSecondary }}> a year</Text>
          </Text>
        ) : null}
      </Pressable>
    </View>
  );
}

/** Up to 5 photos: the front photo, the hostel's gallery, then room photos. */
function photosOf(item) {
  const all = [item.front_image, ...(item.images || []), ...(item.room_types || []).flatMap((r) => r.images || [])]
    .filter((u) => typeof u === "string" && u);
  return [...new Set(all)].slice(0, 5);
}

function PhotoCarousel({ item, tag, onPress }) {
  const photos = useMemo(() => photosOf(item), [item]);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const list = photos.length ? photos : [null];

  return (
    <View style={styles.carousel} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <FlatList
          data={list}
          keyExtractor={(u, i) => `${i}-${u}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={list.length > 1}
          onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
          renderItem={({ item: uri }) => (
            <Pressable onPress={onPress} accessibilityRole="imagebutton" accessibilityLabel={`Photo of ${item.accommodation_name}`}>
              <Image source={uri ? { uri } : undefined} style={{ width, height: width, backgroundColor: colors.fill, opacity: tag?.booked ? 0.7 : 1 }} resizeMode="cover" />
            </Pressable>
          )}
        />
      ) : null}
      <Tag tag={tag} />
      <Heart id={item.id} />
      {list.length > 1 ? (
        <View pointerEvents="none" style={styles.dots}>
          {list.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  photo: { width: "100%", borderRadius: radius.xl, backgroundColor: colors.fill },
  heart: { position: "absolute", top: 14, right: 14, width: 26, height: 26 },
  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  tagOpen: { backgroundColor: "rgba(255,255,255,0.96)" },
  tagBooked: { backgroundColor: "rgba(28,25,23,0.88)" },
  tagDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  tagText: { fontSize: 12, fontWeight: "800" },

  rail: { width: 236 },
  railText: { gap: 2, paddingTop: space.sm, paddingHorizontal: 2 },

  titleRow: { flexDirection: "row", alignItems: "flex-start", gap: space.xs },
  title: { flex: 1, fontWeight: "800", lineHeight: 21, color: colors.text },
  rating: { flexDirection: "row", alignItems: "center", gap: 3, paddingTop: 3 },
  sub: { ...type.body, color: colors.textSecondary, flexShrink: 1 },
  price: { ...type.body, color: colors.text, marginTop: 2 },

  full: { width: "100%" },
  fullText: { gap: 2, paddingTop: space.sm, paddingHorizontal: 2 },
  carousel: { width: "100%", aspectRatio: 1, borderRadius: radius.xl, overflow: "hidden", backgroundColor: colors.fill },
  dots: { position: "absolute", bottom: 12, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.6)" },
  dotOn: { backgroundColor: "#FFFFFF", transform: [{ scale: 1.2 }] },
});
