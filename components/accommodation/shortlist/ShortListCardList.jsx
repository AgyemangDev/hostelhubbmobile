// Saved places on the Wishlists screen: the full listing card, one per row.
import React, { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { useFavorites } from "../../../context/FavoritesContext";
import { useFavoriteAccommodations } from "../../../hooks/accommodationContext/useFavoriteAccommodations";
import SkeletonCards from "../cards/SkeletonCard";
import ListingCard from "../cards/ListingCard";
import { Button, EmptyState } from "../../ui/ds";
import { space } from "../../../constants/theme";

export default function ShortListCardList() {
  const router = useRouter();
  const { getFavoriteIds, isLoading: favoritesLoading } = useFavorites();
  const favoriteIds = useMemo(() => getFavoriteIds(), [getFavoriteIds]);
  const { accommodations, loading, error } = useFavoriteAccommodations(favoriteIds);

  // Unsaving a place removes it right away, before the next fetch.
  const saved = useMemo(() => {
    const ids = new Set(favoriteIds.map(String));
    return (accommodations || []).filter((a) => ids.has(String(a.id)));
  }, [accommodations, favoriteIds]);

  if (favoritesLoading || (loading && saved.length === 0)) {
    return (
      <View style={styles.pad}>
        <SkeletonCards />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.pad}>
        <EmptyState icon="cloud-offline-outline" title="Couldn't load your places" body="Check your connection and open Wishlists again." />
      </View>
    );
  }

  if (saved.length === 0) {
    return (
      <View style={styles.pad}>
        <EmptyState
          icon="heart-outline"
          title="No saved places yet"
          body="As you search, tap the heart on places you like. They'll wait for you here."
          action={<Button title="Start exploring" onPress={() => router.push("/SearchScreen")} />}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={saved}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <ListingCard item={item} onPress={() => router.push({ pathname: "/hostel/[id]", params: { id: item.id } })} />
      )}
      ItemSeparatorComponent={() => <View style={{ height: space.xl }} />}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  pad: { flex: 1, paddingHorizontal: space.lg, paddingTop: space.xl },
  list: { paddingHorizontal: space.md + 2, paddingTop: space.xs, paddingBottom: space.xxxl },
});
