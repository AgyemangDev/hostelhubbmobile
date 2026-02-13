// context/AccommodationContext.jsx - WITH AUTO-CACHING (FIXED)

import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { useAccommodations } from "../hooks/accommodationContext/useAccommodations";
import { useRandomAccommodations } from "../hooks/accommodationContext/useRandomAccommodations";
import { useAccommodationSearch } from "../hooks/accommodationContext/useAccommodationSearch";
import { useFilters } from "../hooks/accommodationContext/useFilters";
import { UserContext } from "./UserContext";
import API_BASE_URL from "../utils/api/api";
import { addToCache, getCachedAccommodationArray } from "../utils/accommodationCache";

export const AccommodationContext = createContext();

export const AccommodationProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [cachedHostels, setCachedHostels] = useState([]);

  // Paginated accommodations
  const { accommodations, loading, loadMore, hasMore } = useAccommodations();

  // Random accommodations
  const { accommodations: randomAccommodationsRaw, loading: randomLoading, error: randomError } =
    useRandomAccommodations(40);

  // Search accommodations
  const { accommodations: searchAccommodationsRaw, loading: searchLoading, error: searchError } =
    useAccommodationSearch(searchQuery);

  // Filters hook
  const { filters, setFilters, clearFilters, applyFilters } = useFilters([0, 30000]);

  // Apply filters
  const filteredAccommodations = useMemo(
    () => applyFilters(accommodations),
    [accommodations, applyFilters]
  );

  const filteredRandomAccommodations = useMemo(
    () => applyFilters(randomAccommodationsRaw || []),
    [randomAccommodationsRaw, applyFilters]
  );

  const filteredSearchAccommodations = useMemo(
    () => applyFilters(searchAccommodationsRaw || []),
    [searchAccommodationsRaw, applyFilters]
  );

  // Load cached hostels on mount
  useEffect(() => {
    const loadCache = async () => {
      const cached = await getCachedAccommodationArray();
      setCachedHostels(cached);
      console.log('📦 Loaded cache on mount:', cached.length, 'hostels');
    };
    loadCache();
  }, []);

  // Auto-cache paginated accommodations
  useEffect(() => {
    const cacheAndReload = async () => {
      if (accommodations.length > 0) {
        await addToCache(accommodations);
        const updated = await getCachedAccommodationArray();
        setCachedHostels(updated);
        console.log('📊 Paginated Accommodations:', {
          total: accommodations.length,
          filtered: filteredAccommodations.length,
          loading,
          hasMore,
          cached: updated.length,
        });
      }
    };
    cacheAndReload();
  }, [accommodations]);

  // Auto-cache random accommodations
  useEffect(() => {
    const cacheAndReload = async () => {
      if (randomAccommodationsRaw && randomAccommodationsRaw.length > 0) {
        await addToCache(randomAccommodationsRaw);
        const updated = await getCachedAccommodationArray();
        setCachedHostels(updated);
        console.log('🎲 Random Accommodations:', {
          total: randomAccommodationsRaw.length,
          filtered: filteredRandomAccommodations.length,
          loading: randomLoading,
          error: randomError,
          cached: updated.length,
        });
      }
    };
    cacheAndReload();
  }, [randomAccommodationsRaw]);

  // Auto-cache search accommodations
  useEffect(() => {
    const cacheAndReload = async () => {
      if (searchAccommodationsRaw && searchAccommodationsRaw.length > 0) {
        await addToCache(searchAccommodationsRaw);
        const updated = await getCachedAccommodationArray();
        setCachedHostels(updated);
        console.log('🔍 Search Accommodations:', {
          query: searchQuery,
          total: searchAccommodationsRaw.length,
          filtered: filteredSearchAccommodations.length,
          loading: searchLoading,
          error: searchError,
          cached: updated.length,
        });
      }
    };
    cacheAndReload();
  }, [searchAccommodationsRaw]);

  // Log filters
  useEffect(() => {
    console.log('🎛️ Active Filters:', filters);
  }, [filters]);

  // Fetch accommodations by IDs (for favorites)
  const fetchByIds = async (ids) => {
    if (!ids || ids.length === 0 || !user) return [];

    console.log('🔖 Fetching accommodations by IDs:', ids);

    try {
      const idToken = await user.getIdToken(false);

      const promises = ids.map(id =>
        fetch(`${API_BASE_URL}/api/accommodations/${id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${idToken}`,
            'Content-Type': 'application/json',
          },
        }).then(res => res.ok ? res.json() : null)
      );

      const results = await Promise.all(promises);
      const favorites = results
        .filter(result => result && result.data)
        .map(result => result.data);

      // Cache favorites too
      if (favorites.length > 0) {
        await addToCache(favorites);
        const updated = await getCachedAccommodationArray();
        setCachedHostels(updated);
      }

      console.log('✅ Fetched Favorites:', {
        requested: ids.length,
        received: favorites.length,
      });

      return favorites;
    } catch (err) {
      console.error('❌ Fetch by IDs error:', err);
      return [];
    }
  };

  const value = useMemo(
    () => ({
      accommodations: filteredAccommodations,
      rawAccommodations: accommodations,
      loading,
      loadMore,
      hasMore,

      randomAccommodations: filteredRandomAccommodations,
      randomLoading,
      randomError,

      searchAccommodations: filteredSearchAccommodations,
      searchLoading,
      searchError,
      searchQuery,
      setSearchQuery,

      filters,
      setFilters,
      clearFilters,
      
      fetchByIds,
      
      // Cached hostels for map
      cachedHostels,
    }),
    [
      filteredAccommodations,
      accommodations,
      loading,
      loadMore,
      hasMore,
      filteredRandomAccommodations,
      randomLoading,
      randomError,
      filteredSearchAccommodations,
      searchLoading,
      searchError,
      searchQuery,
      filters,
      setFilters,
      clearFilters,
      user,
      cachedHostels,
    ]
  );

  return (
    <AccommodationContext.Provider value={value}>
      {children}
    </AccommodationContext.Provider>
  );
};