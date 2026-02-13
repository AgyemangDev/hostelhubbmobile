// components/BookingsComponent/ShortListCardList.jsx - ADD REFETCH

import React, { useEffect,useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useFavorites } from "../../context/FavoritesContext";
import { useFavoriteAccommodations } from "../../hooks/accommodationContext/useFavoriteAccommodations";
import SkeletonCards from "../Loading/SkeletonCard";
import WishlistHeader from "../Headers/WishlistHeader";
import EmptyState from "./EmptyState";
import HostelList from "./HostelList";

const ShortListCardList = () => {
  const router = useRouter();
  const { getFavoriteIds, isLoading: favoritesLoading } = useFavorites();

  const favoriteIds = useMemo(() => getFavoriteIds(), [getFavoriteIds]);


  const { 
    accommodations: favoriteHostels, 
    loading: favoriteHostelsLoading, 
    error
  } = useFavoriteAccommodations(favoriteIds);

  if (favoritesLoading || favoriteHostelsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <SkeletonCards />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <EmptyState message={`Error loading favorites: ${error}`} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WishlistHeader count={favoriteHostels.length} />
      {favoriteHostels.length > 0 ? (
        <HostelList data={favoriteHostels} navigation={router} />
      ) : (
        <EmptyState />
      )}
    </View>
  );
};


export default ShortListCardList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
});