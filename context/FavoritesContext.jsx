// context/FavoritesContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from './UserContext';

export const FavoritesContext = createContext();

const STORAGE_KEY = 'userFavorites';

export const FavoritesProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (user?.uid) {
          const key = `${STORAGE_KEY}_${user.uid}`;
          const stored = await AsyncStorage.getItem(key);
          if (stored) {
            const parsed = JSON.parse(stored);
            setFavorites(new Set(parsed));
            console.log('Loaded favorites:', parsed.length);
          }
        } else {
          // Clear favorites if no user
          setFavorites(new Set());
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFavorites();
  }, [user?.uid]);

  // Save favorites to AsyncStorage
  const saveFavorites = useCallback(async (newFavorites) => {
    try {
      if (user?.uid) {
        const key = `${STORAGE_KEY}_${user.uid}`;
        const favArray = Array.from(newFavorites);
        await AsyncStorage.setItem(key, JSON.stringify(favArray));
      }
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }, [user?.uid]);

  // Toggle favorite for a specific accommodation
  const toggleFavorite = useCallback((accommodationId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites);
      
      if (newFavorites.has(accommodationId)) {
        newFavorites.delete(accommodationId);
        console.log('Removed from favorites:', accommodationId);
      } else {
        newFavorites.add(accommodationId);
        console.log('Added to favorites:', accommodationId);
      }
      
      // Save to AsyncStorage
      saveFavorites(newFavorites);
      
      return newFavorites;
    });
  }, [saveFavorites]);

  // Check if an accommodation is favorited
  const isFavorite = useCallback((accommodationId) => {
    return favorites.has(accommodationId);
  }, [favorites]);

  // Hubclips share the same saved set, stored as "clip:<id>" so they never
  // mix with accommodation ids (the saved hostels list fetches those by id).
  const CLIP = 'clip:';
  const clipKey = (id) => `${CLIP}${id}`;
  const toggleClipFavorite = useCallback((clipId) => toggleFavorite(clipKey(clipId)), [toggleFavorite]);
  const isClipFavorite = useCallback((clipId) => favorites.has(clipKey(clipId)), [favorites]);
  const getFavoriteClipIds = useCallback(
    () => Array.from(favorites).filter((id) => String(id).startsWith(CLIP)).map((id) => String(id).slice(CLIP.length)),
    [favorites]
  );

  // Saved accommodation ids only (clips excluded).
  const getFavoriteIds = useCallback(() => {
    return Array.from(favorites).filter((id) => !String(id).startsWith(CLIP));
  }, [favorites]);

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    try {
      setFavorites(new Set());
      if (user?.uid) {
        const key = `${STORAGE_KEY}_${user.uid}`;
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.error('Error clearing favorites:', error);
    }
  }, [user?.uid]);

  const value = {
    favorites: Array.from(favorites).filter((id) => !String(id).startsWith('clip:')),
    isLoading,
    toggleFavorite,
    isFavorite,
    getFavoriteIds,
    clearFavorites,
    toggleClipFavorite,
    isClipFavorite,
    getFavoriteClipIds,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook for easier usage
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
};