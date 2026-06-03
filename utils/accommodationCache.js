// utils/hostelCache.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@accommodation_cache';

/**
 * Get cached hostels from AsyncStorage
 */
export const getCachedAccommodation = async () => {
  try {
    const cached = await AsyncStorage.getItem(CACHE_KEY);
    if (!cached) return {};
    
    const hostels = JSON.parse(cached);
    return hostels;
  } catch (error) {
    console.error('❌ Error loading cache:', error);
    return {};
  }
};

/**
 * Add new hostels to cache (only if not already cached)
 */
export const addToCache = async (hostels) => {
  try {
    if (!hostels || hostels.length === 0) return;

    const cached = await getCachedAccommodation();
    let newCount = 0;

    hostels.forEach((hostel) => {
      // Only cache if not already present
      if (!cached[hostel.id]) {
        cached[hostel.id] = {
          id: hostel.id,
          hostelName: hostel.accommodation_name,
          frontImage: hostel.front_image,
          latitude: hostel.latitude,
          longitude: hostel.longitude,
        };
        newCount++;
      }
    });

    if (newCount > 0) {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cached));
      console.log(`✅ Added ${newCount} new hostels to cache. Total: ${Object.keys(cached).length}`);
    }
  } catch (error) {
    console.error('❌ Error adding to cache:', error);
  }
};

/**
 * Get all cached hostels as an array
 */
export const getCachedAccommodationArray = async () => {
  try {
    const cached = await getCachedAccommodation();
    return Object.values(cached);
  } catch (error) {
    console.error('❌ Error getting cached array:', error);
    return [];
  }
};

/**
 * Clear all cached hostels
 */
export const clearCache = async () => {
  try {
    await AsyncStorage.removeItem(CACHE_KEY);
    console.log('🗑️ Cache cleared');
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
};

/**
 * Get cache stats
 */
export const getCacheStats = async () => {
  try {
    const cached = await getCachedAccommodation();
    const count = Object.keys(cached).length;
    
    console.log('📊 Cache stats:', {
      totalHostels: count,
      ids: Object.keys(cached)
    });
    
    return { count, ids: Object.keys(cached) };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return { count: 0, ids: [] };
  }
};