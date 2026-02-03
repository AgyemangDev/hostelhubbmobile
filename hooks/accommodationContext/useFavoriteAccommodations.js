import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { AccommodationContext } from "../../context/AccommodationContext";
import isEqual from "lodash.isequal"; // small helper to deeply compare arrays

export const useFavoriteAccommodations = (accommodationIds = []) => {
  const { fetchByIds } = useContext(AccommodationContext);

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Keep track of previous IDs
  const prevIdsRef = useRef([]);

  const fetchAccommodations = useCallback(async () => {
    if (!accommodationIds || accommodationIds.length === 0) {
      setAccommodations([]);
      return;
    }

    // Only fetch if IDs actually changed
    if (isEqual(prevIdsRef.current, accommodationIds)) return;

    prevIdsRef.current = accommodationIds;

    try {
      setLoading(true);
      setError(null);

      const data = await fetchByIds(accommodationIds);
      setAccommodations(data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch accommodations");
      setAccommodations([]);
    } finally {
      setLoading(false);
    }
  }, [accommodationIds, fetchByIds]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  return { accommodations, loading, error };
};
