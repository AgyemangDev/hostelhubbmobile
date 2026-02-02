import React, { createContext, useContext, useMemo } from "react";
import { useAccommodations } from "../hooks/accommodationContext/useAccommodations";
import { useRandomAccommodations } from "../hooks/accommodationContext/useRandomAccommodations";
import { useFilters } from "../hooks/accommodationContext/useFilters";
import { supabase } from "../app/firebase/supabaseConfig";
import { UserContext } from "./UserContext";

export const AccommodationContext = createContext();

export const AccommodationProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  // Paginated accommodations
  const { accommodations, loading, loadMore, hasMore } = useAccommodations();

  // Random accommodations
  const { accommodations: randomAccommodationsRaw, loading: randomLoading, error: randomError } =
    useRandomAccommodations(40);

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

  const updateUserSchool = async (schoolValue) => {
    if (!user?.uid) return;
    try {
      const { error } = await supabase
        .from("Student_Users")
        .update({ institution: schoolValue })
        .eq("id", user.uid);
      if (error) console.error("School update error:", error);
    } catch (err) {
      console.error("School update failed:", err);
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

      filters,
      setFilters,
      clearFilters,
      updateUserSchool,
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
      filters,
      setFilters,
      clearFilters,
      updateUserSchool,
    ]
  );

  return (
    <AccommodationContext.Provider value={value}>
      {children}
    </AccommodationContext.Provider>
  );
};