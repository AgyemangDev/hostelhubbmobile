import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { AccommodationContext } from "../../context/AccommodationContext";
import isEqual from "lodash.isequal";

export const useFavoriteAccommodations = (accommodationIds = []) => {
  const { fetchByIds } = useContext(AccommodationContext);

  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const prevIdsRef = useRef([]);

  const fetchAccommodations = useCallback(async () => {
    // Compare with previous IDs
    if (isEqual(prevIdsRef.current, accommodationIds)) return;

    prevIdsRef.current = accommodationIds;

    if (!accommodationIds || accommodationIds.length === 0) {
      setAccommodations([]);
      return;
    }

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
  }, [fetchByIds, accommodationIds]);

  // ✅ Only run once per render OR when IDs actually change
  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  return { accommodations, loading, error };
};
