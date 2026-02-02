import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { supabase } from "../../app/firebase/supabaseConfig";
import { UserContext } from "../../context/UserContext";

const PAGE_SIZE = 20;

export const useAccommodations = () => {
  const { userInfo } = useContext(UserContext);
  const selectedUniversity = userInfo?.institution;

  const [accommodations, setAccommodations] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNumber = 0, replace = false) => {
      if (!selectedUniversity || (!replace && loadingRef.current)) return;

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        const from = pageNumber * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, error } = await supabase
          .from("accommodation")
          .select("*, room_types: accommodation_room_types(*)")
          .eq("institution", selectedUniversity)
          .eq("deleted", false)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (error) throw error;

        if (!data || data.length === 0) {
          setHasMore(false);
          if (replace) setAccommodations([]);
          return;
        }

        setAccommodations(prev => (replace ? data : [...prev, ...data]));
        setPage(pageNumber);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        setError(err.message);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [selectedUniversity]
  );

  useEffect(() => {
    setAccommodations([]);
    setPage(0);
    setHasMore(true);
    setError(null);

    if (selectedUniversity) {
      fetchPage(0, true);
    }
  }, [selectedUniversity, fetchPage]);

  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchPage(page + 1);
    }
  }, [page, hasMore, fetchPage]);

  const refresh = useCallback(() => {
    if (!loadingRef.current) {
      setHasMore(true);
      fetchPage(0, true);
    }
  }, [fetchPage]);

  return {
    accommodations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    selectedUniversity,
  };
};