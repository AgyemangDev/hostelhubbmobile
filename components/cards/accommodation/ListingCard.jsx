// components/cards/accommodation/ListingCard.jsx
//
// The listing card, in two variants that share data rules (utils/listingFacts):
//   variant="rail"  home rows: square photo, text underneath, fixed width
//   variant="full"  search results: full-width card with swipeable photos
// Availability always shows as a tag on the photo, never as body text.
import React, { useMemo } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { PressableScale } from "../../ui";
import ListingPhoto from "../../media/accommodation/ListingPhoto";
import ListingPhotoCarousel from "../../media/accommodation/ListingPhotoCarousel";
import ListingSummary from "./ListingSummary";
import { availabilityTag, listingFacts, listingPlace } from "../../../utils/listingFacts";
import { money } from "../../../utils/formatMoney";

export { listingFacts };

export default function ListingCard({ item, onPress, variant = "full", style }) {
  const facts = useMemo(() => listingFacts(item), [item]);
  const tag = availabilityTag(item, facts);
  const place = listingPlace(item);
  const price = facts.fromPrice ? money(facts.fromPrice, { decimals: 0 }) : null;
  const a11y = [item.accommodation_name, place, tag?.label, price ? `from ${price} a year` : null].filter(Boolean).join(", ");
  const summary = (
    <ListingSummary
      name={item.accommodation_name}
      place={place}
      institution={item.institution}
      price={price}
      rating={facts.rating}
      reviews={facts.reviews}
      size={variant === "rail" ? "md" : "lg"}
    />
  );

  if (variant === "rail") {
    return (
      <PressableScale onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y} style={[styles.rail, style]}>
        <ListingPhoto item={item} tag={tag} style={{ aspectRatio: 1 }} />
        {summary}
      </PressableScale>
    );
  }

  return (
    <View style={[styles.full, style]}>
      <ListingPhotoCarousel item={item} tag={tag} onPress={onPress} />
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={a11y}>
        {summary}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { width: 236 },
  full: { width: "100%" },
});
