import React from "react";
import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PressableScale } from "../../ui";
import { useFavorites } from "../../../context/FavoritesContext";
import { colors } from "../../../constants/theme";

/**
 * Heart over a listing photo (Airbnb-style): white outline on a soft dark
 * fill, solid when saved. Hostels and hubclips save to the same favourites.
 */
export default function FavoriteHeartButton({ id, kind, size = 24, style }) {
  const { isFavorite, toggleFavorite, isClipFavorite, toggleClipFavorite } = useFavorites();
  const clip = kind === "hubclip";
  const saved = clip ? isClipFavorite(id) : isFavorite(id);
  const toggle = () => (clip ? toggleClipFavorite(id) : toggleFavorite(id));

  return (
    <PressableScale onPress={toggle} hitSlop={10} accessibilityRole="button" accessibilityLabel={saved ? "Remove from saved" : "Save"} style={style}>
      <View>
        <Ionicons name="heart" size={size} color={saved ? colors.danger : "rgba(0,0,0,0.35)"} style={styles.layer} />
        <Ionicons name="heart-outline" size={size} color={colors.textInverse} />
      </View>
    </PressableScale>
  );
}

const styles = StyleSheet.create({
  layer: { position: "absolute" },
});
