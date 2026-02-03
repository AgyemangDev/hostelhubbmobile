// context/AccommodationContext.jsx - ADD FAVORITES

import React, { createContext, useContext, useMemo, useState } from "react";
import { useAccommodations } from "../hooks/accommodationContext/useAccommodations";
import { useRandomAccommodations } from "../hooks/accommodationContext/useRandomAccommodations";
import { useAccommodationSearch } from "../hooks/accommodationContext/useAccommodationSearch";
import { useFilters } from "../hooks/accommodationContext/useFilters";
import { UserContext } from "./UserContext";
import API_BASE_URL from "../utils/api/api";

export const AccommodationContext = createContext();

export const AccommodationProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [searchQuery, setSearchQuery] = useState("");

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

  // Apply filters to paginated and random accommodations
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

  // Fetch accommodations by IDs (for favorites)
  const fetchByIds = async (ids) => {
    if (!ids || ids.length === 0 || !user) return [];

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
      return results
        .filter(result => result && result.data)
        .map(result => result.data);
    } catch (err) {
      console.error('Fetch by IDs error:', err);
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
    ]
  );

  return (
    <AccommodationContext.Provider value={value}>
      {children}
    </AccommodationContext.Provider>
  );
};