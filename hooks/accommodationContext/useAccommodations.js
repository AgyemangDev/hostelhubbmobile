import { useState, useEffect, useCallback, useRef, useContext } from "react";
import { UserContext } from "../../context/UserContext";
import API_BASE_URL from "../../utils/api/api";

const PAGE_SIZE = 20;

export const useAccommodations = () => {
  const { userInfo, user } = useContext(UserContext); // get user from context
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
      if (!user) {
        setError("User not authenticated");
        return;
      }

      try {
        loadingRef.current = true;
        setLoading(true);
        setError(null);

        // Get Firebase ID token
        const idToken = await user.getIdToken(false); // use cached token

        // Call backend API
        const response = await fetch(
          `${API_BASE_URL}/api/accommodations?institution=${encodeURIComponent(
            selectedUniversity
          )}&page=${pageNumber}&pageSize=${PAGE_SIZE}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch accommodations");
        }

        const result = await response.json();
        const data = result.data || [];

        if (replace) {
          setAccommodations(data);
        } else {
          setAccommodations((prev) => [...prev, ...data]);
        }

        setPage(pageNumber);
        setHasMore(data.length === PAGE_SIZE); // if less than PAGE_SIZE, no more data
      } catch (err) {
        console.error("Accommodations fetch error:", err);
        setError(err.message);
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [selectedUniversity, user]
  );

  // Fetch first page when university changes
  useEffect(() => {
    setAccommodations([]);
    setPage(0);
    setHasMore(true);
    setError(null);

    if (selectedUniversity) {
      fetchPage(0, true);
    }
  }, [selectedUniversity, fetchPage]);

  // Load next page
  const loadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      fetchPage(page + 1);
    }
  }, [page, hasMore, fetchPage]);

  // Refresh all data
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
