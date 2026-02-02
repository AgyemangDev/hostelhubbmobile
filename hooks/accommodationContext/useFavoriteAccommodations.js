import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../app/firebase/supabaseConfig";

/**
 * Hook to fetch accommodations by a list of IDs
 * @param {string[]} accommodationIds - Array of accommodation IDs to fetch
 */
export const useFavoriteAccommodations = (accommodationIds = []) => {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccommodations = useCallback(async () => {
    if (!accommodationIds.length) {
      setAccommodations([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("accommodation")
        .select("*")
        .in("id", accommodationIds) // fetch only those with matching IDs
        .eq("deleted", false)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setAccommodations(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [accommodationIds]);

  useEffect(() => {
    fetchAccommodations();
  }, [fetchAccommodations]);

  return { accommodations, loading, error };
};