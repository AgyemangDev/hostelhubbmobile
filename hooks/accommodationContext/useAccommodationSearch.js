import { useState, useEffect, useCallback, useContext } from "react";
import { supabase } from "../../app/firebase/supabaseConfig";
import { UserContext } from "../../context/UserContext";

export const useAccommodationSearch = (searchQuery) => {
  const { userInfo } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchResults = useCallback(async () => {
    if (!selectedUniversity || !searchQuery) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Split query into words for partial/fuzzy matching
      const queryWords = searchQuery.trim().split(/\s+/);

      // Build OR conditions for each field with ILIKE
      let filters = [];
      queryWords.forEach((word) => {
        filters.push(`accommodation_name.ilike.%${word}%`);
      });

      // Supabase does not support direct OR with multiple columns dynamically in one call,
      // so we use `or` string
      const orString = filters.join(",");

      const { data, error } = await supabase
        .from("accommodation")
        .select("*")
        .eq("institution", selectedUniversity)
        .eq("deleted", false)
        .or(orString)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setResults(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedUniversity]);

  useEffect(() => {
    fetchSearchResults();
  }, [fetchSearchResults]);

  return { results, loading, error };
};