import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../../context/FavoritesContext';

const FavoriteButton = ({ accommodationId }) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const isStarred = isFavorite(accommodationId);

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={(e) => { e?.stopPropagation?.(); toggleFavorite(accommodationId); }}
      activeOpacity={0.8}
    >
      <Ionicons
        name={isStarred ? "heart" : "heart-outline"}
        size={20}
        color={isStarred ? "#FF385C" : "#ffffff"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    borderRadius: 50,
    width: 34,
    height: 34,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default FavoriteButton;