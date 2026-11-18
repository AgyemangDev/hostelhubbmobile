import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Icon } from "../../ui";
import { useFavorites } from "../../../context/FavoritesContext";

/**
 * Heart in the corner of a listing photo; saves or unsaves the place.
 * Drawn as an outline over a translucent fill so it reads on any photo.
 */
export default function SaveHeartButton({ id, style }) {
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
      style={[styles.heart, style]}
    >
      <Icon name="heart" size={26} color={saved ? "#FF385C" : "rgba(0,0,0,0.35)"} />
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Icon name="heart-outline" size={26} tone="inverse" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  heart: { position: "absolute", top: 14, right: 14, width: 26, height: 26 },
});
